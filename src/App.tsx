import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { ProfileCard } from './components/ProfileCard';
import type { User, SearchFilters as SearchFiltersType } from './types';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    gender: 'female',
    location: { city: 'New York', country: 'USA' },
    height: 168,
    hairColor: 'Brown',
    eyeColor: 'Blue',
    interests: ['Travel', 'Photography', 'Yoga'],
    bio: 'Adventure seeker and coffee enthusiast. Looking for someone to explore the world with.',
    profileVisible: true,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 32,
    gender: 'male',
    location: { city: 'San Francisco', country: 'USA' },
    height: 180,
    hairColor: 'Black',
    eyeColor: 'Brown',
    interests: ['Tech', 'Hiking', 'Cooking'],
    bio: 'Software engineer by day, amateur chef by night. Looking for someone to share meals and adventures with.',
    profileVisible: true,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState('discover');
  const [filters, setFilters] = useState<SearchFiltersType>({
    ageRange: { min: 18, max: 50 },
    gender: [],
    location: '',
    heightRange: { min: 150, max: 200 },
    hairColor: [],
    eyeColor: [],
    interests: [],
  });

  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS);

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'discover';
    setCurrentPage(hash);
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || 'discover';
      setCurrentPage(hash);
    });
  }, []);

  useEffect(() => {
    const filtered = MOCK_USERS.filter(user => {
      // Age filter
      if (user.age < filters.ageRange.min || user.age > filters.ageRange.max) return false;
      
      // Gender filter
      if (filters.gender.length > 0 && !filters.gender.includes(user.gender)) return false;
      
      // Location filter
      if (filters.location && !user.location.city.toLowerCase().includes(filters.location.toLowerCase()) && 
          !user.location.country.toLowerCase().includes(filters.location.toLowerCase())) return false;
      
      // Height filter
      if (user.height < filters.heightRange.min || user.height > filters.heightRange.max) return false;
      
      // Hair color filter
      if (filters.hairColor.length > 0 && !filters.hairColor.includes(user.hairColor)) return false;
      
      // Eye color filter
      if (filters.eyeColor.length > 0 && !filters.eyeColor.includes(user.eyeColor)) return false;
      
      // Interests filter
      if (filters.interests.length > 0 && !filters.interests.some(interest => user.interests.includes(interest))) return false;
      
      return true;
    });
    setFilteredUsers(filtered);
  }, [filters]);

  const handleLike = (userId: string) => {
    console.log('Liked user:', userId);
    // Implement like functionality
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'discover':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <SearchFilters filters={filters} onFilterChange={setFilters} />
            </div>
            <div className="md:col-span-2 space-y-6">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <ProfileCard key={user.id} user={user} onLike={handleLike} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No matches found with current filters</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'matches':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">Your Matches</h2>
            <p className="text-gray-500 mt-2">Coming soon!</p>
          </div>
        );
      case 'messages':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">Messages</h2>
            <p className="text-gray-500 mt-2">Coming soon!</p>
          </div>
        );
      case 'profile':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">Your Profile</h2>
            <p className="text-gray-500 mt-2">Coming soon!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;