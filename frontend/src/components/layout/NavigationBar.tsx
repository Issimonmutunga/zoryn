import { NavLink } from "react-router-dom";

type NavigationItem = {
  label: string;
  path: string;
};

const navigation: NavigationItem[] = [
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
    <header
      style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        borderBottom: "1px solid #DDD6C8",
        background: "#F8F6F2",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src="/src/assets/logos/zoryn.png"
          alt="Zoryn"
          style={{
            width: "36px",
            height: "36px",
          }}
        />

        <span
          style={{
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#6E5845",
            fontSize: "1.1rem",
          }}
        >
          ZORYN
        </span>
      </div>

      <nav
        style={{
          display: "flex",
          gap: "28px",
        }}
      >
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#6E5845" : "#5F5A54",
              fontWeight: isActive ? 700 : 500,
              transition: "color 150ms ease",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}