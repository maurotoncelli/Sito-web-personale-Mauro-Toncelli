/**
 * Video del portfolio (dal sito attuale), compressi per il web.
 * Niente categoria "Video" a parte (blueprint §7): ogni video appartiene
 * alla categoria reale del lavoro e appare nella sua gallery mista.
 */
export type VideoItem = {
  src: string;
  poster: string;
  /** clip breve muta per l'autoplay in griglia */
  preview: string;
  title: string;
  client: string;
  /** true = 9:16 verticale */
  vertical: boolean;
  /** slug della categoria portfolio a cui appartiene */
  categoria: string;
};

export const videos: VideoItem[] = [
  {
    src: "/videos/showreel-45s.mp4",
    preview: "/videos/previews/showreel-45s.mp4",
    poster: "/videos/showreel-45s-poster.jpg",
    title: "Brand video",
    client: "Oniverse",
    vertical: false,
    categoria: "corporate",
  },
  {
    src: "/videos/showreel-16-9.mp4",
    preview: "/videos/previews/showreel-16-9.mp4",
    poster: "/videos/showreel-16-9-poster.jpg",
    title: "Spot 45\"",
    client: "Intimissimi",
    vertical: false,
    categoria: "corporate",
  },
  {
    src: "/videos/oniverse-kickoff.mp4",
    preview: "/videos/previews/oniverse-kickoff.mp4",
    poster: "/videos/oniverse-kickoff-poster.jpg",
    title: "Kickoff meeting",
    client: "Oniverse",
    vertical: false,
    categoria: "eventi",
  },
  {
    src: "/videos/cantina-leggero.mp4",
    preview: "/videos/previews/cantina-leggero.mp4",
    poster: "/videos/cantina-leggero-poster.jpg",
    title: "Social shot",
    client: "Cantina Leggero",
    vertical: false,
    categoria: "architettura-interni",
  },
  {
    src: "/videos/reel-beach.mp4",
    preview: "/videos/previews/reel-beach.mp4",
    poster: "/videos/reel-beach-poster.jpg",
    title: "Beach moments",
    client: "Maitò",
    vertical: true,
    categoria: "architettura-interni",
  },
  {
    src: "/videos/reel-party-prep.mp4",
    preview: "/videos/previews/reel-party-prep.mp4",
    poster: "/videos/reel-party-prep-poster.jpg",
    title: "Party prep",
    client: "Maitò",
    vertical: true,
    categoria: "eventi",
  },
  {
    src: "/videos/reel-party.mp4",
    preview: "/videos/previews/reel-party.mp4",
    poster: "/videos/reel-party-poster.jpg",
    title: "Party recap",
    client: "Maitò",
    vertical: true,
    categoria: "eventi",
  },
];

export function videosForCategory(slug: string) {
  return videos.filter((v) => v.categoria === slug);
}

export function videosForCategories(slugs: string[]) {
  return videos.filter((v) => slugs.includes(v.categoria));
}
