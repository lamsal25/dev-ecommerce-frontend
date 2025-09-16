import { Calendar, Home, Inbox, Search, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/vendorDashboard/vendorDashboardProfile",
    icon: User,
  },
  {
    title: "received Orders",
    url: "/vendorDashboard/receivedOrders",
    icon: Inbox,
  },
  {
    title: "Product",
    url: "/vendorDashboard/products",
    icon: Calendar,
  },
  {
    title: "Create Advertisement",
    url: "/vendorDashboard/ads",
    icon: Search,
  },
  {
    title: "Applied Ads",
    url: "/vendorDashboard/appliedAds",
    icon: Settings,
  },
  {
    title: "Sales Sumamry",
    url: "/vendorDashboard/salesSummary",
    icon: Settings,
  },
  {
    title: "Pending Refund Requests",
    url: "/vendorDashboard/refundrequest",
    icon: Settings,
  },
  {
    title: "Approved Refund Requests",
    url: "/vendorDashboard/approvedrefundrequest",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup >
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
