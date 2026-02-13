import { useState } from "react";
import { Menu, X } from "lucide-react";

interface SiteHeaderProps {
  onNavigate: (view: string) => void;
}

export default function SiteHeader({ onNavigate }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const go = (view: string) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      {/* FULL WIDTH */}
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex justify-between items-center h-16">

            {/* ================= LOGO ================= */}
            <button
              onClick={() => go("home")}
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
              aria-label="Vai alla Home"
            >
              <div
                className="h-10 w-auto flex items-center
                           transition-all duration-300 ease-out
                           group-hover:scale-[1.03]"
              >
                <img
                  src="/logoalessio.png"
                  alt="Ferrise Immobiliare"
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Testo logo (aiuta la leggibilità su schermi chiari) */}
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-bold text-blue-900 tracking-tight">
                  Ferrise Immobiliare
                </div>
                <div className="text-xs text-gray-500">
                  Agenzia immobiliare
                </div>
              </div>
            </button>

            {/* ================= MOBILE BUTTON ================= */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Apri menu"
                className="p-2 rounded-lg
                           transition-all duration-300 ease-out
                           hover:bg-gray-100 hover:scale-105
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* ================= DESKTOP NAV ================= */}
            <nav className="hidden md:flex items-center gap-1">
              <NavBtn onClick={() => go("home")}>Home</NavBtn>
              <NavBtn onClick={() => go("properties")}>Proprietà</NavBtn>
              <NavBtn onClick={() => go("sell")}>Vendi immobile</NavBtn>
              <NavBtn onClick={() => go("agency")}>Agenzia</NavBtn>
              <NavBtn onClick={() => go("blog")}>Blog</NavBtn>
              <NavBtn onClick={() => go("faq")}>FAQ</NavBtn>
              <NavBtn onClick={() => go("contact")}>Contatti</NavBtn>

              <button
                onClick={() => go("admin")}
                className="ml-3 inline-flex items-center justify-center
                           rounded-lg bg-blue-600 px-4 py-2
                           text-sm font-semibold text-white
                           transition-all duration-300 ease-out
                           hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Admin
              </button>
            </nav>
          </div>

          {/* ================= MOBILE MENU ================= */}
          {mobileMenuOpen && (
            <div
              className="md:hidden mt-2 rounded-xl border border-gray-200 bg-white shadow-lg
                         animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="flex flex-col divide-y">
                <MobileBtn onClick={() => go("home")}>Home</MobileBtn>
                <MobileBtn onClick={() => go("properties")}>Proprietà</MobileBtn>
                <MobileBtn onClick={() => go("sell")}>Vendi immobile</MobileBtn>
                <MobileBtn onClick={() => go("agency")}>Agenzia</MobileBtn>
                <MobileBtn onClick={() => go("blog")}>Blog</MobileBtn>
                <MobileBtn onClick={() => go("faq")}>FAQ</MobileBtn>
                <MobileBtn onClick={() => go("contact")}>Contatti</MobileBtn>

                <button
                  onClick={() => go("admin")}
                  className="m-3 rounded-lg bg-blue-600 px-4 py-2 text-left
                             text-white font-semibold
                             transition-all duration-300 ease-out
                             hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ================= COMPONENTI ================= */

function NavBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative px-3 py-2 text-sm font-medium text-gray-700
                 transition-all duration-300 ease-out
                 hover:text-blue-600 hover:-translate-y-0.5
                 after:absolute after:left-3 after:-bottom-0.5
                 after:h-[2px] after:w-0 after:bg-blue-600
                 after:transition-all after:duration-300
                 hover:after:w-[calc(100%-1.5rem)]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
    >
      {children}
    </button>
  );
}

function MobileBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-3 text-left text-gray-700 font-medium
                 transition-all duration-300 ease-out
                 hover:bg-gray-50 hover:text-blue-600
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {children}
    </button>
  );
}
