import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import HomePage from "./pages/Home/HomePage";

function ExplorerPage() {
  return (
    <main>
      <h1>Explorer</h1>
    </main>
  );
}

function MethodologyPage() {
  return (
    <main>
      <h1>Methodology</h1>
    </main>
  );
}

function StandardsPage() {
  return (
    <main>
      <h1>Scientific Standards</h1>
    </main>
  );
}

function AboutPage() {
  return (
    <main>
      <h1>About</h1>
    </main>
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