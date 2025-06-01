export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen relative">
      <div className="max-w-[2400px] w-full mx-auto">{children}</div>
    </div>
  );
}
