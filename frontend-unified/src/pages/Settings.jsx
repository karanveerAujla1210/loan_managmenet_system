import { Bell, Lock, Eye } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your preferences and security</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-[#1741FF]" />
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          {['Email Notifications', 'SMS Alerts', 'Push Notifications'].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <label className="text-gray-700">{item}</label>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="w-6 h-6 text-[#1741FF]" />
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        </div>
        <div className="space-y-4">
          <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-left">
            Change Password
          </button>
          <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-left">
            Two-Factor Authentication
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="w-6 h-6 text-[#1741FF]" />
          <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
        </div>
        <div className="space-y-4">
          {['Data Collection', 'Analytics Tracking', 'Third-party Sharing'].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <label className="text-gray-700">{item}</label>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
