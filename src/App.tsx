import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { ProfileCard } from './components/ProfileCard';
import { AuthModal } from './components/AuthModal';
import { ProfileEditor } from './components/ProfileEditor';
import { MessagesView } from './components/MessagesView';
import { LikesView } from './components/LikesView';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';
import type { User, SearchFilters as SearchFiltersType } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('discover');
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({
    ageRange: { min: 18, max: 50 },
    gender: [],
    location: '',
    heightRange: { min: 150, max: 200 },
    hairColor: [],
    eyeColor: [],
    interests: [],
  });

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'discover';
    setCurrentPage(hash);

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'discover';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // Base query to get all profiles without visibility filter
        let query = supabase
          .from('profiles')
          .select('*');

        // Apply filters
        if (filters.gender.length > 0) {
          query = query.in('gender', filters.gender);
        }

        if (filters.location) {
          query = query.or(`city.ilike.%${filters.location}%,country.ilike.%${filters.location}%`);
        }

        if (filters.hairColor.length > 0) {
          query = query.in('hair_color', filters.hairColor);
        }

        if (filters.eyeColor.length > 0) {
          query = query.in('eye_color', filters.eyeColor);
        }

        // Execute query
        const { data, error } = await query;

        if (error) {
          console.error('Error fetching profiles:', error);
          return;
        }

        if (!data) {
          setFilteredUsers([]);
          return;
        }

        // Filter results based on age and height ranges
        let filtered = data.filter(profile => {
          if (!profile.age || !profile.height) return false;
          if (profile.id === user?.id) return false;
          if (profile.age < filters.ageRange.min || profile.age > filters.ageRange.max) return false;
          if (profile.height < filters.heightRange.min || profile.height > filters.heightRange.max) return false;
          if (filters.interests.length > 0 && !profile.interests?.some(interest => filters.interests.includes(interest))) return false;
          return true;
        });

        // Transform to User type
        const transformedUsers: User[] = filtered.map(profile => ({
          id: profile.id,
          name: profile.name || '',
          age: profile.age || 0,
          gender: profile.gender as 'male' | 'female',
          location: {
            city: profile.city || '',
            country: profile.country || '',
          },
          height: profile.height || 0,
          hairColor: profile.hair_color || '',
          eyeColor: profile.eye_color || '',
          interests: profile.interests || [],
          bio: profile.bio || '',
          profileVisible: profile.profile_visible,
          profileImage: profile.profile_image || '',
          profilePhotos: profile.profile_photos || [],
        }));

        setFilteredUsers(transformedUsers);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [filters, user]);

  const handleLike = async (userId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('likes')
        .insert({
          from_user_id: user.id,
          to_user_id: userId,
        });

      if (error) throw error;

      // Check for mutual like
      const { data: mutualLike } = await supabase
        .from('likes')
        .select('*')
        .eq('from_user_id', userId)
        .eq('to_user_id', user.id)
        .single();

      if (mutualLike) {
        // Create notifications for both users
        await Promise.all([
          supabase.from('notifications').insert({
            user_id: user.id,
            type: 'match',
            from_user_id: userId,
          }),
          supabase.from('notifications').insert({
            user_id: userId,
            type: 'match',
            from_user_id: user.id,
          }),
        ]);
      } else {
        // Create notification for liked user
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'like',
          from_user_id: user.id,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderContent = () => {
    if (!user && currentPage !== 'discover') {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Please Sign In</h2>
          <p className="text-gray-500 mt-2">You need to be signed in to access this feature.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full"
          >
            Sign In
          </button>
        </div>
      );
    }

    switch(currentPage) {
      case 'discover':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <SearchFilters filters={filters} onFilterChange={setFilters} />
            </div>
            <div className="md:col-span-2">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading profiles...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="space-y-6">
                  {filteredUsers.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      user={profile}
                      currentUser={user}
                      onLike={handleLike}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No matches found with current filters</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'likes':
        return <LikesView user={user} />;
      case 'messages':
        return <MessagesView user={user} />;
      case 'profile':
        return <ProfileEditor user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onOpenAuth={() => setIsAuthModalOpen(true)} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;