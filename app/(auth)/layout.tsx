interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <section className="p-8 w-[95%] sm:w-4/5 md:w-3/5 lg:w-2/5 mx-auto mt-24">
      {children}
    </section>
  );
}
