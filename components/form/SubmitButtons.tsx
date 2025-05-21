"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import GoogleLogo from "@/public/img/google.svg";
import LineLogo from "@/public/img/line.svg";
import Image from "next/image";
import { Loader2 } from "lucide-react";
// import { signIn } from "next-auth/react";

export function AuthButton({ provider }: { provider: string }) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled variant="outline" className="w-full">
          <Loader2 className="size-4 mr-2 animate-spin" />
          請稍等...
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-full text-xs sm:text-sm flex items-center"
        >
          <Image
            src={provider === "Google" ? GoogleLogo : LineLogo}
            alt={`${provider}Logo`}
            className="size-4 mr-2 sm:mr-4 flex-shrink-0"
          />
          <span className="truncate">使用 {provider} 帳號登入</span>
        </Button>
      )}
    </>
  );
}
