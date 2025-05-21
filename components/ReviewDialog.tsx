import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import ReactStars from "react-stars";
import { Input } from "./ui/input";
import { createReview } from "@/app/utils/actions";
import toast from "react-hot-toast";
import { useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewValidation, ReviewFormData } from "@/lib/validations/auth";

export default function ReviewDialog({
  productId,
  onSuccess,
}: {
  productId: number;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false); // Used to control the dialog
  //   const [title, setTitle] = useState("");
  //   const [content, setContent] = useState("");
  //   const [rating, setRating] = useState(0);
  const { currentUser } = useCurrentUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewValidation),
    defaultValues: {
      title: "",
      content: "",
      rating: 0,
    },
  });

  const rating = watch("rating");

  const onSubmit = async (data: ReviewFormData) => {
    if (!currentUser?.id) {
      toast.error("請先登入喔！");
      return;
    }

    try {
      await createReview({
        productId,
        userId: currentUser.id,
        ...data,
      });

      toast.success("評論建立成功！");
      reset(); //Clear form
      setOpen(false); // Close dialog
      onSuccess?.(); // Refresh review section
    } catch (error) {
      console.error("提交失敗", error);
      toast.error("發生錯誤！");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="custom" className="w-40 text-xl">
          寫評價
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>建立評論</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* <div className="grid gap-4 py-4"> */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              評價
            </Label>
            <ReactStars
              count={5}
              size={24}
              color1={"white"}
              color2={"black"}
              value={rating}
              //   value={0}
              onChange={(rating) =>
                setValue("rating", rating, { shouldValidate: true })
              }
              //   onChange={(newRating) => setRating(newRating)}
            />
            {errors.rating && (
              <p className="col-span-4 text-sm text-red-500 mt-1 ml-32">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              標題
            </Label>
            <Input
              {...register("title")}
              id="title"
              //   onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
            {errors.title && (
              <p className="col-span-4 text-sm text-red-500 mt-1 ml-32">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              內容
            </Label>
            <Input
              {...register("content")}
              id="content"
              //   onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
            />
            {errors.content && (
              <p className="col-span-4 text-sm text-red-500 mt-1 ml-32">
                {errors.content.message}
              </p>
            )}
          </div>
          {/* </div> */}

          <DialogFooter className="justify-center">
            <Button type="submit">提交評論</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
