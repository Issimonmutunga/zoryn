import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col items-center justify-center px-8 text-center">
      <img
        src="/src/assets/logos/zoryn.png"
        alt="Zoryn"
        className="mb-10 h-40 w-40"
      />

      <h1 className="text-primary text-7xl font-bold tracking-[0.3em]">
        ZORYN
      </h1>

      <p className="mt-6 text-2xl text-muted-foreground">
        Environmental Reasoning Engine
      </p>

      <p className="mt-8 max-w-3xl text-lg leading-8 text-muted-foreground">
        Transform environmental observations into transparent, explainable,
        scientifically traceable discoveries.
      </p>

      <div className="mt-12 flex gap-4">
        <Link to="/explorer">
          <Button>
            Launch Explorer
          </Button>
        </Link>

        <Link to="/methodology">
          <Button variant="outline">
            Methodology
          </Button>
        </Link>
      </div>
    </main>
  );
}