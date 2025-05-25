export interface IPhoto {
  id: number;
  url: string;
  user: string;
  imageWidth: number;
  imageHeight: number;
  category: "games" | "characters";
}
