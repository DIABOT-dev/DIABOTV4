"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/interfaces/ui/components/atoms/Card";
import Button from "@/interfaces/ui/components/atoms/Button";

export default function Dashboard() {
  const router = useRouter();
  const goChart = () => router.push("/charts");
  const quick = (path: string) => router.push(`/log/${path}`);

  return (
    <div className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <header className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Xin chào, Tuấn Anh</p>
            <h1 className="text-xl font-bold">Hãy hoàn thành các mục tiêu</h1>
          </div>
          <div className="text-xs font-semibold text-primary-700">Điểm thưởng: 3,249</div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Banner kế hoạch hôm nay */}
        <div className="rounded-2xl p-4 bg-primary-50 border border-primary-100">
          <p className="text-primary-700 font-semibold">Kế hoạch hôm nay</p>
          <p className="text-2xl font-extrabold text-primary-700">Hãy hoàn thành các mục tiêu</p>
        </div>

        {/* Dữ liệu cá nhân */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Dữ liệu cá nhân</p>
              <p className="text-sm text-muted">Biểu đồ & nhật ký </p>
            </div>
            <button
  onClick={goChart}                 // hiện đang trỏ /charts theo Cách A
  className="h-[var(--h-input-sm)] px-10 rounded-lg border-2 border-primary text-primary bg-white hover:bg-primary-50 transition"
>
  Mở bảng
</button>

          </div>
        </Card>

        {/* Khám phá & nhận thưởng */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Khám phá & nhận thưởng</p>
              <p className="text-sm text-muted">Hoàn thành thử thách để nhận điểm</p>
            </div>
            <Button size="sm" variant="secondary">Mở</Button>
          </div>
        </Card>

      {/* Nhập liệu nhanh */}
        
<section>
  <p className="font-semibold mb-3 text-[16px]">Nhập liệu nhanh</p>
  <div className="grid grid-cols-4 gap-3">
    {[
      { key: "bg",      label: "Ghi đường huyết", icon: "/assets/icons/bg.png" },
      { key: "insulin", label: "Tiêm insulin",    icon: "/assets/icons/insulin.png" },
      { key: "water",   label: "Uống nước",       icon: "/assets/icons/water.png" },
      { key: "meal",    label: "Bữa ăn",          icon: "/assets/icons/meal.png" },
    ].map(({ key, label, icon }) => (
      <button
        key={key}
        onClick={() => quick(key)}
        className="group rounded-2xl p-4 text-center
                   border border-primary-100 bg-primary-50 hover:bg-primary-100 transition"
        aria-label={label}
      >
        {/* Icon to, KHÔNG bọc vòng trắng */}
        <img src={icon} alt={label} className="mx-auto mb-2 h-9 w-9" />
        <div className="text-[14px] font-semibold text-primary-700 group-hover:text-primary-700">
          {label}
        </div>
      </button>
    ))}
  </div>
</section>

        {/* Bản tin cộng đồng – placeholder */}
        <Card className="p-4">
          <p className="font-semibold mb-1">Bản tin cộng đồng</p>
          <p className="text-sm text-muted">Sắp ra mắt…</p>
        </Card>

        {/* Liên kết nhanh tới trợ lý – optional */}
        <div className="text-center text-sm">
          <Link className="text-primary-700 underline" href="/ai-agent">Mở Trợ lý AI</Link>
        </div>
      </main>
    </div>
  );
}
