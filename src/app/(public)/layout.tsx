import "./globals.css";
import { Navigation } from '../../components/Navigation'
import Footer from "@/components/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopAdBannerSection from "../sections/topAdBannerSection";

export const dynamic = 'force-dynamic'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TopAdBannerSection />
      <Navigation />
      <div className="overflow-x-hidden">
        <ToastContainer />
        {children}
      </div>
      <Footer />

    </div>
  );
}