export default function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, ""); // Chỉ giữ chữ cái, số, và dấu -
}
