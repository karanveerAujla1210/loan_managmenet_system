import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { User, Lock, Bell, Shield } from 'lucide-react'

export const Settings: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'security'>('profile')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-body-lg text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-gray-200">
        {(['profile', 'password', 'notifications', 'security'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'profile' && <User size={18} />}
            {tab === 'password' && <Lock size={18} />}
            {tab === 'notifications' && <Bell size={18} />}
            {tab === 'security' && <Shield size={18} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card title="Profile Information">
            <div className="space-y-4">
              <Input 
                label="Full Name"
                value={user?.name || ''}
              />
              <Input 
                label="Email"
                value={user?.email || ''}
                disabled
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Role"
                  value={user?.role.replace('_', ' ') || ''}
                  disabled
                />
                <Input 
                  label="Member Since"
                  value="January 15, 2024"
                  disabled
                />
              </div>
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </Card>

          <Card title="Profile Picture">
            <div className="flex items-center gap-6">
              <img 
                src={user?.avatar}
                alt={user?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium mb-2">
                  Upload Photo
                </button>
                <p className="text-sm text-gray-600">JPG, PNG. Max 2MB</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <Card title="Change Password">
          <div className="space-y-4 max-w-md">
            <Input 
              label="Current Password"
              type="password"
              placeholder="Enter current password"
            />
            <Input 
              label="New Password"
              type="password"
              placeholder="Enter new password"
            />
            <Input 
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
            />
            <button className="w-full bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium">
              Update Password
            </button>
          </div>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {[
            { title: 'Payment Reminders', desc: 'Get notified about upcoming EMI payments' },
            { title: 'System Updates', desc: 'Receive alerts for important system updates' },
            { title: 'Daily Reports', desc: 'Get daily summary of collections and cases' },
            { title: 'Overdue Alerts', desc: 'Instant notification for overdue cases' }
          ].map((notif, idx) => (
            <Card key={idx} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{notif.title}</p>
                <p className="text-sm text-gray-600">{notif.desc}</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-primary" />
            </Card>
          ))}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card title="Two-Factor Authentication">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                Enable
              </button>
            </div>
          </Card>

          <Card title="Active Sessions">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Current Session</p>
                  <p className="text-xs text-gray-600">Chrome on Windows • 192.168.1.1</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-success/10 text-success rounded">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Safari on iPhone</p>
                  <p className="text-xs text-gray-600">Last active: 2 hours ago</p>
                </div>
                <button className="text-xs text-danger hover:underline font-medium">Logout</button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Settings
