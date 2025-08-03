import React, { useState } from 'react';
import { Settings, Edit3, Check, X } from 'lucide-react';
import { AccountSettings } from '../types';

interface AccountHeaderProps {
  settings: AccountSettings;
  currentBalance: number;
  onSettingsChange: (settings: AccountSettings) => void;
}

export default function AccountHeader({ settings, currentBalance, onSettingsChange }: AccountHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(editedSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSettings(settings);
    setIsEditing(false);
  };

  const progressPercentage = Math.min((currentBalance / settings.goal) * 100, 100);

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editedSettings.childName}
                onChange={(e) => setEditedSettings({ ...editedSettings, childName: e.target.value })}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 backdrop-blur-sm"
                placeholder="Child's Name"
              />
              <input
                type="text"
                value={editedSettings.accountName}
                onChange={(e) => setEditedSettings({ ...editedSettings, accountName: e.target.value })}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 backdrop-blur-sm"
                placeholder="Account Name"
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{settings.childName}'s Savings</h1>
              <p className="text-white/90 text-lg">{settings.accountName}</p>
            </>
          )}
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Check size={20} />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Settings size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-white/80 text-sm">Current Balance</p>
          <p className="text-2xl font-bold">${currentBalance.toFixed(2)}</p>
        </div>
        
        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
          {isEditing ? (
            <div>
              <label className="text-white/80 text-sm block mb-1">Weekly Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={editedSettings.savingsRate}
                onChange={(e) => setEditedSettings({ ...editedSettings, savingsRate: parseFloat(e.target.value) || 0 })}
                className="bg-white/20 border border-white/30 rounded px-2 py-1 text-white w-full"
              />
              <label className="text-white/80 text-sm block mb-1 mt-2">Payment Period</label>
              <select
                value={editedSettings.compoundingPeriod}
                onChange={(e) => setEditedSettings({ ...editedSettings, compoundingPeriod: e.target.value as 'weekly' | 'monthly' | 'annually' })}
                className="bg-white/20 border border-white/30 rounded px-2 py-1 text-white w-full"
              >
                <option value="weekly">Every Week</option>
                <option value="monthly">Every Month</option>
                <option value="annually">Every Year</option>
              </select>
            </div>
          ) : (
            <>
              <p className="text-white/80 text-sm">Savings Rate</p>
              <p className="text-2xl font-bold">{settings.savingsRate}% weekly</p>
              <p className="text-white/70 text-xs">{settings.compoundingPeriod}</p>
            </>
          )}
        </div>
        
        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
          {isEditing ? (
            <div>
              <label className="text-white/80 text-sm block mb-1">Goal ($)</label>
              <input
                type="number"
                step="10"
                value={editedSettings.goal}
                onChange={(e) => setEditedSettings({ ...editedSettings, goal: parseFloat(e.target.value) || 0 })}
                className="bg-white/20 border border-white/30 rounded px-2 py-1 text-white w-full"
              />
            </div>
          ) : (
            <>
              <p className="text-white/80 text-sm">Savings Goal</p>
              <p className="text-2xl font-bold">${settings.goal.toFixed(2)}</p>
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/90">Progress to Goal</span>
            <span className="text-white font-semibold">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {progressPercentage >= 100 && (
            <p className="text-yellow-300 font-semibold mt-2 animate-pulse">🎉 Goal Achieved! 🎉</p>
          )}
        </div>
      )}
    </div>
  );
}