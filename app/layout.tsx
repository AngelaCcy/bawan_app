import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/ThemeProvider";
import AuthProvider from "@/components/providers/SessionProvider";
import UserBreadcrumb from "@/components/Breadcrumb";

const inter = Inter({ subsets: ["latin"] });
const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: "Nextjs fullstack Authentication",
  description: "Sign-Up and Sign-In with Nextjs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="zh-TW">
      <body className={`${inter.className} ${notoSansTC.variable} font-sans`}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen flex flex-col justify-center items-center">
              <Toaster position="top-center" />
              <div className="w-full pl-10">
                <UserBreadcrumb />
              </div>
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
