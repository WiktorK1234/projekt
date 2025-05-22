export interface IPhoto {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  user: string;
  imageWidth: number;
  imageHeight: number;
  category: "games" | "characters";
}
