"use client";

import { Home, Gift, HeartPulse, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const BRAND = {
  primary: "#28bdbf",
  primaryHover: "#03c0bc",
};

const Item = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: JSX.Element;
  label: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link
      href={to}
      className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-colors`}
      style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.8)" }}
    >
      <div className="h-9 w-9 grid place-items-center rounded-full">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default function BottomNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[40]">
      {/* Right-docked menu for [+] */}
      {open && (
        <div
          className="fixed inset-0 bg-black/25 flex justify-end z-[60]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-80 max-w-[80vw] h-full bg-white shadow-xl p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold mb-3 text-center">
              Lựa chọn nhanh
            </p>
            <div className="grid gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/pillbox");
                }}
                className="px-4 py-3 text-white rounded-xl font-semibold h-12 w-full"
                style={{ backgroundColor: BRAND.primary }}
              >
                Lịch thuốc
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/learn");
                }}
                className="px-4 py-3 rounded-xl font-semibold h-12 w-full"
                style={{
                  border: `1px solid ${BRAND.primary}`,
                  color: BRAND.primary,
                }}
              >
                Đào tạo
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/me");
                }}
                className="px-4 py-3 rounded-xl font-semibold h-12 w-full"
                style={{
                  border: `1px solid ${BRAND.primary}`,
                  color: BRAND.primary,
                }}
              >
                Tôi
              </button>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold w-full mt-3"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* NAV nền xanh SM, chữ/icon trắng */}
      <nav
        className="mx-4 px-3 pt-2 pb-3 rounded-2xl shadow-[0_-12px_28px_rgba(0,0,0,.18)] border"
        style={{
          backgroundColor: BRAND.primary,
          borderColor: "rgba(255,255,255,.18)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor =
            BRAND.primaryHover)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor =
            BRAND.primary)
        }
      >
        <div className="grid grid-cols-4 items-end text-white">
          <Item to="/" icon={<Home className="h-[22px] w-[22px]" />} label="Trang chủ" />
          <Item to="/rewards" icon={<Gift className="h-[22px] w-[22px]" />} label="Quà tặng" />
          <Item to="/health" icon={<HeartPulse className="h-[22px] w-[22px]" />} label="Sức khỏe" />
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-1 py-2 rounded-xl"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            <div className="h-9 w-9 grid place-items-center">
              <Plus className="h-[22px] w-[22px]" />
            </div>
            <span className="text-[13.5px] font-semibold">Thêm</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
