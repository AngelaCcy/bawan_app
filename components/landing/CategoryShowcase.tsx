import Image from "next/image";
import Link from "next/link";

const categories = [
  { label: "BEAUTY", zh: "美妝", image: "/img/beauty.jpeg", href: "/products?category=美妝" },
  { label: "BODY", zh: "身體", image: "/img/body.png", href: "/products?category=身體" },
  { label: "HAIR", zh: "髮品", image: "/img/aveda.png", href: "/products?category=髮品" },
];

export default function CategoryShowcase() {
  return (
    <section className="py-16 bg-[#EDEDE9]" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href} className="group flex flex-col items-center gap-3">
              {/* Arch frame */}
              <div
                className="relative w-36 h-48 overflow-hidden shadow-md group-hover:shadow-lg transition-shadow"
                style={{ borderRadius: "50% 50% 0 0 / 40% 40% 0 0" }}
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-sm font-semibold tracking-widest text-gray-700 group-hover:text-[#9e7c59] transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
