import Header from "@/components/Header";

export default async function MainPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col relative">
      <header className="sticky top-0 z-50 bg-white bg-opacity-85 border-b">
        <Header />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
