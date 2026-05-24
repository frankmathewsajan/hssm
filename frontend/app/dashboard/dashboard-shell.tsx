"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { logoutAction } from "@/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/students", label: "Students" },
]

function getCrumbs(pathname: string) {
  if (pathname.startsWith("/dashboard/students")) return ["Overview", "Students"]
  return ["Overview"]
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: { name?: string | null; image?: string | null; role?: string | null; school_code?: string | null }
}) {
  const pathname = usePathname()
  const crumbs = getCrumbs(pathname)
  const initials = (user.name ?? "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="gap-3 px-4 py-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            HSS Manager
          </Link>
          <SidebarSeparator />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-4 pb-4">
          <div className="rounded-lg border border-sidebar-border/60 bg-sidebar-accent/40 p-3 text-sm">
            <p className="font-medium text-sidebar-foreground">{user.name ?? "User"}</p>
            <p className="text-sidebar-foreground/70">{user.school_code ?? ""}</p>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/60 bg-background/85 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, index) => (
                  <Fragment key={crumb}>
                    <BreadcrumbItem>
                      {index === 0 ? (
                        <BreadcrumbLink asChild>
                          <Link href="/dashboard">{crumb}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < crumbs.length - 1 ? <BreadcrumbSeparator /> : null}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-1.5">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-10 rounded-full px-2.5">
                  <Avatar className="size-7">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block">{user.name ?? "User"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>{user.name ?? "User"}</DialogTitle>
                  <DialogDescription>{user.role ?? "Account details"}</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Avatar>
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium">{user.name ?? "User"}</p>
                    <p className="text-sm text-muted-foreground">{user.school_code ?? ""}</p>
                  </div>
                </div>
                <DialogFooter className="sm:justify-between">
                  <form action={logoutAction}>
                    <Button type="submit" variant="destructive">Logout</Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="min-h-[calc(100svh-4rem)] p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}