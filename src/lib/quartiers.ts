// Coordonnées des quartiers de Cotonou (Bénin)
// Utilisé pour géocoder les signalements stockés sous forme de texte
export const QUARTIER_COORDS: Record<string, { lat: number; lng: number }> = {
  "Missèbo": { lat: 6.3654, lng: 2.4183 },
  "Missebo": { lat: 6.3654, lng: 2.4183 },
  "Dantokpa": { lat: 6.3616, lng: 2.4260 },
  "Cadjehoun": { lat: 6.3600, lng: 2.3900 },
  "Akpakpa": { lat: 6.3680, lng: 2.4400 },
  "Fidjrossè": { lat: 6.3450, lng: 2.3700 },
  "Fidjrosse": { lat: 6.3450, lng: 2.3700 },
};

// Centre de Cotonou (fallback)
export const COTONOU_CENTER = { lat: 6.3654, lng: 2.4183 };

export function getQuartierCoords(quartier: string): { lat: number; lng: number } {
  return QUARTIER_COORDS[quartier] ?? COTONOU_CENTER;
}

// Mapping statut signalement → type d'affichage carte
export type IncidentType = "vole" | "suspect" | "legitime";

export function statutToType(statut: "ouvert" | "en_cours" | "resolu"): IncidentType {
  if (statut === "ouvert") return "vole";
  if (statut === "en_cours") return "suspect";
  return "legitime";
}
