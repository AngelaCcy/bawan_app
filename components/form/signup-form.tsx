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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { createUser } from "@/app/utils/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { checkUserExist } from "@/app/utils/actions";

const SignUpForm = () => {
  const form = useForm<z.infer<typeof userSignUpValidation>>({
    resolver: zodResolver(userSignUpValidation),
    defaultValues: {
      name: "",
      gender: undefined,
      birth: undefined,
      email: "",
      phone: "",
      address: "",
      promotion: false,
      termAndCon: false,
    },
  });

  const { handleSubmit, control, formState } = form;
  const { isSubmitting } = formState;
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof userSignUpValidation>) {
    console.log("Form submission started:", values);
    try {
      const userExist = await checkUserExist(values.email);
      console.log("User check completed.");
      if (userExist) {
        toast("這個信箱已經註冊過啦，請直接登入！", {
          icon: "❗️",
        });
        router.push("/signin");
      } else {
        await createUser(values);
        console.log("Form submission completed.");
        toast.success("註冊完成，請登入！");
        router.push("/signin");
      }
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名</FormLabel>
                <FormControl className="border-black">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>性別</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="border-black w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="選擇性別" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="女生">女生</SelectItem>
                      <SelectItem value="男生">男生</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>生日</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "yyyy-MM-dd")
                            : "選擇日期"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>電話</FormLabel>
                <FormControl className="border-black">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>地址</FormLabel>
                <FormControl className="border-black">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="promotion"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md p-2">
                <FormControl className="border-black">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    我想要收到最新消息
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="termAndCon"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md p-2">
                <FormControl className="border-black">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium">
                    我已閱讀並同意使用條款
                  </FormLabel>
                </div>
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
        已經有會員了嗎?&nbsp;
        <Link className="text-blue-600 hover:underline" href="/signin">
          直接登入
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;
