"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [setupData, setSetupData] = useState({
    goals: {
      primaryGoal: 'Ổn định đường huyết',
      targetWeight: 65,
      targetHbA1c: 6.5,
      dailySteps: 6000,
      waterCups: 6
    },
    preferences: {
      reminderTimes: ['08:00', '20:00'],
      shareWithFamily: true,
      notifications: true
    }
  });

  const handleComplete = () => {
    // TODO: Save setup data to profile
    console.log('Profile setup completed:', setupData);
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl text-white">⚙️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Thiết lập hồ sơ</h1>
          <p className="text-gray-600 mt-2">Bước {step}/2: Hoàn thiện thông tin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Mục tiêu sức khỏe</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu chính</label>
                <select
                  value={setupData.goals.primaryGoal}
                  onChange={(e) => setSetupData(prev => ({
                    ...prev,
                    goals: { ...prev.goals, primaryGoal: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Ổn định đường huyết">Ổn định đường huyết</option>
                  <option value="Giảm cân">Giảm cân</option>
                  <option value="Tăng cơ">Tăng cơ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cân nặng mục tiêu: {setupData.goals.targetWeight} kg
                </label>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={setupData.goals.targetWeight}
                  onChange={(e) => setSetupData(prev => ({
                    ...prev,
                    goals: { ...prev.goals, targetWeight: parseInt(e.target.value) }
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HbA1c mục tiêu: {setupData.goals.targetHbA1c}%
                </label>
                <input
                  type="range"
                  min="5.0"
                  max="8.0"
                  step="0.1"
                  value={setupData.goals.targetHbA1c}
                  onChange={(e) => setSetupData(prev => ({
                    ...prev,
                    goals: { ...prev.goals, targetHbA1c: parseFloat(e.target.value) }
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bước chân/ngày: {setupData.goals.dailySteps.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="3000"
                  max="15000"
                  step="500"
                  value={setupData.goals.dailySteps}
                  onChange={(e) => setSetupData(prev => ({
                    ...prev,
                    goals: { ...prev.goals, dailySteps: parseInt(e.target.value) }
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Tiếp theo
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Cài đặt ứng dụng</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Thời gian nhắc nhở</label>
                <div className="space-y-2">
                  <input
                    type="time"
                    value={setupData.preferences.reminderTimes[0]}
                    onChange={(e) => setSetupData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        reminderTimes: [e.target.value, prev.preferences.reminderTimes[1]]
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={setupData.preferences.reminderTimes[1]}
                    onChange={(e) => setSetupData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        reminderTimes: [prev.preferences.reminderTimes[0], e.target.value]
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={setupData.preferences.shareWithFamily}
                    onChange={(e) => setSetupData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, shareWithFamily: e.target.checked }
                    }))}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Chia sẻ dữ liệu với người thân</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={setupData.preferences.notifications}
                    onChange={(e) => setSetupData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, notifications: e.target.checked }
                    }))}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Nhận thông báo nhắc nhở</span>
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Hoàn thành
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}