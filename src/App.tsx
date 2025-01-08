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
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import type { User, SearchFilters as SearchFiltersType } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('discover');
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({
    ageRange: { min: 18, max: 120 },
    gender: [],
    location: '',
    heightRange: { min: 150, max: 200 },
    hairColor: [],
    eyeColor: [],
    interests: [],
  });

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<string[]>([]);
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
    if (user) {
      fetchLikedAndMatchedUsers();
    }
  }, [user]);

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
        let query = supabase
          .from('profiles')
          .select('*')
          .eq('profile_visible', true);

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

        const { data, error } = await query;

        if (error) throw error;

        let filtered = data.filter(profile => {
          if (profile.id === user?.id) return false;
          if (matchedUsers.includes(profile.id)) return false;
          if (profile.age < filters.ageRange.min || profile.age > filters.ageRange.max) return false;
          if (profile.height < filters.heightRange.min || profile.height > filters.heightRange.max) return false;
          if (filters.interests.length > 0 && !filters.interests.some(interest => profile.interests?.includes(interest))) return false;
          return true;
        });

        const transformedUsers: User[] = filtered.map(profile => ({
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

        setFilteredUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [filters, user, matchedUsers]);

  const fetchLikedAndMatchedUsers = async () => {
    if (!user) return;

    try {
      // Fetch users you've liked
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('to_user_id')
        .eq('from_user_id', user.id);

      if (likesError) throw likesError;
      setLikedUsers(likes.map(like => like.to_user_id));

      // Fetch mutual matches
      const { data: matches, error: matchesError } = await supabase
        .from('likes')
        .select('from_user_id')
        .eq('to_user_id', user.id)
        .in('from_user_id', likes.map(like => like.to_user_id));

      if (matchesError) throw matchesError;
      setMatchedUsers(matches.map(match => match.from_user_id));
    } catch (error) {
      console.error('Error fetching likes and matches:', error);
    }
  };

  const triggerMatchAnimation = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleLike = async (userId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      if (likedUsers.includes(userId)) {
        toast.error('You already liked this profile');
        return;
      }

      const { error } = await supabase
        .from('likes')
        .insert({
          from_user_id: user.id,
          to_user_id: userId,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('You already liked this profile');
          return;
        }
        throw error;
      }

      setLikedUsers(prev => [...prev, userId]);

      const { data: mutualLike, error: mutualError } = await supabase
        .from('likes')
        .select('*')
        .eq('from_user_id', userId)
        .eq('to_user_id', user.id)
        .single();

      if (mutualError && mutualError.code !== 'PGRST116') {
        throw mutualError;
      }

      if (mutualLike) {
        triggerMatchAnimation();
        toast.success("It's a match! 🎉", {
          duration: 5000,
          style: {
            background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
            color: 'white',
            fontSize: '1.2em',
            padding: '16px 24px',
          },
          icon: '💝'
        });
        
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

        // Add to matched users and remove from discovery
        setMatchedUsers(prev => [...prev, userId]);
        setFilteredUsers(prev => prev.filter(profile => profile.id !== userId));
      } else {
        toast.success('Profile liked!');
        
        await supabase.from('notifications').insert({
          user_id: userId,
          type: 'like',
          from_user_id: user.id,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to like profile');
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredUsers.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      user={profile}
                      currentUser={user}
                      onLike={handleLike}
                      isLikedByUser={likedUsers.includes(profile.id)}
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