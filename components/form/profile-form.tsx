import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import { User } from "@prisma/client";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
// import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProfileValidation } from "@/lib/validations/auth";
// import { ProfileForm as ProfileType } from "@/app/types/product";
import useCurrentUser from "@/hooks/useCurrentUser";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// export default function ProfileForm({ user }: { user: User | null }) {
export default function ProfileForm({
  setIsEditing,
}: {
  setIsEditing: (isEditing: boolean) => void;
}) {
  const { currentUser, updateCurrtUser } = useCurrentUser();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      name: currentUser?.name ?? undefined,
      gender: (currentUser?.gender as "女生" | "男生") ?? undefined,
      birth: currentUser?.birth ?? undefined,
      email: currentUser?.email ?? undefined,
      phone: currentUser?.phone ?? undefined,
      image: "",
    },
  });

  const { handleSubmit, control, formState } = form;
  const { isSubmitting } = formState;

  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    console.log("Form submission started:", values);
    try {
      console.log("User check completed.");
      if (currentUser) {
        await updateCurrtUser(values);
        toast.success("會員訊息已更新！");
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full pr-10 lg:pr-30">
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
          {/* <FormField
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
          /> */}
          {/* <FormField
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
          /> */}
        </div>
        <div className="flex justify-center">
          <Button
            className="w-1/3 mt-6 mr-5"
            type="button"
            variant="custom_outline"
            disabled={isSubmitting}
            onClick={() => setIsEditing(false)}
          >
            取消
          </Button>
          {isSubmitting ? (
            <Button
              className="w-1/3 mt-6"
              type="submit"
              variant="custom"
              disabled={isSubmitting}
            >
              <Loader2 className="size-4 mr-2 animate-spin" /> Submitting...
            </Button>
          ) : (
            <Button
              className="w-1/3 mt-6"
              type="submit"
              variant="custom"
              disabled={isSubmitting}
            >
              儲存變更
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
