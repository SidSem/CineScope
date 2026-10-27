/**
 * Safe URL validation and YouTube trailer embed URL generator.
 * CineScope strictly allows known video platforms (YouTube / Vimeo) for embeds.
 */

export function isValidHttpUrl(urlString?: string): boolean {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getSafeTrailerEmbedUrl(rawUrl?: string): string | null {
  if (!rawUrl || !isValidHttpUrl(rawUrl)) return null;

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();

    // YouTube URLs (youtube.com, m.youtube.com, youtu.be)
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      let videoId: string | null = null;
      if (host.includes('youtu.be')) {
        videoId = url.pathname.slice(1).split('&')[0];
      } else if (url.pathname.includes('/embed/')) {
        videoId = url.pathname.split('/embed/')[1]?.split('?')[0];
      } else {
        videoId = url.searchParams.get('v');
      }

      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
    }

    // Vimeo URLs
    if (host.includes('vimeo.com')) {
      const match = url.pathname.match(/\/(\d+)/);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    }
  } catch (err) {
    console.warn('[CineScope] Error parsing trailer URL:', err);
  }

  return null;
}
