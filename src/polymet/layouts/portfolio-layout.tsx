import { ReactNode, useState } from "react";
import { Header } from "@/polymet/components/header";
import { useAdmin } from "@/polymet/components/admin-context";
import { AdminLoginModal } from "@/polymet/components/admin-login-modal";
import { Button } from "@/components/ui/button";
import { SnowEffect } from "@/components/snow-effect";

interface PortfolioLayoutProps {
  children: ReactNode;
}

export function PortfolioLayout({ children }: PortfolioLayoutProps) {
  const { isAdmin, logout } = useAdmin();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLogout = async () => {
    setIsSyncing(true);
    await logout();
    setIsSyncing(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <SnowEffect />
      <Header />

      <main className="flex-1 relative z-10">{children}</main>
      <footer className="border-t border-border bg-background relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Armin Jamak. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
              <a
                href="mailto:hello@arminjamak.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Email
              </a>
              {isAdmin ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isSyncing}
                  className="text-sm h-auto p-0 text-muted-foreground hover:text-foreground hover:bg-transparent disabled:opacity-50"
                >
                  {isSyncing ? "Syncing..." : "Log out"}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLoginModalOpen(true)}
                  className="text-sm h-auto p-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                  Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      </footer>
      <AdminLoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
}
