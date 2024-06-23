import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import { Inter } from "next/font/google";
import BootstrapClient from "@/components/BootstrapClient";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bücherverwaltung",
  description: "Bücherverwaltungssystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <BootstrapClient />
        {children}
        {/* {children} */}
      </body>
    </html>
  );
}
