import React from 'react';
import { Search } from 'lucide-react';
import type { SearchFilters } from '../types';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const handleAgeChange = (type: 'min' | 'max', value: string) => {
    const num = parseInt(value) || 18;
    const newValue = Math.max(18, Math.min(100, num));
    
    const newRange = type === 'min' 
      ? { min: newValue, max: Math.max(filters.ageRange.max, newValue) }
      : { min: Math.min(filters.ageRange.min, newValue), max: newValue };

    onFilterChange({
      ...filters,
      ageRange: newRange,
    });
  };

  const handleHeightChange = (type: 'min' | 'max', value: string) => {
    const num = parseInt(value) || 150;
    const newValue = Math.max(150, Math.min(220, num));
    
    const newRange = type === 'min'
      ? { min: newValue, max: Math.max(filters.heightRange.max, newValue) }
      : { min: Math.min(filters.heightRange.min, newValue), max: newValue };

    onFilterChange({
      ...filters,
      heightRange: newRange,
    });
  };

  const toggleGender = (gender: string) => {
    const newGenders = filters.gender.includes(gender)
      ? filters.gender.filter(g => g !== gender)
      : [...filters.gender, gender];
    onFilterChange({ ...filters, gender: newGenders });
  };

  const toggleHairColor = (color: string) => {
    const newColors = filters.hairColor.includes(color)
      ? filters.hairColor.filter(c => c !== color)
      : [...filters.hairColor, color];
    onFilterChange({ ...filters, hairColor: newColors });
  };

  const toggleEyeColor = (color: string) => {
    const newColors = filters.eyeColor.includes(color)
      ? filters.eyeColor.filter(c => c !== color)
      : [...filters.eyeColor, color];
    onFilterChange({ ...filters, eyeColor: newColors });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age Range
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={filters.ageRange.min}
              onChange={(e) => handleAgeChange('min', e.target.value)}
              className="w-20 px-3 py-2 border rounded-md"
              min="18"
              max="100"
            />
            <span>to</span>
            <input
              type="number"
              value={filters.ageRange.max}
              onChange={(e) => handleAgeChange('max', e.target.value)}
              className="w-20 px-3 py-2 border rounded-md"
              min="18"
              max="100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <div className="flex flex-wrap gap-2">
            {['male', 'female'].map((gender) => (
              <button
                key={gender}
                onClick={() => toggleGender(gender)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  filters.gender.includes(gender)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height Range (cm)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={filters.heightRange.min}
              onChange={(e) => handleHeightChange('min', e.target.value)}
              className="w-20 px-3 py-2 border rounded-md"
              min="150"
              max="220"
            />
            <span>to</span>
            <input
              type="number"
              value={filters.heightRange.max}
              onChange={(e) => handleHeightChange('max', e.target.value)}
              className="w-20 px-3 py-2 border rounded-md"
              min="150"
              max="220"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hair Color
          </label>
          <div className="flex flex-wrap gap-2">
            {['Black', 'Brown', 'Blonde', 'Red', 'Grey'].map((color) => (
              <button
                key={color}
                onClick={() => toggleHairColor(color)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.hairColor.includes(color)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eye Color
          </label>
          <div className="flex flex-wrap gap-2">
            {['Blue', 'Green', 'Brown', 'Hazel'].map((color) => (
              <button
                key={color}
                onClick={() => toggleEyeColor(color)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.eyeColor.includes(color)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) =>
              onFilterChange({ ...filters, location: e.target.value })
            }
            placeholder="City or Country"
            className="w-full px-3 py-2 border rounded-md"
          />
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
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      interests: filters.interests.includes(interest)
                        ? filters.interests.filter((i) => i !== interest)
                        : [...filters.interests, interest],
                    })
                  }
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.interests.includes(interest)
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
      </div>
    </div>
  );
}