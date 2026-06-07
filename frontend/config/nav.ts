// frontend/config/nav.ts
import { LayoutDashboard, Users, UserPlus, BookOpen, LucideIcon } from "lucide-react"

export interface SubMenuItem {
  href: string
  label: string
  hidden?: boolean
  requiredRole?: string // 👈 Lock item to specific roles
}

export interface SidebarGroupConfig {
  label: string
  items: {
    href: string
    label: string
    icon: LucideIcon
    hidden?: boolean
    subItems?: SubMenuItem[]
  }[]
}

export const navigationConfig: SidebarGroupConfig[] = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    ],
  },
  {
    label: "Admissions Desk",
    items: [
      {
        href: "/dashboard/admissions",
        label: "Admissions",
        icon: UserPlus,
        subItems: [
          { href: "/dashboard/admissions/staging", label: "Inbound Waiting Room" },
          { href: "/dashboard/admissions/auto-onboard", label: "HSCAP Smart Staging" },
        ],
      },
    ],
  },
  {
    label: "Academic Management",
    items: [
      {
        href: "/dashboard/classes",
        label: "Academic Divisions",
        icon: BookOpen,
        subItems: [
          { href: "/dashboard/classes", label: "View Classes" }, // Accessible to everyone
          { href: "/dashboard/classes/manage", label: "Add/Configure Classes", requiredRole: "Principal" }, // Principal only
          { href: "/dashboard/classes/assign", label: "Assign Subject Faculty", requiredRole: "Principal" }, // Principal only
        ],
      },
      {
        href: "/dashboard/students",
        label: "Students",
        icon: Users,
        subItems: [
          { href: "/dashboard/students", label: "View Students" },
        ],
      },
    ],
  },
]