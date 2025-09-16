import { BookAIcon, Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { FaInbox } from "react-icons/fa";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Categories",
    url: "/superadmindashboard/categories",
    icon: FaInbox,
  },
  {
    title: "Pending Vendor Approval",
    url: "/superadmindashboard/pendingVendorApproval",
    icon: Inbox,
  },
  {
    title: "Approved Vendors",
    url: "/superadmindashboard/approvedVendors",
    icon: Inbox,
  },
  {
    title: "Coupons",
    url: "/superadmindashboard/coupons",
    icon: BookAIcon,
  },

  {
    title: "FAQ",
    url: "/superadmindashboard/faqForm",
    icon: Search,
  },
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: Settings,
  //   },
  {
    title: "Pending Ads",
    url: "/superadmindashboard/pendingAds",
    icon: Calendar,
  },
  {
    title: "Active Ads",
    url: "/superadmindashboard/activeAds",
    icon: Calendar,
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
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
  );
}
