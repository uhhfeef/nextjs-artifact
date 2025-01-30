import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transpiledCode = req.query.code as string;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/recharts@2.8.0/umd/recharts.min.js"></script>
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
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
            // ...other Recharts components
          } = Recharts;

          try {
            ${transpiledCode
              .replace(/import\s+{.*}\s+from\s+['"]react['"];?/g, '')
              .replace(/import\s+{.*}\s+from\s+['"]recharts['"];?/g, '')}
            
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

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}