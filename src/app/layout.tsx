import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import NotFoundPage from "@/modules/not-found";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QUẢN TRỊ HỆ THỐNG",
  description: "IN ẢNH TRỰC TUYẾN",
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
          <div className="flex">
            {/* hidden md:hidden lg:hidden xl: */}
            {children}
          </div>
          {/* <div className="flex md:flex lg:flex xl:hidden">
            <NotFoundPage />
          </div> */}
        </ToastProvider>
        <Toaster />
      </body>
    </html>
  );
}
