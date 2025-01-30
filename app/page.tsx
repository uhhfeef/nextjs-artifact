'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import dynamic from 'next/dynamic';
import './split.css';
import React from 'react';
import initSwc, { transformSync } from "@swc/wasm-web";
import ChartRenderer from './components/ChartRenderer';

const SplitPane = dynamic(() => import('react-split'), {
  ssr: false,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CodePreview = ({ code }: { code: string }) => {
  const [transpiledCode, setTranspiledCode] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function importAndRunSwcOnMount() {
      await initSwc();
      setInitialized(true);
    }
    importAndRunSwcOnMount();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try {
      const output = transformSync(code, {
        jsc: {
          parser: {
            syntax: "ecmascript",
            jsx: true
          },
          target: "es2018",
          loose: false,
          minify: {
            compress: false,
            mangle: false
          }
        },
        module: {
          type: "es6"
        },
        minify: false,
        isModule: true
      });
      setTranspiledCode(output.code);
    } catch (error) {
      console.error('Transformation error:', error);
      setTranspiledCode('Error transforming code');
    }
  }, [initialized, code]);

  if (!initialized) {
    return <div>Initializing transpiler...</div>;
  }

  return <ChartRenderer transpiledCode={transpiledCode} />;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function importAndRunSwcOnMount() {
      await initSwc();
      setInitialized(true);
    }
    importAndRunSwcOnMount();
  }, []);


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      });

      const data = await response.json();
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string, role: 'user' | 'assistant') => {
    if (content.includes("<code>") && content.includes("</code>")) {
      return null
    }
    return (
      <div className={`flex ${role === 'assistant' ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`max-w-[80%] rounded-lg p-4 ${
          role === 'assistant' ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'
        }`}>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  };

  const renderCodeContent = (content: string, role: 'user' | 'assistant') => {
    if (content.includes("<code>") && content.includes("</code>")) {
      const codeContent = content.substring(
        content.indexOf("<code>") + 6,
        content.indexOf("</code>")
      );
      console.log("codeContent", codeContent);

      return (
        <div className={`flex ${role === 'assistant' ? 'justify-start' : 'justify-end'} mb-4`}>
          <div className={`w-full rounded-lg ${
            role === 'assistant' ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'
          }`}>
            <CodePreview code={codeContent} />
          </div>
        </div>
      );
    }
  }

  const hasCode = messages.some(message => message.content.includes("<code>"));

  const renderChatInterface = (containerClass: string) => (
    <div className={`flex flex-col ${containerClass} bg-gray-100`}>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {renderMessageContent(message.content, message.role)}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 p-3 rounded-lg">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );

  if (!mounted) {
    return <div className="h-screen flex">Loading...</div>;
  }

  return (
    <div suppressHydrationWarning>
      <main className="flex flex-col h-screen ">
        {isClient && (
          <SplitPane
            className="split h-screen"
            sizes={hasCode ? [60, 40] : [100, 0]}
            minSize={hasCode ? 300 : 0}
            gutterSize={hasCode ? 4 : 0}
            snapOffset={30}
          >
            <div className="flex flex-col h-full bg-white">
              {renderChatInterface('h-full')}
            </div>
            <div className={`h-full bg-gray-900 ${!hasCode ? 'hidden' : ''}`}>
              {messages.map((message, index) => (
                <div key={index}>
                  {renderCodeContent(message.content, message.role)}
                </div>
              ))}
            </div>
          </SplitPane>
        )}
      </main>
    </div>
  );
}
