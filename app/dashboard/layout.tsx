import SideBar from "@/components/sideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex h-screen items-stretch w-full">
      <SideBar />
      <div className="flex-1 text-center justify-center bg-gray-900">
        {children}
      </div>
    </section>
  );
}