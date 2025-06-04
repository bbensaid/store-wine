import { Suspense } from "react";

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense>
      <NotFoundContent />
    </Suspense>
  );
}
