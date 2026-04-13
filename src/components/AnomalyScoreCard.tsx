import type { IMEIFeatures } from "@/types";
import ScoreBar from "./ScoreBar";

interface AnomalyScoreCardProps {
  score: number;
  features: IMEIFeatures;
}

const featureConfig: { key: keyof IMEIFeatures; label: string; icon: string; format: (v: any) => { text: string; ok: boolean } }[] = [
  { key: 'imei_luhn_valid', label: 'Numéro IMEI valide', icon: '✓', format: (v) => ({ text: v ? 'Valide' : 'Invalide', ok: v }) },
  { key: 'tac_manufacturer_match', label: 'Marque cohérente', icon: '🏭', format: (v) => ({ text: v ? 'Cohérent' : 'Incohérent', ok: v }) },
  { key: 'sim_swap_frequency_30d', label: 'Changements de SIM (30j)', icon: '📶', format: (v) => ({ text: `${v} changement(s)`, ok: v < 3 }) },
  { key: 'geoloc_dispersion_km', label: 'Zone géographique stable', icon: '📍', format: (v) => ({ text: `${v} km`, ok: v < 100 }) },
  { key: 'repair_history_count', label: 'Historique réparations', icon: '🔧', format: (v) => ({ text: `${v} entrée(s)`, ok: true }) },
  { key: 'network_registration_pattern', label: 'Opérateur réseau cohérent', icon: '📡', format: (v) => ({ text: v === 'normal' ? 'Normal' : 'Irrégulier', ok: v === 'normal' }) },
  { key: 'imei_age_vs_model_age', label: 'Cohérence âge modèle', icon: '📅', format: (v) => ({ text: `${v.toFixed(1)} ans d'écart`, ok: v < 2 }) },
  { key: 'photo_model_mismatch_score', label: 'Photo appareil conforme', icon: '📷', format: (v) => ({ text: `Score: ${v.toFixed(1)}`, ok: v < 0.5 }) },
];

export default function AnomalyScoreCard({ score, features }: AnomalyScoreCardProps) {
  return (
    <div className="space-y-4">
      <ScoreBar score={score} />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Facteurs détectés :</p>
        <div className="space-y-1.5">
          {featureConfig.map(({ key, label, icon, format }) => {
            const { text, ok } = format(features[key]);
            return (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="w-5 text-center">{icon}</span>
                <span className={ok ? "text-success" : "text-warning"}>
                  {ok ? "✓" : "⚠"}
                </span>
                <span className="text-muted-foreground">{label}</span>
                <span className="ml-auto font-mono text-xs text-foreground">{text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
