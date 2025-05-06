import * as z from "zod";

export const userSignInValidation = z.object({
  email: z.string().min(1, "信箱是必填欄位").email("信箱格式錯誤或無效"),
  // password: z.string().min(1, "密碼是必填欄位"),
});

export const userSignUpValidation = z.object({
  name: z.string().min(1, "姓名是必填欄位").max(50, "姓名需少於50個字"),
  gender: z.enum(["女生", "男生"]),
  birth: z.coerce.date({ invalid_type_error: "生日是必填欄位" }),
  email: z.string().min(1, "信箱是必填欄位").email("信箱格式錯誤或無效"),
  phone: z
    .string()
    .min(1, "電話是必填欄位")
    .regex(/^\d{10}$/, "電話格式不符合"),
  address: z.string().min(1, "地址是必填欄位"),
  // password: z
  //   .string()
  //   .min(1, "密碼是必填欄位")
  //   .min(8, "密碼必須大於8位")
  //   .refine((val) => /[A-Z]/.test(val), {
  //     message: "密碼需包含英文大寫",
  //   })
  //   .refine((password) => /[a-z]/.test(password), {
  //     message: "密碼需包含英文小寫",
  //   })
  //   .refine((password) => /[0-9]/.test(password), {
  //     message: "密碼需包含數字",
  //   }),
  // confirmPassword: z.string().min(1, "請再次確認密碼"),
  promotion: z.boolean().optional(),
  termAndCon: z.boolean().refine((val) => val, {
    message: "請閱讀條款並同意",
  }),
});
// .refine((data) => data.password === data.confirmPassword, {
//   path: ["confirmPassword"],
//   message: "密碼不一致",
// });

export type User = z.infer<typeof userSignUpValidation>;
