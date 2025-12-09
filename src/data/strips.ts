// Comic strips data
import strip001 from "@/assets/strips/strip-001.png";
import strip002 from "@/assets/strips/strip-002.png";
import strip003 from "@/assets/strips/strip-003.png";
import strip004 from "@/assets/strips/strip-004.png";
import strip005 from "@/assets/strips/strip-005.png";

export interface ComicStrip {
  id: string;
  imageUrl: string;
  date: string;
  title?: string;
}

// Sample data - in production this would come from a backend/CMS
export const comicStrips: ComicStrip[] = [
  {
    id: "001",
    imageUrl: strip001,
    date: "2025-02-01",
    title: "El Nuevo Inquilino"
  },
  {
    id: "002",
    imageUrl: strip002,
    date: "2025-02-02",
    title: "Paquetería Confusa"
  },
  {
    id: "003",
    imageUrl: strip003,
    date: "2025-02-03",
    title: "Hora Punta"
  },
  {
    id: "004",
    imageUrl: strip004,
    date: "2025-02-04",
    title: "La Llave Olvidada"
  },
  {
    id: "005",
    imageUrl: strip005,
    date: "2025-02-05",
    title: "Día de Mudanza"
  },
];

export const getTodayStrip = (): ComicStrip => {
  // In production, this would fetch the latest strip from backend
  return comicStrips[comicStrips.length - 1];
};

export const getStripById = (id: string): ComicStrip | undefined => {
  return comicStrips.find(strip => strip.id === id);
};

export const getStripByIndex = (index: number): ComicStrip | undefined => {
  return comicStrips[index];
};
