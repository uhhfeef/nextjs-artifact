import React from 'react';
import ClientSyntaxHighlighter from '../../components/ClientSyntaxHighlighter';
import Transpiler from '@/app/components/Transpiler';

export default async function CodePage({ params }: { params: { id: string } }) {
  const unwrappedParams = await params;
  const decodedCode = decodeURIComponent(unwrappedParams.id);
  console.log("decodedCode", decodedCode);

  return (
    <div className="h-full w-full overflow-auto">
      {/* <ClientSyntaxHighlighter code={decodedCode} /> */}
      <Transpiler code={decodedCode} />
    </div>
  );
}
