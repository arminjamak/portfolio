import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PortfolioLayout } from "@/polymet/layouts/portfolio-layout";
import { Home } from "@/polymet/pages/home";
import { ProjectDetail } from "@/polymet/pages/project-detail";
import { About } from "@/polymet/pages/about";
import { AdminProvider } from "@/polymet/components/admin-context";

export default function PortfolioPrototype() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PortfolioLayout>
                <Home />
              </PortfolioLayout>
            }
          />

          <Route
            path="/work/:id"
            element={
              <PortfolioLayout>
                <ProjectDetail />
              </PortfolioLayout>
            }
          />

          <Route
            path="/about"
            element={
              <PortfolioLayout>
                <About />
              </PortfolioLayout>
            }
          />
        </Routes>
      </Router>
    </AdminProvider>
  );
}
