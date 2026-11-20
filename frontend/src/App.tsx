import { Suspense, lazy } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

import HomePage from "./pages/Home/HomePage";
import MethodologyPage from "./pages/Methodology/MethodologyPage";
import StandardsPage from "./pages/Standards/StandardsPage";
import AboutPage from "./pages/About/AboutPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

// The Explorer pulls in the map library, by far the largest dependency, and
// the data views are only needed once opened. Loading them on demand keeps
// the first load small, which matters most on a phone connection.
const ExplorerPage = lazy(() => import("./pages/Explorer/ExplorerPage"));
const DiscoveriesPage = lazy(() => import("./pages/Discoveries/DiscoveriesPage"));
const DiscoveryDetailPage = lazy(
  () => import("./pages/Discoveries/DiscoveryDetailPage"),
);
const TimelinePage = lazy(() => import("./pages/Timeline/TimelinePage"));
const HazardsPage = lazy(() => import("./pages/Hazards/HazardsPage"));
const RulesPage = lazy(() => import("./pages/Rules/RulesPage"));
const KnowledgeGraphPage = lazy(
  () => import("./pages/KnowledgeGraph/KnowledgeGraphPage"),
);
const DatasetsPage = lazy(() => import("./pages/Datasets/DatasetsPage"));
const StatusPage = lazy(() => import("./pages/Status/StatusPage"));

function PageFallback() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto w-full max-w-287.5 animate-pulse px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="h-3 w-40 rounded bg-[#EDEDED]" />
      <div className="mt-5 h-10 w-2/3 max-w-md rounded-lg bg-[#EDEDED]" />
      <div className="mt-8 h-40 rounded-2xl bg-[#EDEDED]" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={<HomePage />}
          />

          <Route
            path="explorer"
            element={<ExplorerPage />}
          />

          <Route
            path="discoveries"
            element={<DiscoveriesPage />}
          />

          <Route
            path="discoveries/:h3Id"
            element={<DiscoveryDetailPage />}
          />

          <Route
            path="timeline"
            element={<TimelinePage />}
          />

          <Route
            path="hazards"
            element={<HazardsPage />}
          />

          <Route
            path="rules"
            element={<RulesPage />}
          />

          <Route
            path="knowledge-graph"
            element={<KnowledgeGraphPage />}
          />

          <Route
            path="datasets"
            element={<DatasetsPage />}
          />

          <Route
            path="methodology"
            element={<MethodologyPage />}
          />

          <Route
            path="standards"
            element={<StandardsPage />}
          />

          <Route
            path="about"
            element={<AboutPage />}
          />

          <Route
            path="status"
            element={<StatusPage />}
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/"
            />
          }
        />
      </Routes>
    </Suspense>
  );
}
