import axios from "axios";
import { IPhoto } from "../models/IPhoto";

const URL = "https://pixabay.com/api/";

export const searchImages = async (
  query: string,
  category: "games" | "characters",
  perPage: number
): Promise<IPhoto[]> => {
  try {
    const apiKey = import.meta.env.VITE_kluczAPI;
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: apiKey,
        q: query + " -screenshot",
        per_page: perPage,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
      },
    });

    return response.data.hits.map((photo) => ({
      ...photo,
      category,
    }));
  } catch (error) {
    console.error("Błąd API:", error);
    throw error;
  }
};
