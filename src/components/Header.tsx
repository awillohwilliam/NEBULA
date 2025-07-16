import React from 'react';
import { Smartphone, Wifi, User, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import NetworkStatus from './NetworkStatus';

const Header: React.FC = () => {
  const { user, notifications } = useStore();
  const unreadCount = notifications.length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">NebulaNeT</h1>
              <p className="text-sm text-gray-500">Affordable Telecom Solutions</p>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <NetworkStatus />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Wifi className="w-4 h-4" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>24/7 Support</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user ? user.name : 'Account'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;