"use client";

import { useState } from 'react';
import { mockProfile } from '@/mock/profile';

export default function ProfilePage() {
  const [profile] = useState(mockProfile);

  const calculateBMI = (weight: number, height: number) => {
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Thiếu cân', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Bình thường', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Thừa cân', color: 'text-yellow-600' };
    return { text: 'Béo phì', color: 'text-red-600' };
  };

  const currentBMI = parseFloat(calculateBMI(profile.goals.weight.current, 170)); // Mock height
  const bmiStatus = getBMIStatus(currentBMI);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl text-white">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Sổ Khám Bệnh</h1>
          <p className="text-gray-600 mt-2">Hồ sơ sức khỏe cá nhân</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-sm">ℹ️</span>
              </span>
              Thông tin cá nhân
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Họ và tên:</span>
                <span className="font-medium">{profile.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Ngày sinh:</span>
                <span className="font-medium">{profile.dob}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Giới tính:</span>
                <span className="font-medium">{profile.gender}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Điện thoại:</span>
                <span className="font-medium">{profile.phone}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{profile.email}</span>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </span>
              Chỉ số sức khỏe
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Cân nặng hiện tại:</span>
                <span className="font-medium">{profile.goals.weight.current} kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Cân nặng mục tiêu:</span>
                <span className="font-medium">{profile.goals.weight.target} kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">BMI:</span>
                <span className={`font-medium ${bmiStatus.color}`}>
                  {currentBMI} ({bmiStatus.text})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">HbA1c mục tiêu:</span>
                <span className="font-medium">{profile.goals.hba1c}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Bước chân/ngày:</span>
                <span className="font-medium">{profile.goals.steps.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-red-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-sm">🏥</span>
              </span>
              Bệnh lý & Thuốc
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Bệnh nền:</h3>
                <div className="space-y-1">
                  {profile.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Thuốc đang dùng:</h3>
                <div className="space-y-1">
                  {profile.medications.map((medication, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-600">{medication}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Care Team */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-6 h-6 bg-purple-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white text-sm">👥</span>
              </span>
              Đội ngũ chăm sóc
            </h2>
            
            <div className="space-y-4">
              {profile.caregivers.map((caregiver, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{caregiver.name}</p>
                      <p className="text-sm text-gray-600">{caregiver.role}</p>
                    </div>
                    <p className="text-sm text-gray-600">{caregiver.phone}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Cài đặt:</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Chia sẻ dữ liệu:</span>
                  <span className={`text-sm font-medium ${profile.settings.shareWithCaregiver ? 'text-green-600' : 'text-red-600'}`}>
                    {profile.settings.shareWithCaregiver ? 'Có' : 'Không'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Nhắc nhở:</span>
                  <div className="mt-1">
                    {profile.settings.reminders.map((reminder, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
                        {reminder}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              const dataStr = JSON.stringify(profile, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'diabot-profile.json';
              link.click();
            }}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            📄 Xuất hồ sơ JSON
          </button>
        </div>
      </div>
    </div>
  );
}