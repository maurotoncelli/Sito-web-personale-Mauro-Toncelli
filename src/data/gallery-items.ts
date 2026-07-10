import type { MediaItem } from "@/data/portfolio";
import type { VideoItem } from "@/data/videos";

/** Elemento della gallery unificata foto+video (blueprint §5). */
export type GalleryItem =
  | ({ kind: "photo" } & MediaItem)
  | ({ kind: "video" } & VideoItem);

export function toGalleryItems(photos: MediaItem[], videos: VideoItem[] = []): GalleryItem[] {
  return [
    ...videos.map((v) => ({ kind: "video" as const, ...v })),
    ...photos.map((p) => ({ kind: "photo" as const, ...p })),
  ];
}
