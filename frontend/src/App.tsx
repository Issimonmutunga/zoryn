import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import HomePage from "./pages/Home/HomePage";
import ExplorerPage from "./pages/Explorer/ExplorerPage";
import MethodologyPage from "./pages/Methodology/MethodologyPage";
import StandardsPage from "./pages/Standards/StandardsPage";
import AboutPage from "./pages/About/AboutPage";

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
          element={<ExplorerPage />}
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