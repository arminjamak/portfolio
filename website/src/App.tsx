import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { PortfolioLayout } from "@/polymet/layouts/portfolio-layout";
import { Home } from "@/polymet/pages/home";
import { ProjectDetail } from "@/polymet/pages/project-detail";
import { About } from "@/polymet/pages/about";
import { AdminProvider } from "@/polymet/components/admin-context";
import { initializeDataFromDeployment } from "@/polymet/data/data-loader";

export default function PortfolioPrototype() {
  useEffect(() => {
    // Initialize data from deployed data.json on first load
    initializeDataFromDeployment();
  }, []);

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
