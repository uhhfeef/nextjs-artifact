'use client';

import { useState, useEffect } from 'react';
import initSwc, { transformSync } from "@swc/wasm-web";
import DynamicCharts from './DynamicCharts';

export default function Transpiler({ code }: { code: string }) {
    const [initialized, setInitialized] = useState(false);
    const [result, setResult] = useState<string>("");

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
        setResult(output.code);
      } catch (error) {
        console.error('Transformation error:', error);
        setResult('Error transforming code');
      }
    }, [initialized, code]);

    if (!initialized) {
      return <div>Initializing transpiler...</div>;
    }
    console.log("transpiledCode:", result);

    return (
        <div suppressHydrationWarning>
            <pre>{result}</pre>
            <DynamicCharts transpiledCode={result} />
        </div>
    );
}
