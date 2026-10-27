import { Movie } from '../types/movie';

export function getRelatedMovies(currentMovie: Movie, allMovies: Movie[], limit = 6): Movie[] {
  if (!currentMovie || !allMovies || allMovies.length === 0) return [];

  const otherMovies = allMovies.filter(m => m.id !== currentMovie.id);

  const scored = otherMovies.map(movie => {
    let score = 0;

    // Genre overlap (+3 for each shared genre)
    movie.genres.forEach(g => {
      if (currentMovie.genres.includes(g)) {
        score += 3;
      }
    });

    // Tag overlap (+2 for each shared tag)
    movie.tags.forEach(t => {
      if (currentMovie.tags.includes(t)) {
        score += 2;
      }
    });

    // Same director bonus (+5)
    if (currentMovie.director && movie.director && currentMovie.director === movie.director) {
      score += 5;
    }

    // Proximity in rating (+1)
    if (currentMovie.rating && movie.rating) {
      const diff = Math.abs(currentMovie.rating - movie.rating);
      if (diff <= 0.5) score += 1;
    }

    return { movie, score };
  });

  scored.sort((a, b) => b.score - a.score || (b.movie.rating || 0) - (a.movie.rating || 0));

  return scored.slice(0, limit).map(item => item.movie);
}
