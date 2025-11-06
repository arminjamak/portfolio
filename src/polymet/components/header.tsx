import { Link, useLocation } from "react-router-dom";
import { AnimatedLogo } from "@/polymet/components/animated-logo";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <AnimatedLogo />

            <span className="text-xl font-bold tracking-tight">
              Armin Jamak
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                isActive("/") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Work
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                isActive("/about") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
