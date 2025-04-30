import SignUpForm from "@/components/form/signup-form";
// import { redirect } from "next/navigation";
// import { auth } from "@/auth";
import Image from "next/image";
import logo from "@/public/img/logo.png";

const SignUpPage = async () => {
  //   const session = await auth();
  //   if (session?.user) {
  //     return redirect("/");
  //   }
  return (
    <div className="w-full flex flex-col items-center">
      <Image src={logo} alt="menu" width={150} height={150} />
      <h1 className="text-2xl font-bold pb-4">會員註冊</h1>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
