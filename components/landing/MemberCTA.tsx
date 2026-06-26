import Link from "next/link";
import { Instagram, MessageCircle, UserPlus } from "lucide-react";

const IG_URL =
  "https://www.instagram.com/bawancheapgo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
const LINE_URL = "https://line.me/ti/p/DmJPJC2Kz5";

export default function MemberCTA() {
  return (
    <section className="py-20 bg-[#F5EEE0]" data-aos="fade-up">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          成為我們的會員
        </h2>
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          獲得第一手新品與優惠消息 ❤
        </p>
        <p className="text-sm text-gray-500 leading-relaxed mb-10">
          有想找的品牌但頁面上沒看到嗎？<br />
          歡迎 IG 私訊 或 加入 LINE 詢問商品！
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 border border-[#9e7c59] text-[#9e7c59] hover:bg-[#9e7c59] hover:text-white text-sm tracking-wide px-7 py-3 rounded-full transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            加入會員
          </Link>
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-gray-400 text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800 text-sm tracking-wide px-7 py-3 rounded-full transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </a>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-green-500 text-green-600 hover:bg-green-500 hover:text-white text-sm tracking-wide px-7 py-3 rounded-full transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            LINE 詢問
          </a>
        </div>
      </div>
    </section>
  );
}
