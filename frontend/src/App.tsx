import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

function HomePage() {
  return (
    <main>
      <h1>Zoryn</h1>
      <p>Environmental Reasoning Engine</p>
    </main>
  );
}

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
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/explorer"
        element={<ExplorerPage />}
      />

      <Route
        path="/methodology"
        element={<MethodologyPage />}
      />

      <Route
        path="/standards"
        element={<StandardsPage />}
      />

      <Route
        path="/about"
        element={<AboutPage />}
      />

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