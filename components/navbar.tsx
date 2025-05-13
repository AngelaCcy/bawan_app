"use client";

import Link from "next/link";
import MainNav from "./main-nav";
import UserNav from "./user-nav";
import Image from "next/image";
import logo from "@/public/img/bawan_word.png";
// import Banner from "./banner";
import NavBarCarousel from "./nav-carousel";
// import LoginSignupNav from "./signinSignup-nav";
// import { auth } from "@/auth";
// import CartNav from "./cart-nav";

const Navbar = () => {
  // const session = await auth();
  // const pathname = usePathname();
  // if (pathname === "/signin") {
  //   return (<div>Hello</div>);
  // }

  return (
    <header className="w-full fixed z-10 top-0 bg-navbar dark:bg-gray-900 border-b border-gray-200">
      {/* <Banner /> */}
      <NavBarCarousel />
      <nav className="h-16 px-4 flex justify-between items-center">
        <Link href="/" className="hidden lg:block">
          <Image src={logo} alt="menu" width={180} height={100} />
        </Link>
        <MainNav />
        <Link href="/" className="lg:hidden pl-32 pr-4">
          <Image src={logo} alt="menu" width={180} height={100} />
        </Link>
        <div className="flex items-center space-x-4">
          <UserNav />
          {/* {session?.user ? <UserNav /> : <LoginSignupNav />} */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
