import React, { useState, useEffect } from 'react';
import { Heart, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import type { User } from '../types';
import { supabase } from '../lib/supabase';

interface ProfileCardProps {
  user: User;
  currentUser: any;
  onLike: (userId: string) => void;
  isLikedByUser?: boolean;
}

export function ProfileCard({ user, currentUser, onLike, isLikedByUser }: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [hasLikedMe, setHasLikedMe] = useState(false);
  const allPhotos = [user.profileImage, ...(user.profilePhotos || [])].filter(Boolean);

  useEffect(() => {
    if (currentUser) {
      const checkLike = async () => {
        try {
          const { data, error } = await supabase
            .from('likes')
            .select('*')
            .eq('from_user_id', user.id)
            .eq('to_user_id', currentUser.id);

          if (error) {
            console.error('Error checking likes:', error);
            return;
          }

          setHasLikedMe(data && data.length > 0);
        } catch (error) {
          console.error('Error checking likes:', error);
        }
      };
      checkLike();
    }
  }, [user.id, currentUser]);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? allPhotos.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative aspect-[4/5] bg-gray-100">
        {allPhotos[currentPhotoIndex] ? (
          <img
            src={allPhotos[currentPhotoIndex]}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {allPhotos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>
          </>
        )}
        {hasLikedMe && (
          <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            {user.name}, {user.age}
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate max-w-[120px]">
              {user.location.city}
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{user.bio}</p>

        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-gray-500 text-xs">Height</span>
            <p className="font-medium">{user.height}cm</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Hair</span>
            <p className="font-medium">{user.hairColor}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Eyes</span>
            <p className="font-medium">{user.eyeColor}</p>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap gap-1.5">
            {user.interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs"
              >
                {interest}
              </span>
            ))}
            {user.interests.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                +{user.interests.length - 3}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onLike(user.id)}
          disabled={!currentUser}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
            currentUser
              ? isLikedByUser
                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                : 'bg-pink-50 text-pink-500 hover:bg-pink-100'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLikedByUser ? 'fill-current' : ''}`} />
          <span className="font-medium">
            {isLikedByUser ? 'Liked' : 'Like'}
          </span>
        </button>
      </div>
    </div>
  );
}