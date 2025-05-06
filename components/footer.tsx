import Link from "next/link";

// import { Code } from "lucide-react";
import { footerLinks } from "@/constant";

const Footer = () => {
  return (
    <footer className="flex flex-col text-gray-500 text-lg mt-5 bg-navbar">
      <div className="flex flex-wrap justify-center max-sm:flex-col gap-5 px-6 py-10 md:gap-20 mx-8">
        {footerLinks.map((links) => (
          <div key={links.title} className="px-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-200 pb-4">
              {links.title}
            </h3>
            <div className="flex flex-col gap-3">
              {links.links.map((link) => (
                <Link key={link.title} href={link.url} className="text-sm">
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center text-xs pb-4">
        Copyright &copy; 2025 BAWAN. All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
