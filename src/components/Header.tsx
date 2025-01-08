import React from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface HeaderProps {
  user: any;
  onOpenAuth: () => void;
}

export function Header({ user, onOpenAuth }: HeaderProps) {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
    }
  };

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
            <button onClick={() => window.location.hash = '#likes'} className="hover:text-pink-200 transition">Likes</button>
            <button onClick={() => window.location.hash = '#messages'} className="hover:text-pink-200 transition">Messages</button>
            <button onClick={() => window.location.hash = '#profile'} className="hover:text-pink-200 transition">Profile</button>
          </nav>
          {user ? (
            <button
              onClick={handleSignOut}
              className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-100 transition"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-100 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}