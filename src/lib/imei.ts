// IMEI utilities for TraceIMEI-BJ

export function validateLuhn(imei: string): boolean {
  if (!/^\d{15}$/.test(imei)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(imei[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export function formatIMEI(imei: string): string {
  const clean = imei.replace(/\D/g, '').slice(0, 15);
  const parts: string[] = [];
  for (let i = 0; i < clean.length; i += 5) {
    parts.push(clean.slice(i, i + 5));
  }
  return parts.join(' ');
}

export function extractTAC(imei: string): string {
  return imei.replace(/\D/g, '').slice(0, 8);
}

export function sanitizeIMEIInput(input: string): string {
  return input.replace(/[^0-9]/g, '').slice(0, 15);
}

// Mock TAC database
const TAC_DB: Record<string, { marque: string; modele: string }> = {
  '35332509': { marque: 'Samsung', modele: 'Galaxy A14' },
  '86150804': { marque: 'Xiaomi', modele: 'Redmi Note 12' },
  '49015420': { marque: 'Tecno', modele: 'Spark 10 Pro' },
  '35790611': { marque: 'Apple', modele: 'iPhone 13' },
  '35425007': { marque: 'Infinix', modele: 'Hot 30' },
  '86882903': { marque: 'Huawei', modele: 'Y9 Prime' },
  '35161108': { marque: 'Nokia', modele: 'C21 Plus' },
  '49282010': { marque: 'Itel', modele: 'A58' },
};

export function lookupTAC(tac: string): { marque: string; modele: string } | null {
  return TAC_DB[tac] || null;
}

// Mock IMEI verification
export function mockVerifyIMEI(imei: string): import('../types').IMEIVerificationResult | null {
  const clean = imei.replace(/\D/g, '');
  if (clean.length !== 15) return null;

  const luhnValid = validateLuhn(clean);
  const tac = extractTAC(clean);
  const tacInfo = lookupTAC(tac) || { marque: 'Inconnu', modele: 'Inconnu' };

  // Deterministic mock based on IMEI digits
  const seed = parseInt(clean.slice(-4), 10);
  const isVole = seed % 17 === 0;
  const isSuspect = !isVole && seed % 7 === 0;
  const score = isVole ? 0.92 + (seed % 8) / 100 : isSuspect ? 0.55 + (seed % 20) / 100 : 0.05 + (seed % 30) / 100;

  const quartiers = ['Missèbo', 'Dantokpa', 'Cadjehoun', 'Akpakpa', 'Fidjrossè'];

  return {
    imei: clean,
    statut: isVole ? 'vole' : isSuspect ? 'suspect' : 'legitime',
    scoreAnomalie: Math.min(parseFloat(score.toFixed(2)), 1),
    marque: tacInfo.marque,
    modele: tacInfo.modele,
    dateEnregistrement: new Date(2024, seed % 12, (seed % 28) + 1),
    reparationsCount: seed % 5,
    derniereLocalisation: quartiers[seed % quartiers.length],
    tempsReponse: 0.8 + (seed % 20) / 10,
    features: {
      imei_luhn_valid: luhnValid,
      tac_manufacturer_match: seed % 3 !== 0,
      sim_swap_frequency_30d: seed % 6,
      geoloc_dispersion_km: (seed % 400) + 5,
      repair_history_count: seed % 5,
      network_registration_pattern: seed % 4 === 0 ? 'irrégulier' : 'normal',
      imei_age_vs_model_age: (seed % 30) / 10,
      photo_model_mismatch_score: (seed % 10) / 10,
    },
  };
}
