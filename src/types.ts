export interface Wallpaper {
  id: string;
  title: string;
  category: string;
  isPremium: boolean;
  imageUrl: string;
  createdAt: string;
  views: number;
  downloads: number;
}

export interface Stats {
  downloads: number;
  views: number;
}
