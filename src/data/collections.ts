import { Collection } from '../types/movie';

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-weekend-watchlist',
    slug: 'weekend-watchlist',
    title: 'Weekend Watchlist',
    description: 'Immersive stories, captivating pacing, and crowd-pleasing entertainment designed for unwinding from Friday evening to Sunday night.',
    accentColor: '#7657FF',
    icon: 'Sparkles',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    movieIds: ['cs-01', 'cs-04', 'cs-06', 'cs-16', 'cs-32', 'cs-37', 'cs-43']
  },
  {
    id: 'col-animated-worlds',
    slug: 'animated-worlds',
    title: 'Animated Worlds',
    description: 'Breathtaking visual artistry, emotional resonance, and imaginative universes crafted by premier animation masters across the globe.',
    accentColor: '#FF5DA2',
    icon: 'Palette',
    coverImage: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    movieIds: ['cs-06', 'cs-12', 'cs-19', 'cs-41', 'cs-45']
  },
  {
    id: 'col-scifi-essentials',
    slug: 'scifi-essentials',
    title: 'Sci-Fi Essentials',
    description: 'Thought-provoking futures, mind-bending cosmic concepts, temporal paradoxes, and transcendent technological dilemmas.',
    accentColor: '#49DCC6',
    icon: 'Rocket',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    movieIds: ['cs-01', 'cs-02', 'cs-05', 'cs-15', 'cs-22', 'cs-29', 'cs-36']
  },
  {
    id: 'col-hidden-gems',
    slug: 'hidden-gems',
    title: 'Hidden Gems',
    description: 'Critically celebrated cinematic treasures and festival favorites that deserve far more spotlight in your personal film diary.',
    accentColor: '#FF9F43',
    icon: 'Gem',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    movieIds: ['cs-04', 'cs-08', 'cs-14', 'cs-21', 'cs-27', 'cs-47', 'cs-48']
  },
  {
    id: 'col-mystery-marathon',
    slug: 'mystery-marathon',
    title: 'Mystery Marathon',
    description: 'Layered enigmas, sharp deductions, deceptive suspects, and unforgettable twists that will keep your mind spinning until the final credit roll.',
    accentColor: '#FFE66D',
    icon: 'Search',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    movieIds: ['cs-02', 'cs-03', 'cs-10', 'cs-24', 'cs-31', 'cs-39']
  },
  {
    id: 'col-short-on-time',
    slug: 'short-on-time',
    title: 'Short on Time',
    description: 'High-impact films under 100 minutes. Compact runtimes packed with unforgettable characters, vivid aesthetics, and zero filler.',
    accentColor: '#49DCC6',
    icon: 'Clock',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    movieIds: ['cs-11', 'cs-12', 'cs-13', 'cs-19', 'cs-23', 'cs-25', 'cs-29', 'cs-35', 'cs-40', 'cs-41', 'cs-45']
  }
];
