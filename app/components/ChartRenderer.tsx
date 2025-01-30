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
          body { margin: 0; padding: 16px; background-color: black; color: white; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const { createElement, useState, useEffect } = React;
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
          } = Recharts;

          try {
            ${processedCode}
            
            const root = document.getElementById('root');
            render(createElement(App), root);
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
      style={{ width: '100%', height: '400px', border: 'none' }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-modals"
      title="Chart Renderer"
    />
  );
}
