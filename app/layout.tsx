import QueryProvider from "@/application/providers/QueryProvider";
import ClientLayout from "./ClientLayout";
import Modals from "./Modals";
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import type { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/helvetica-neue-55" rel="stylesheet" />
      </head>
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
