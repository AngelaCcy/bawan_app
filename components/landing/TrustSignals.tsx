import Image from "next/image";
import { Truck, BadgeCheck } from "lucide-react";

const items = [
  {
    icon: <Image src="/img/quality_guarantee.png" alt="正品" width={32} height={32} />,
    label: "專櫃正品",
  },
  {
    icon: <Truck className="w-8 h-8 text-[#9e7c59]" />,
    label: "全館滿$1500免運",
  },
  {
    icon: <BadgeCheck className="w-8 h-8 text-[#9e7c59]" />,
    label: "品質保證",
  },
  {
    icon: <Image src="/img/price.png" alt="低價" width={32} height={32} />,
    label: "比專櫃低價",
  },
];

export default function TrustSignals() {
  return (
    <section className="py-12 bg-white border-t border-gray-100" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#F5EEE0]">
                {item.icon}
              </div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
