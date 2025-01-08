import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ProfileCard } from './ProfileCard';
import type { User } from '../types';

interface LikesViewProps {
  user: any;
}

export function LikesView({ user }: LikesViewProps) {
  const [likedProfiles, setLikedProfiles] = useState<User[]>([]);
  const [mutualMatches, setMutualMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLikedProfiles();
    }
  }, [user]);

  const fetchLikedProfiles = async () => {
    try {
      setLoading(true);

      // Fetch profiles you've liked
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('to_user_id')
        .eq('from_user_id', user.id);

      if (likesError) throw likesError;

      // Fetch mutual matches
      const { data: matches, error: matchesError } = await supabase
        .from('likes')
        .select('from_user_id')
        .eq('to_user_id', user.id)
        .in('from_user_id', likes.map(like => like.to_user_id));

      if (matchesError) throw matchesError;

      // Get all profile details
      const likedIds = likes.map(like => like.to_user_id);
      const matchIds = matches.map(match => match.from_user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', likedIds);

      if (profilesError) throw profilesError;

      const transformedProfiles = profiles.map(profile => ({
        id: profile.id,
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        location: {
          city: profile.city,
          country: profile.country,
        },
        height: profile.height,
        hairColor: profile.hair_color,
        eyeColor: profile.eye_color,
        interests: profile.interests || [],
        bio: profile.bio,
        profileVisible: profile.profile_visible,
        profileImage: profile.profile_image,
        profilePhotos: profile.profile_photos || [],
      }));

      setLikedProfiles(transformedProfiles);
      setMutualMatches(transformedProfiles.filter(profile => 
        matchIds.includes(profile.id)
      ));
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading likes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {mutualMatches.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Mutual Matches 🎉</h2>
          <div className="space-y-6">
            {mutualMatches.map(profile => (
              <ProfileCard
                key={profile.id}
                user={profile}
                currentUser={user}
                onLike={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Profiles You've Liked</h2>
        {likedProfiles.length > 0 ? (
          <div className="space-y-6">
            {likedProfiles.map(profile => (
              <ProfileCard
                key={profile.id}
                user={profile}
                currentUser={user}
                onLike={() => {}}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            You haven't liked any profiles yet. Start discovering!
          </p>
        )}
      </div>
    </div>
  );
}