import { auth } from "@clerk/nextjs/server";

async function TestAuthPage() {
  const authResult = auth();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      <div className="space-y-4">
        <p><strong>Auth Result:</strong> {JSON.stringify(authResult, null, 2)}</p>
        <p><strong>User ID:</strong> {authResult.userId || 'Not found'}</p>
        <p><strong>Session ID:</strong> {authResult.sessionId || 'Not found'}</p>
        <p><strong>Is Signed In:</strong> {authResult.userId ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

export default TestAuthPage;