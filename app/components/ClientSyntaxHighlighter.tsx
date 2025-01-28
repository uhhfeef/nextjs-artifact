'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  code: string;
}

export default function ClientSyntaxHighlighter({ code }: Props) {
  // Force client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <SyntaxHighlighter
      language="python"
      style={vscDarkPlus}
      className="rounded-md"
      customStyle={{
        fontSize: '13px',
        margin: 0,
        padding: '1rem',
        height: 'auto',
        minHeight: 'auto',
        background: '#1E1E1E'
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
