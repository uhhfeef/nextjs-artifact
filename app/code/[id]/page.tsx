import React from 'react';
import ClientSyntaxHighlighter from '../../components/ClientSyntaxHighlighter';

export default async function CodePage({ params }: { params: { id: string } }) {
  const unwrappedParams = await params;
  const decodedCode = Buffer.from(unwrappedParams.id, 'base64').toString();

  return (
    <div className="h-full w-full overflow-auto">
      <ClientSyntaxHighlighter code={decodedCode} />
    </div>
  );
}
