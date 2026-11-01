import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import HomePage from "./pages/Home/HomePage";
import MethodologyPage from "./pages/Methodology/MethodologyPage";
import StandardsPage from "./pages/Standards/StandardsPage";
import AboutPage from "./pages/About/AboutPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

// The explorer pulls in MapLibre (most of the bundle), so it loads only
// when the explorer is opened.
const ExplorerPage = lazy(
  () => import("./pages/Explorer/ExplorerPage"),
);

function WorkspaceLoading() {
  return (
    <div className="flex h-full items-center justify-center bg-[#FAFAFA]">
      <p className="text-sm text-[#6B6B6B]">Loading explorer…</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={<HomePage />}
        />

        <Route
          path="explorer"
          element={
            <Suspense fallback={<WorkspaceLoading />}>
              <ExplorerPage />
            </Suspense>
          }
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
          path="login"
          element={<LoginPage />}
        />

        <Route
          path="signup"
          element={<SignupPage />}
        />
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
  );
}