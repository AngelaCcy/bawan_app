import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
// import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

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
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        {/* {pathname !== "/signin" && <Navbar />} */}
        <Navbar />
        <main className="min-h-screen flex flex-col justify-center items-center">
          {/* <Toaster position="bottom-center" /> */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
