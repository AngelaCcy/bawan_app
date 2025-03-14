// "use client";

import Link from "next/link";
import MainNav from "./main-nav";
import UserNav from "./user-nav";
// import Image from "next/image";
// import logo from "@/public/img/logo.png";
// import LoginSignupNav from "./signinSignup-nav";
// import { auth } from "@/auth";
// import CartNav from "./cart-nav";

const Navbar = async () => {
  // const session = await auth();
  // const pathname = usePathname();
  // if (pathname === "/signin") {
  //   return (<div>Hello</div>);
  // }

  return (
    <header className="w-full fixed z-10 top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-200">
      <nav className="h-16 px-4 flex items-center">
        <Link href="/">
          {/* <Image src={logo} alt="menu" width={65} height={65} /> */}
        </Link>
        <h1 className="text-lg text-red-300 font-bold">EShop</h1>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
          {/* {session?.user ? <UserNav /> : <LoginSignupNav />} */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
