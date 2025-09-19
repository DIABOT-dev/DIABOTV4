"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/interfaces/ui/components/atoms/Card";
import Button from "@/interfaces/ui/components/atoms/Button";
import Toast from "@/interfaces/ui/components/atoms/Toast";

export default function Dashboard() {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const quickActions = [
    { key: "water", label: "Uống nước", icon: "💧", path: "/log/water" },
    { key: "bg", label: "Đường huyết", icon: "🩸", path: "/log/bg" },
    { key: "meal", label: "Bữa ăn", icon: "🍽️", path: "/log/meal" },
    { key: "insulin", label: "Insulin", icon: "💉", path: "/log/insulin" },
  ];

  const handleQuickAction = (path: string, label: string) => {
    setToast({ message: `Mở ${label}...`, type: 'success' });
    setTimeout(() => router.push(path), 500);
  };

  return (
    <div className="min-h-screen pb-24 bg-bg">
      {/* Header */}
      <header className="p-4 bg-white shadow-sm">
        <div className="max-w-md mx-auto">
          <p className="text-sm text-muted">Xin chào, Tuấn Anh</p>
          <h1 className="text-xl font-bold">Dashboard DIABOT V4</h1>
          <p className="text-xs text-primary font-semibold">Điểm thưởng: 3,249</p>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-4">
        {/* Stats Overview */}
        <Card data-testid="stats-overview">
          <h2 className="font-semibold mb-3">Tổng quan hôm nay</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">119</p>
              <p className="text-xs text-muted">BG (mg/dL)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">6</p>
              <p className="text-xs text-muted">Cốc nước</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">4.2k</p>
              <p className="text-xs text-muted">Bước chân</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card data-testid="quick-actions">
          <h2 className="font-semibold mb-3">Nhập liệu nhanh</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ key, label, icon, path }) => (
              <Button
                key={key}
                variant="ghost"
                size="lg"
                onClick={() => handleQuickAction(path, label)}
                className="flex-col h-20 gap-2"
                data-testid={`quick-${key}`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm">{label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Chart Placeholder */}
        <Card data-testid="chart-section">
          <h2 className="font-semibold mb-3">Biểu đồ 7 ngày</h2>
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-sm text-muted">Chart sẽ được implement sau</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full mt-3"
            onClick={() => router.push("/charts")}
          >
            Xem chi tiết
          </Button>
        </Card>

        {/* AI Agent Preview */}
        <Card data-testid="ai-preview">
          <h2 className="font-semibold mb-3">🤖 Trợ lý AI</h2>
          <p className="text-sm text-muted mb-3">
            Hỏi về đường huyết, thực đơn, hoặc lời khuyên sức khỏe
          </p>
          <Button 
            variant="primary" 
            size="md" 
            className="w-full"
            onClick={() => router.push("/ai-agent")}
          >
            Mở trò chuyện
          </Button>
        </Card>
      </main>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          data-testid="dashboard-toast"
        />
      )}
    </div>
  );
}