export default function ProductShippingSection() {
  return (
    <div className="text-lg text-center leading-relaxed flex justify-center gap-40">
      <div className="pl-28">
        <p className="font-bold mb-4">送貨方式</p>
        <p>新竹物流宅配 - 限本島</p>
        <p>7-11 取貨不付款</p>
        <p>全家取貨不付款</p>
        <p>ＯＫ取貨不付款</p>
        <p>萊爾富取貨不付款</p>
      </div>
      <div>
        <p className="font-bold mb-4">付款方式</p>
        <p>Apply Pay</p>
        <p>Google Pay</p>
        <p>Line Pay</p>
        <p>信用卡 （VISA / Master）</p>
        <p>銀行轉帳 （需於 24 小時內轉賬付款後才會訂貨）</p>
      </div>
    </div>
  );
}
