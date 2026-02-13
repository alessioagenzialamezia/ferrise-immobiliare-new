import SiteHeader from "./SiteHeader";
import Footer from "./Footer";

interface AppLayoutProps {
  onNavigate: (view: string, id?: string) => void;
  children: React.ReactNode;
  showAdminButton?: boolean;
}

export default function AppLayout({ onNavigate, children, showAdminButton = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader onNavigate={(view) => onNavigate(view)} />
      <main className="flex-1">{children}</main>
      <Footer onNavigate={(view) => onNavigate(view)} showAdminButton={showAdminButton} />
    </div>
  );
}
