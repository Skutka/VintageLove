import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { ImageUpload } from './ImageUpload';
import { Trash2 } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import type { User } from '../types';

interface ProfileEditorProps {
  user: any;
}

export function ProfileEditor({ user }: ProfileEditorProps) {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    city: '',
    country: '',
    height: '',
    hair_color: '',
    eye_color: '',
    interests: [] as string[],
    bio: '',
    profile_image: '',
    profile_photos: [] as string[],
    profile_visible: true
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile({
          name: data.name || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          city: data.city || '',
          country: data.country || '',
          height: data.height?.toString() || '',
          hair_color: data.hair_color || '',
          eye_color: data.eye_color || '',
          interests: data.interests || [],
          bio: data.bio || '',
          profile_image: data.profile_image || '',
          profile_photos: data.profile_photos || [],
          profile_visible: data.profile_visible
        });
      } else {
        // If no profile exists, create one using upsert
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            profile_visible: true
          }, {
            onConflict: 'id'
          });

        if (upsertError) throw upsertError;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          age: parseInt(profile.age),
          gender: profile.gender,
          city: profile.city,
          country: profile.country,
          height: parseInt(profile.height),
          hair_color: profile.hair_color,
          eye_color: profile.eye_color,
          interests: profile.interests,
          bio: profile.bio,
          profile_visible: profile.profile_visible,
          profile_image: profile.profile_image,
          profile_photos: profile.profile_photos
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      toast.success('Profile updated successfully');
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleImageUploaded = (url: string) => {
    setProfile(prev => ({ ...prev, profile_image: url }));
  };

  const handlePhotosUpdated = (photos: string[]) => {
    setProfile(prev => ({ ...prev, profile_photos: photos }));
  };

  if (!user) return null;

  // Create a user object for the ProfileCard
  const userForCard: User = {
    id: user.id,
    name: profile.name,
    age: parseInt(profile.age) || 0,
    gender: profile.gender as 'male' | 'female',
    location: {
      city: profile.city,
      country: profile.country
    },
    height: parseInt(profile.height) || 0,
    hairColor: profile.hair_color,
    eyeColor: profile.eye_color,
    interests: profile.interests,
    bio: profile.bio,
    profileVisible: profile.profile_visible,
    profileImage: profile.profile_image,
    profilePhotos: profile.profile_photos
  };

  return (
    <div className="flex gap-8">
      {/* Profile Card Column */}
      <div className="w-1/3">
        <ProfileCard
          user={userForCard}
          currentUser={user}
          onLike={() => {}}
          isLikedByUser={false}
        />
      </div>

      {/* Edit Form Column */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 flex items-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Profile</span>
            </button>
          </div>

          <ImageUpload
            userId={user.id}
            currentImage={profile.profile_image}
            profilePhotos={profile.profile_photos}
            onImageUploaded={handleImageUploaded}
            onPhotosUpdated={handlePhotosUpdated}
          />

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="18"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="150"
                  max="220"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hair Color
                </label>
                <select
                  value={profile.hair_color}
                  onChange={(e) => setProfile({ ...profile, hair_color: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select hair color</option>
                  <option value="Black">Black</option>
                  <option value="Brown">Brown</option>
                  <option value="Blonde">Blonde</option>
                  <option value="Red">Red</option>
                  <option value="Grey">Grey</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eye Color
                </label>
                <select
                  value={profile.eye_color}
                  onChange={(e) => setProfile({ ...profile, eye_color: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select eye color</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Brown">Brown</option>
                  <option value="Hazel">Hazel</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {['Sports', 'Music', 'Art', 'Travel', 'Food', 'Movies', 'Tech', 'Photography'].map(
                  (interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        profile.interests.includes(interest)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {interest}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="profile_visible"
                checked={profile.profile_visible}
                onChange={(e) => setProfile({ ...profile, profile_visible: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="profile_visible" className="ml-2 block text-sm text-gray-900">
                Make profile visible to others
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Profile</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    const { error } = await supabase.auth.signOut();
                    if (error) throw error;
                    window.location.href = '/';
                  } catch (error) {
                    console.error('Error:', error);
                    toast.error('Failed to delete profile');
                  } finally {
                    setLoading(false);
                    setShowDeleteConfirm(false);
                  }
                }}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}