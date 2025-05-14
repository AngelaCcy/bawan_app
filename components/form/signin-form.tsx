"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// Import sign in validation schema
import { userSignInValidation } from "@/lib/validations/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// Import shadcn Form related UI components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthButton } from "./SubmitButtons";
import { GoogleSignin, MagicSignin } from "@/app/utils/authActions";
import { Loader2 } from "lucide-react";
import { checkUserExist } from "@/app/utils/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const SignInForm = () => {
  // const { pending } = useFormStatus()
  // 使用z.infer<typeof ZodSchema>來傳回Typescript的type, 做為useForm的Form型別
  const form = useForm<z.infer<typeof userSignInValidation>>({
    resolver: zodResolver(userSignInValidation),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, control, formState } = form;
  const { isSubmitting } = formState;
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof userSignInValidation>) {
    // console.log(values)
    // MagicSignin(values.email);
    console.log("Form submission started:", values);
    try {
      const userExist = await checkUserExist(values.email); // Ensure this function is awaited
      console.log("User check completed.");
      if (!userExist) {
        toast("新朋友你好! 請先註冊資料喔！", {
          icon: "👋🏻",
        });
        router.push("/signup");
        return;
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }

    try {
      await MagicSignin(values.email); // Ensure this function is awaited
      console.log("Form submission completed.");
    } catch (error) {
      console.error("Error during submission:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>電子信箱</FormLabel>
                <FormControl>
                  <Input
                    className="border-black"
                    placeholder="mail@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {isSubmitting ? (
          <Button
            className="w-full mt-6"
            variant="custom"
            type="submit"
            disabled={isSubmitting}
          >
            <Loader2 className="size-4 mr-2 animate-spin" /> Submitting...
          </Button>
        ) : (
          <Button
            className="w-full mt-6"
            variant="custom"
            type="submit"
            disabled={isSubmitting}
          >
            登入
          </Button>
        )}
      </form>
      {/* 這是畫出 ------------ or ---------------- */}
      <div className="flex items-center justify-center my-4">
        <div className="border-b border-gray-400 w-full"></div>
        <span className="px-2 text-black">或</span>
        <div className="border-b border-gray-400 w-full"></div>
      </div>
      <form action={GoogleSignin} className="w-full pb-3">
        <AuthButton provider="Google" />
      </form>
      <AuthButton provider="Line" />
      {/* <form action={LineSignin} className="w-full">
        <AuthButton provider="Line" />
      </form> */}
      <p className="text-center text-sm text-gray-600 mt-2">
        還不是會員嗎？&nbsp;
        <Link className="text-blue-600 hover:underline" href="/signup">
          現在註冊
        </Link>
      </p>
    </Form>
  );
};

export default SignInForm;
