"use client"

import { Fragment, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { toast } from "sonner"
import { ChevronDown } from "lucide-react"

import { navigationConfig } from "@/config/nav"
import { logoutAction } from "@/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function getCrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean)
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
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
  const { data: session } = useSession()
  
  const initials = (user.name ?? "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    if (session && (session as any).error === "RefreshAccessTokenError") {
      toast.error("Session Expired", {
        description: "Your session has expired due to inactivity. Redirecting securely...",
        duration: 5000,
      })
      setTimeout(() => { signOut({ callbackUrl: "/" }) }, 2500)
    }
  }, [session])

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
          {navigationConfig.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    if (item.hidden) return null
                    const Icon = item.icon
                    const hasSubItems = item.subItems && item.subItems.length > 0
                    const isParentActive = pathname.startsWith(item.href)

                    if (hasSubItems) {
                      return (
                        <Collapsible key={item.href} defaultOpen={isParentActive} className="group/collapsible">
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={item.label} isActive={pathname === item.href}>
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.subItems?.map((subItem) => {
                                  if (subItem.hidden) return null
                                  
                                  // Role protection check for submenus
                                  if (subItem.requiredRole && user.role !== subItem.requiredRole) {
                                    return null
                                  }

                                  return (
                                    <SidebarMenuSubItem key={subItem.href}>
                                      <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                        <Link href={subItem.href}>
                                          <span>{subItem.label}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  )
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      )
                    }

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href}>
                          <Link href={item.href}>
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
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
                      {index === crumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={`/dashboard/${crumbs.slice(1, index + 1).join("/").toLowerCase()}`}>{crumb}</Link>
                        </BreadcrumbLink>
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