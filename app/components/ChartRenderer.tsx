'use client';

import { useEffect, useRef } from 'react';

interface ChartRendererProps {
  transpiledCode: string;
}

export default function ChartRenderer({ transpiledCode }: ChartRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const processedCode = transpiledCode
      .replace(/import\s+.*?from\s+['"]react['"];?/g, '')
      .replace(/import\s+.*?from\s+['"]recharts['"];?/g, '')
      .replace(/export\s+default\s+/g, 'const App = ')
      .replace(/React\.createElement/g, 'createElement');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/prop-types/15.8.1/prop-types.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/recharts/2.10.4/Recharts.js"></script>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            background-color: white; 
            color: black; 
            position: relative;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
          #root {
            position: relative;
            height: 100%;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const { createElement, useState, useRef, Children } = React;
          const { render } = ReactDOM;
          const {
            LineChart,
            Line,
            XAxis,
            YAxis,
            CartesianGrid,
            Tooltip,
            Legend,
            BarChart,
            Bar,
            ResponsiveContainer
          } = Recharts;

          const Wrapper = ({ children }) => {
            const [position, setPosition] = useState({ x: 0, y: 0 });
            const [size, setSize] = useState({ width: 400, height: 300 });
            const [isDragging, setIsDragging] = useState(false);
            const [isResizing, setIsResizing] = useState(false);
            const startPosRef = useRef({ x: 0, y: 0 });
            const startSizeRef = useRef({ width: 0, height: 0 });
            const contentRef = useRef(null);

            const handleMouseDown = (e) => {
              if (e.target.classList.contains('drag-handle')) {
                setIsDragging(true);
                startPosRef.current = { x: e.clientX, y: e.clientY };
                e.preventDefault();
              } else if (e.target.classList.contains('resize-handle')) {
                setIsResizing(true);
                startPosRef.current = { x: e.clientX, y: e.clientY };
                startSizeRef.current = { ...size };
                e.preventDefault();
              }
            };

            const handleMouseMove = (e) => {
              if (isDragging) {
                const dx = e.clientX - startPosRef.current.x;
                const dy = e.clientY - startPosRef.current.y;
                setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                startPosRef.current = { x: e.clientX, y: e.clientY };
              } else if (isResizing) {
                const dx = e.clientX - startPosRef.current.x;
                const dy = e.clientY - startPosRef.current.y;
                
                const newWidth = Math.max(200, startSizeRef.current.width + dx);
                const newHeight = Math.max(150, startSizeRef.current.height + dy);
                
                setSize({
                  width: Math.round(newWidth),
                  height: Math.round(newHeight)
                });
              }
            };

            const handleMouseUp = () => {
              setIsDragging(false);
              setIsResizing(false);
            };

            // Always wrap children in a ResponsiveContainer if they're not already
            const wrappedChildren = Children.map(children, child => {
              if (!React.isValidElement(child)) return child;

              // If it's already a ResponsiveContainer, just ensure it has the right props
              if (child.type === ResponsiveContainer) {
                return React.cloneElement(child, {
                  width: '100%',
                  height: '100%'
                });
              }

              // Otherwise, wrap it in a ResponsiveContainer
              return createElement(ResponsiveContainer, {
                width: '100%',
                height: '100%'
              }, child);
            });

            return createElement('div', {
              style: {
                position: 'absolute',
                left: position.x + 'px',
                top: position.y + 'px',
                width: size.width + 'px',
                height: size.height + 'px',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: isResizing ? 'none' : 'all 0.1s ease-out'
              },
              onMouseDown: handleMouseDown,
              onMouseMove: handleMouseMove,
              onMouseUp: handleMouseUp,
              onMouseLeave: handleMouseUp,
            }, [
              createElement('div', {
                key: 'drag-handle',
                className: 'drag-handle',
                style: {
                  height: '30px',
                  backgroundColor: 'rgba(51, 51, 51, 0.8)',
                  cursor: 'grab',
                  userSelect: 'none',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff'
                },
              }, 'Drag here'),
              createElement('div', {
                key: 'content',
                ref: contentRef,
                style: { 
                  width: '100%', 
                  height: 'calc(100% - 30px)',
                  padding: '10px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                },
              }, wrappedChildren),
              createElement('div', {
                key: 'resize-handle',
                className: 'resize-handle',
                style: {
                  position: 'absolute',
                  right: '2px',
                  bottom: '2px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'black',
                  cursor: 'nwse-resize',
                  borderRadius: '50%',
                  opacity: 0.5
                },
              }),
            ]);
          };

          try {
            ${processedCode}
            
            const root = document.getElementById('root');
            render(createElement(Wrapper, null, createElement(App)), root);
          } catch (error) {
            console.error(error);
            root.innerHTML = '<div style="color: red">Error: ' + error.message + '</div>';
          }
        </script>
      </body>
    </html>
    `;

    const iframe = iframeRef.current;
    iframe.srcdoc = htmlContent;
  }, [transpiledCode]);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: '100%', height: '600px', border: 'none' }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-modals"
      title="Chart Renderer"
    />
  );
}