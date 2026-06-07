import slugify from "slugify";
import { stopWords } from "./constant";

export function createSlug(text: string): string {
  const filtered = text
    .toLowerCase()
    .split(" ")
    .filter((word) => !stopWords.includes(word))
    .join(" ");

  return slugify(filtered, { lower: true, strict: true });
}