import QueryProvider from "@/application/providers/QueryProvider";
import ClientLayout from "./ClientLayout";
import Modals from "./Modals";
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import type { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";

type RootLayoutProps = {
  children: ReactNode;
};

// Optimize font loading with next/font for better performance
// Fonts are self-hosted and automatically optimized
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <ClientLayout />
        <div id="wrapper">
          <QueryProvider>
            {children}
            <Modals />
          </QueryProvider>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
