async function TestEnvPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-4">
        <p><strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set'}</p>
        <p><strong>CLERK_SECRET_KEY:</strong> {process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set'}</p>
        <p><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? 'Set' : 'Not set'}</p>
      </div>
    </div>
  );
}

export default TestEnvPage; 