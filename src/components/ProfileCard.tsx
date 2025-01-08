import React from 'react';
import { Heart, MapPin, User as UserIcon } from 'lucide-react';
import type { User } from '../types';

interface ProfileCardProps {
  user: User;
  onLike: (userId: string) => void;
}

export function ProfileCard({ user, onLike }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={user.profileImage}
          alt={`${user.name}'s profile`}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-2xl font-bold text-white">{user.name}, {user.age}</h3>
          <div className="flex items-center text-white/90">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{user.location.city}, {user.location.country}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {user.interests.map((interest, index) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mb-4">{user.bio}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="mr-4">{user.height}cm</span>
            <span className="mr-4">{user.hairColor} hair</span>
            <span>{user.eyeColor} eyes</span>
          </div>
          <button
            onClick={() => onLike(user.id)}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:opacity-90 transition"
          >
            <Heart className="h-4 w-4" />
            <span>Like</span>
          </button>
        </div>
      </div>
    </div>
  );
}