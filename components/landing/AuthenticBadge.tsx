import Image from "next/image";
import Link from "next/link";

export default function AuthenticBadge() {
  return (
    <section className="py-16 bg-white" data-aos="fade-up">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Text */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
            專櫃正品<br />代購
          </h2>
          <p className="text-gray-500 text-lg mb-8">不必付專櫃價！ ✦✦✦</p>
          <Link
            href="/products"
            className="inline-block border border-[#9e7c59] text-[#9e7c59] hover:bg-[#9e7c59] hover:text-white text-sm tracking-widest px-8 py-3 rounded-full transition-colors"
          >
            探索更多
          </Link>
        </div>

        {/* Image */}
        <div className="flex-1 relative aspect-square max-w-sm w-full rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/img/LE LABO/lelabo2.jpeg"
            alt="正品代購"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
