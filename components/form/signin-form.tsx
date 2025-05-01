"use client";

import { useForm } from "react-hook-form";
// 在最新版本的 react-dom 中，使用 useFormStatus 來管理表單狀態。
// import { useFormStatus } from 'react-dom'
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
import { GoogleSignin, MagicSignin, LineSignin } from "@/app/utils/authActions";
import { Loader2 } from "lucide-react";

const SignInForm = () => {
  // const { pending } = useFormStatus()
  // 使用z.infer<typeof ZodSchema>來傳回Typescript的type, 做為useForm的Form型別
  const form = useForm<z.infer<typeof userSignInValidation>>({
    resolver: zodResolver(userSignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, formState } = form;
  const { isSubmitting } = formState;

  async function onSubmit(values: z.infer<typeof userSignInValidation>) {
    // console.log(values)
    // MagicSignin(values.email);
    console.log("Form submission started:", values);
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
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密碼</FormLabel>
                <FormControl className="border-black">
                  <Input {...field} />
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
        <span className="px-2 text-black">or</span>
        <div className="border-b border-gray-400 w-full"></div>
      </div>
      <form action={GoogleSignin} className="w-full pb-3">
        <AuthButton provider="Google" />
      </form>
      <form action={LineSignin} className="w-full">
        <AuthButton provider="Line" />
      </form>
      <p className="text-center text-sm text-gray-600 mt-2">
        Don&apos;t have an account?&nbsp;
        <Link className="text-blue-600 hover:underline" href="/signup">
          Sign Up
        </Link>
      </p>
    </Form>
  );
};

export default SignInForm;
