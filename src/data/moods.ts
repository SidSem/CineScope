import { Mood } from '../types/movie';

export const MOODS: Mood[] = [
  {
    id: 'feel-good',
    name: 'Feel-Good',
    description: 'Uplifting stories, laughter, optimism, and warm resolutions.',
    icon: 'Sun',
    accentColor: '#FFE66D',
    matchingTags: ['uplifting', 'wholesome', 'comedy', 'friendship', 'feel-good', 'triumph', 'inspiring'],
    matchingGenres: ['Comedy', 'Animation', 'Adventure']
  },
  {
    id: 'mind-bending',
    name: 'Mind-Bending',
    description: 'Puzzles, psychological depth, timeline shifts, and cosmic questions.',
    icon: 'Brain',
    accentColor: '#7657FF',
    matchingTags: ['mind-bending', 'time-travel', 'existential', 'philosophical', 'twist', 'reality-warping', 'complex'],
    matchingGenres: ['Science Fiction', 'Mystery', 'Thriller']
  },
  {
    id: 'adrenaline-rush',
    name: 'Adrenaline Rush',
    description: 'High-octane stuntwork, relentless momentum, and thrilling climaxes.',
    icon: 'Flame',
    accentColor: '#FF5DA2',
    matchingTags: ['action-packed', 'adrenaline', 'martial-arts', 'high-stakes', 'chase', 'combat', 'intense'],
    matchingGenres: ['Action', 'Thriller', 'Crime']
  },
  {
    id: 'cozy-night',
    name: 'Cozy Night',
    description: 'Gentle pacing, evocative atmospheres, warm aesthetics, and quiet depth.',
    icon: 'Coffee',
    accentColor: '#FF9F43',
    matchingTags: ['cozy', 'gentle', 'atmospheric', 'whimsical', 'comfort', 'slice-of-life', 'food'],
    matchingGenres: ['Animation', 'Comedy', 'Drama', 'Romance']
  },
  {
    id: 'tearjerker',
    name: 'Tearjerker',
    description: 'Deep emotional catharsis, poignant goodbyes, and heartbreaking resilience.',
    icon: 'CloudRain',
    accentColor: '#49DCC6',
    matchingTags: ['emotional', 'bittersweet', 'tearjerker', 'grief', 'tragedy', 'poignant', 'love'],
    matchingGenres: ['Drama', 'Romance']
  },
  {
    id: 'family-night',
    name: 'Family Night',
    description: 'Entertaining adventures that captivate both children and adults.',
    icon: 'Users',
    accentColor: '#49DCC6',
    matchingTags: ['family-friendly', 'wonder', 'all-ages', 'heroic', 'magical', 'teamwork'],
    matchingGenres: ['Animation', 'Adventure', 'Fantasy']
  },
  {
    id: 'date-night',
    name: 'Date Night',
    description: 'Electric banter, magnetic romance, chic mystery, and captivating style.',
    icon: 'Heart',
    accentColor: '#FF5DA2',
    matchingTags: ['chemistry', 'romantic', 'charming', 'witty', 'date-night', 'seductive', 'stylish'],
    matchingGenres: ['Romance', 'Comedy', 'Mystery']
  },
  {
    id: 'spooky-season',
    name: 'Spooky Season',
    description: 'Eerie shadows, supernatural encounters, gothic thrills, and suspense.',
    icon: 'Moon',
    accentColor: '#9278FF',
    matchingTags: ['supernatural', 'creepy', 'gothic', 'haunting', 'halloween', 'monsters', 'suspense'],
    matchingGenres: ['Horror', 'Mystery', 'Fantasy']
  }
];
