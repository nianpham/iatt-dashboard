import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import NotFoundPage from "@/modules/not-found";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IN ẢNH TRƯC TUYẾN",
  description: "IN ẢNH TRƯC TUYẾN"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning={true}>
        <ToastProvider>
          <div className="hidden md:hidden lg:hidden xl:flex">
            {children}
          </div>
          <div className="flex md:flex lg:flex xl:hidden">
            <NotFoundPage />
          </div>
        </ToastProvider>
        <Toaster />
      </body>
    </html>
  );
}
