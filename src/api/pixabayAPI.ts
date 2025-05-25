import axios from "axios";
import { IPhoto } from "../models/IPhoto";

const kluczAPI = import.meta.env.VITE_kluczAPI;
const baseURL = "https://pixabay.com/api/";

export const searchImages = async (
  query: string,
  category: "games" | "characters",
  perPage: number
): Promise<IPhoto[]> => {
  try {
    const params: any = {
      key: kluczAPI,
      per_page: Math.min(perPage, 100),
      image_type: "photo",
      safesearch: true,
      order: "popular",
      page: 1,
    };

    if (category === "characters") {
      params.q = "game character OR RPG OR fantasy -chess -toy -doll -board";
      params.category = null;
      params.editors_choice = false;
    } else {
      params.q = query;
    }

    const response = await axios.get(baseURL, { params });

    return response.data.hits
      .map((photo: any) => {
        const rawUrl = photo.webformatURL || photo.largeImageURL || "";
        const tags = photo.tags?.toLowerCase() || "";

        return {
          id: photo.id,
          url: rawUrl.replace(/^http:/, "https:").trim(),
          user: photo.user,
          imageWidth: photo.webformatWidth,
          imageHeight: photo.webformatHeight,
          category: tags.includes("character") ? "characters" : category,
        };
      })
      .filter((photo): photo is IPhoto => !!photo.url);
  } catch (error) {
    console.error("Błąd API:", error);
    return [];
  }
};
