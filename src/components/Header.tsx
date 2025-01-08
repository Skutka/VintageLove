import React from 'react';
import { Heart } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8" />
            <span className="text-2xl font-bold">VintageLove</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => window.location.hash = '#discover'} className="hover:text-pink-200 transition">Discover</button>
            <button onClick={() => window.location.hash = '#matches'} className="hover:text-pink-200 transition">Matches</button>
            <button onClick={() => window.location.hash = '#messages'} className="hover:text-pink-200 transition">Messages</button>
            <button onClick={() => window.location.hash = '#profile'} className="hover:text-pink-200 transition">Profile</button>
          </nav>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-100 transition">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}