"use client";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { brands } from "@/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  items: z.array(z.string()),
});

const FilterBar = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form submission started:", data);
    // try {
    //   await MagicSignin(values.email); // Ensure this function is awaited
    //   console.log("Form submission completed.");
    // } catch (error) {
    //   console.error("Error during submission:", error);
    // }
  }

  return (
    <div className=" text-[18px] pr-35">
      <Button
        variant="custom"
        className="p-5 mb-4 md:w-60 rounded-3xl md:text-[18px]"
      >
        清除全部篩選條件
      </Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border-black border-t-2 pt-2 pl-3"
        >
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-md">品牌</FormLabel>
                </div>
                {brands.map((brand) => (
                  <FormField
                    key={brand.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={brand.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(brand.id)}
                              className="border-black text-black data-[state=checked]:bg-black data-[state=checked]:border-black"
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, brand.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== brand.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {brand.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Button type="submit">Submit</Button> */}
        </form>
      </Form>
    </div>
  );
};
export default FilterBar;
