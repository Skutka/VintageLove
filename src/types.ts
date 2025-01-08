export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: {
    city: string;
    country: string;
  };
  height: number;
  hairColor: string;
  eyeColor: string;
  interests: string[];
  bio: string;
  profileVisible: boolean;
  profileImage: string;
}

export interface SearchFilters {
  ageRange: {
    min: number;
    max: number;
  };
  gender: string[];
  location: string;
  heightRange: {
    min: number;
    max: number;
  };
  hairColor: string[];
  eyeColor: string[];
  interests: string[];
}