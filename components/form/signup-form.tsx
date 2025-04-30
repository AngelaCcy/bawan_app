"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userSignUpValidation } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SignUpForm = () => {
  const form = useForm<z.infer<typeof userSignUpValidation>>({
    resolver: zodResolver(userSignUpValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, formState } = form;
  const { isSubmitting } = formState;

  async function onSubmit(values: z.infer<typeof userSignUpValidation>) {
    console.log("Form submission started:", values);
    try {
      // await MagicSignin(values.email) ; // Ensure this function is awaited
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
                <FormControl className="border-black">
                  <Input placeholder="mail@example.com" {...field} />
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
            type="submit"
            variant="custom"
            disabled={isSubmitting}
          >
            <Loader2 className="size-4 mr-2 animate-spin" /> Submitting...
          </Button>
        ) : (
          <Button
            className="w-full mt-6"
            type="submit"
            variant="custom"
            disabled={isSubmitting}
          >
            註冊
          </Button>
        )}
      </form>

      <p className="text-center text-sm text-gray-600 mt-2">
        Already have an account?&nbsp;
        <Link className="text-blue-600 hover:underline" href="/signin">
          Sign In
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;
