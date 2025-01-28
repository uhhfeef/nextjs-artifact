'use client';

import { useState, useEffect } from 'react';
import initSwc, { transformSync } from "@swc/wasm-web";

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
        const output = transformSync(code, {});
        setResult(output.code);
      } catch (error) {
        console.error('Transformation error:', error);
        setResult('Error transforming code');
      }
    }, [initialized, code]);

    if (!initialized) {
      return <div>Initializing transpiler...</div>;
    }

    return (
        <div suppressHydrationWarning>
            <pre>{result}</pre>
        </div>
    );
}
