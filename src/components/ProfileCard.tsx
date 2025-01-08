import React, { useState } from 'react';
import { Heart, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import type { User } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// ... (keep existing interface)

export function ProfileCard({ user, currentUser, onLike }: ProfileCardProps) {
  // ... (keep existing state)

  const triggerMatchAnimation = () => {
    // Create heart-shaped confetti
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['heart'],
      colors: ['#ff0000', '#ff69b4', '#ff1493', '#ff007f']
    };

    confetti({
      ...defaults,
      particleCount: 50,
      scalar: 2
    });

    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 3
    });

    confetti({
      ...defaults,
      particleCount: 35,
      scalar: 1.2
    });

    // Show match toast with animation
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                It's a Match! 🎉
              </p>
              <p className="mt-1 text-sm text-gray-500">
                You and {user.name} have liked each other!
              </p>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: 4000,
      position: 'top-center',
    });
  };

  const handleLike = async () => {
    // ... (keep existing like logic until the mutual like check)

    // When checking for mutual like:
    if (mutualLike) {
      triggerMatchAnimation();
    }

    // ... (rest of the existing like logic)
  };

  // ... (rest of the component remains the same)
}