export interface GenreInfo {
  name: string;
  slug: string;
  description: string;
  gradient: string;
  iconName: string;
}

export const GENRES: GenreInfo[] = [
  {
    name: 'Action',
    slug: 'action',
    description: 'High stakes, explosive sequences, and relentless pacing.',
    gradient: 'from-brand-violet to-brand-pink',
    iconName: 'Zap'
  },
  {
    name: 'Adventure',
    slug: 'adventure',
    description: 'Epic journeys, bold explorations, and grand discoveries.',
    gradient: 'from-brand-tangerine to-brand-sunshine',
    iconName: 'Compass'
  },
  {
    name: 'Animation',
    slug: 'animation',
    description: 'Boundless imagination brought to life frame by frame.',
    gradient: 'from-brand-aqua to-brand-violet',
    iconName: 'Sparkles'
  },
  {
    name: 'Comedy',
    slug: 'comedy',
    description: 'Sharp wit, heartwarming humor, and laugh-out-loud antics.',
    gradient: 'from-brand-sunshine to-brand-tangerine',
    iconName: 'Smile'
  },
  {
    name: 'Crime',
    slug: 'crime',
    description: 'Underworld operations, heist plots, and gritty investigations.',
    gradient: 'from-brand-pink to-brand-violet',
    iconName: 'ShieldAlert'
  },
  {
    name: 'Documentary',
    slug: 'documentary',
    description: 'Real stories, historical insights, and eye-opening realities.',
    gradient: 'from-brand-aqua to-brand-sunshine',
    iconName: 'Video'
  },
  {
    name: 'Drama',
    slug: 'drama',
    description: 'Deep emotional resonance, human struggles, and moral complexity.',
    gradient: 'from-brand-violet to-purple-900',
    iconName: 'HeartHandshake'
  },
  {
    name: 'Fantasy',
    slug: 'fantasy',
    description: 'Magical realms, mythical beasts, and supernatural lore.',
    gradient: 'from-brand-aqua to-brand-violet',
    iconName: 'Wand2'
  },
  {
    name: 'Horror',
    slug: 'horror',
    description: 'Spine-chilling dread, uncanny monsters, and visceral tension.',
    gradient: 'from-red-600 to-brand-pink',
    iconName: 'Ghost'
  },
  {
    name: 'Mystery',
    slug: 'mystery',
    description: 'Puzzling enigmas, clever twists, and deductive thrillers.',
    gradient: 'from-indigo-600 to-brand-aqua',
    iconName: 'Search'
  },
  {
    name: 'Romance',
    slug: 'romance',
    description: 'Intense chemistry, romantic yearning, and tender journeys.',
    gradient: 'from-brand-pink to-rose-400',
    iconName: 'Heart'
  },
  {
    name: 'Science Fiction',
    slug: 'science-fiction',
    description: 'Futuristic visions, cosmic odysseys, and existential technology.',
    gradient: 'from-brand-violet to-brand-aqua',
    iconName: 'Rocket'
  },
  {
    name: 'Thriller',
    slug: 'thriller',
    description: 'Edge-of-your-seat suspense, psychological mind-games, and tension.',
    gradient: 'from-brand-tangerine to-red-500',
    iconName: 'Flame'
  }
];

export const GENRE_NAMES = GENRES.map(g => g.name);
