"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressValidation, AddressForm } from "@/lib/validations/auth";
import { Address } from "@prisma/client";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createAddress, updateAddress } from "@/app/utils/actions";

interface Props {
  existing?: Address;
  onDone: () => void;
}

export default function AddressFormComponent({ existing, onDone }: Props) {
  const form = useForm<AddressForm>({
    resolver: zodResolver(AddressValidation),
    defaultValues: existing
      ? {
          label: existing.label,
          recipient: existing.recipient,
          phone: existing.phone,
          street: existing.street,
          district: existing.district,
          city: existing.city,
          postalCode: existing.postalCode,
          country: existing.country,
          isDefault: existing.isDefault,
        }
      : {
          label: "Home",
          recipient: "",
          phone: "",
          street: "",
          district: "",
          city: "",
          postalCode: "",
          country: "TW",
          isDefault: false,
        },
  });

  const { handleSubmit, control, formState: { isSubmitting } } = form;

  async function onSubmit(values: AddressForm) {
    try {
      if (existing) {
        await updateAddress(existing.id, values);
        toast.success("地址已更新！");
      } else {
        await createAddress(values);
        toast.success("地址已新增！");
      }
      onDone();
    } catch {
      toast.error("操作失敗，請再試一次");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField control={control} name="label" render={({ field }) => (
            <FormItem>
              <FormLabel>標籤</FormLabel>
              <FormControl><Input placeholder="Home / Office" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="recipient" render={({ field }) => (
            <FormItem>
              <FormLabel>收件人</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel>電話</FormLabel>
            <FormControl><Input placeholder="0912345678" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="street" render={({ field }) => (
          <FormItem>
            <FormLabel>街道地址</FormLabel>
            <FormControl><Input placeholder="忠孝東路四段 100 號" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-3 gap-3">
          <FormField control={control} name="district" render={({ field }) => (
            <FormItem>
              <FormLabel>區</FormLabel>
              <FormControl><Input placeholder="大安區" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="city" render={({ field }) => (
            <FormItem>
              <FormLabel>城市</FormLabel>
              <FormControl><Input placeholder="台北市" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="postalCode" render={({ field }) => (
            <FormItem>
              <FormLabel>郵遞區號</FormLabel>
              <FormControl><Input placeholder="106" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isDefault"
            {...form.register("isDefault")}
            className="w-4 h-4"
          />
          <label htmlFor="isDefault" className="text-sm">設為預設地址</label>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onDone} className="flex-1">
            取消
          </Button>
          <Button type="submit" variant="custom" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
            {existing ? "儲存變更" : "新增地址"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
