import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
    <SidebarProvider >
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <div  className=" p-4">        
        <SidebarTrigger className="md:hidden" />
        {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}