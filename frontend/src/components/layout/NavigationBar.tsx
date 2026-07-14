import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Explorer",
    path: "/explorer",
  },
  {
    label: "Methodology",
    path: "/methodology",
  },
  {
    label: "Standards",
    path: "/standards",
  },
  {
    label: "About",
    path: "/about",
  },
];

export default function NavigationBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src="/src/assets/logos/zoryn.png"
            alt="Zoryn"
            className="h-10 w-10"
          />

          <div>
            <p className="text-primary text-lg font-bold tracking-[0.25em]">
              ZORYN
            </p>

            <p className="text-muted-foreground text-xs">
              Environmental Reasoning Engine
            </p>
          </div>
        </NavLink>

        <nav className="flex items-center gap-8">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "text-sm",
                  "font-medium",
                  "transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}