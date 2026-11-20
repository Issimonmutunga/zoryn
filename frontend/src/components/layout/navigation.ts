import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarRange,
  Database,
  FlaskConical,
  House,
  Info,
  Map,
  Scale,
  ScanSearch,
  ShieldCheck,
  TriangleAlert,
  Waypoints,
} from "lucide-react";

// One navigation model for the desktop bar, the phone tab bar and the "More"
// sheet, so a destination is named and ordered the same way everywhere.

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  /** The question the screen answers; shown in menus. */
  description: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const HOME: NavItem = {
  label: "Home",
  path: "/",
  icon: House,
  description: "What Zoryn is.",
};

export const EXPLORER: NavItem = {
  label: "Explorer",
  path: "/explorer",
  icon: Map,
  description: "What is happening here?",
};

export const DISCOVERIES: NavItem = {
  label: "Discoveries",
  path: "/discoveries",
  icon: ScanSearch,
  description: "What has Zoryn found?",
};

export const TIMELINE: NavItem = {
  label: "Timeline",
  path: "/timeline",
  icon: CalendarRange,
  description: "When did it happen?",
};

/** Links shown inline in the desktop bar. */
export const PRIMARY_ITEMS: NavItem[] = [HOME, DISCOVERIES, TIMELINE];

/** Destinations on the phone tab bar; "More" is added by the bar itself. */
export const TAB_ITEMS: NavItem[] = [HOME, EXPLORER, DISCOVERIES, TIMELINE];

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Knowledge",
    items: [
      {
        label: "Hazards",
        path: "/hazards",
        icon: TriangleAlert,
        description: "Which hazards are covered.",
      },
      {
        label: "Rules",
        path: "/rules",
        icon: Scale,
        description: "How a discovery is decided.",
      },
      {
        label: "Knowledge Graph",
        path: "/knowledge-graph",
        icon: Waypoints,
        description: "How the knowledge connects.",
      },
      {
        label: "Datasets",
        path: "/datasets",
        icon: Database,
        description: "What it is built on.",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        label: "Methodology",
        path: "/methodology",
        icon: FlaskConical,
        description: "The reasoning method, step by step.",
      },
      {
        label: "Standards",
        path: "/standards",
        icon: ShieldCheck,
        description: "The scientific standards applied.",
      },
      {
        label: "About",
        path: "/about",
        icon: Info,
        description: "The project and its pilot.",
      },
      {
        label: "Status",
        path: "/status",
        icon: Activity,
        description: "Whether the system is working.",
      },
    ],
  },
];

export function isActivePath(pathname: string, path: string): boolean {
  if (path === "/") {
    return pathname === "/";
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}
