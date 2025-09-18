"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contactType: 'email', // 'email' or 'phone'
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: 'Nam',
    height: 170,
    weight: 65,
    goal: 'Ổn định đường huyết',
    conditions: [] as string[]
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement Supabase Auth registration
      console.log('Registration data:', formData);
      
      // Mock success - redirect to profile setup
      setTimeout(() => {
        router.push('/profile/setup');
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      conditions: checked 
        ? [...prev.conditions, condition]
        : prev.conditions.filter(c => c !== condition)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl text-white">🤖</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Đăng ký DIABOT</h1>
          <p className="text-gray-600 mt-2">Tạo tài khoản để bắt đầu hành trình sức khỏe</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Contact Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Thông tin liên hệ</label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, contactType: 'email' }))}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  formData.contactType === 'email' 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, contactType: 'phone' }))}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  formData.contactType === 'phone' 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Số điện thoại
              </button>
            </div>
          </div>

          {/* Email or Phone Input */}
          {formData.contactType === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0901234567"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
            <input
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Giới tính</label>
            <div className="flex space-x-4">
              {['Nam', 'Nữ', 'Khác'].map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Height Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chiều cao: {formData.height} cm
            </label>
            <input
              type="range"
              min="140"
              max="200"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>140cm</span>
              <span>200cm</span>
            </div>
          </div>

          {/* Weight Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cân nặng: {formData.weight} kg
            </label>
            <input
              type="range"
              min="40"
              max="120"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>40kg</span>
              <span>120kg</span>
            </div>
          </div>

          {/* Goal Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu</label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Ổn định đường huyết">Ổn định đường huyết</option>
              <option value="Giảm cân">Giảm cân</option>
              <option value="Tăng cơ">Tăng cơ</option>
            </select>
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Bệnh nền (nếu có)</label>
            <div className="space-y-2">
              {['Gout', 'Mỡ máu cao', 'Huyết áp cao', 'Tiểu đường', 'Khác'].map((condition) => (
                <label key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.conditions.includes(condition)}
                    onChange={(e) => handleConditionChange(condition, e.target.checked)}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link href="/auth/login" className="text-green-500 hover:text-green-600 font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}