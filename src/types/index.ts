// Types for TraceIMEI-BJ platform

export type UserRole = 'dealer' | 'technicien' | 'enqueteur' | 'admin';
export type IMEIStatut = 'legitime' | 'suspect' | 'vole';
export type Marche = 'Missebo' | 'Dantokpa' | 'Cadjehoun' | 'Autre';
export type TypeActivite = 'revente' | 'reparation' | 'les_deux';
export type SignalementStatut = 'ouvert' | 'en_cours' | 'resolu';

export interface Utilisateur {
  id: string;
  email: string;
  role: UserRole;
  nom: string;
  marche: Marche;
  typeActivite: TypeActivite;
  createdAt: Date;
}

export interface Appareil {
  imei: string;
  marque: string;
  modele: string;
  tac: string;
  dateAllocationTac: Date;
  statut: IMEIStatut;
  scoreAnomalie: number;
}

export interface EnregistrementIMEI {
  id: string;
  imei: string;
  utilisateurId: string;
  dateVerification: Date;
  resultat: IMEIStatut;
  scoreAnomalie: number;
  features: IMEIFeatures;
}

export interface SignalementVol {
  id: string;
  reference: string;
  imei: string;
  marque: string;
  modele: string;
  dateVol: Date;
  quartier: string;
  description?: string;
  photoUrl?: string;
  signalePar: string;
  statut: SignalementStatut;
}

export interface HistoriqueReparation {
  id: string;
  imei: string;
  technicienId: string;
  dateReparation: Date;
  typeReparation: string;
  notes?: string;
}

export interface IMEIFeatures {
  imei_luhn_valid: boolean;
  tac_manufacturer_match: boolean;
  sim_swap_frequency_30d: number;
  geoloc_dispersion_km: number;
  repair_history_count: number;
  network_registration_pattern: string;
  imei_age_vs_model_age: number;
  photo_model_mismatch_score: number;
}

export interface IMEIVerificationResult {
  imei: string;
  statut: IMEIStatut;
  scoreAnomalie: number;
  marque: string;
  modele: string;
  dateEnregistrement: Date;
  reparationsCount: number;
  derniereLocalisation: string;
  tempsReponse: number;
  features: IMEIFeatures;
}
