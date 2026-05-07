import QueryProvider from "@/application/providers/QueryProvider";
import ClientLayout from "./ClientLayout";
import Modals from "./Modals";
import { GlobalSnackbar } from "@/presentation/components/common/GlobalSnackbar";
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import type { ReactNode } from "react";
import { Inter, Poppins, Archivo_Black } from "next/font/google";

type RootLayoutProps = {
  children: ReactNode;
};

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

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-archivo-black",
  display: "swap",
  preload: false,
});

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${archivoBlack.variable}`}>
      <body>
        <ClientLayout />
        <div id="wrapper">
          <QueryProvider>
            {children}
            <Modals />
            <GlobalSnackbar />
          </QueryProvider>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
