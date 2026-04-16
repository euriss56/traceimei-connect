
## Plan: Connecter la carte aux signalements réels

Remplacer les données mockées de `MapPage.tsx` par une requête Supabase live sur la table `signalements_vol`.

### Approche

1. **Fetch des signalements** via `supabase.from('signalements_vol').select(...)` au montage + filtre période (7/30/90j) côté requête (`gte('date_vol', ...)`)
2. **Géocodage par quartier** : la table stocke `quartier` (texte), pas de lat/lng. Créer une map statique `QUARTIER_COORDS` côté frontend pour les 5 quartiers connus (Missèbo, Dantokpa, Cadjehoun, Akpakpa, Fidjrossè) + fallback Cotonou centre pour "Autre"
3. **Mapping statut → couleur pin** :
   - `statut = 'ouvert'` → 🔴 rouge (vol signalé)
   - `statut = 'en_cours'` → 🟠 orange (suspect/enquête)
   - `statut = 'resolu'` → 🟢 vert (récupéré)
4. **Agrégation** : grouper les signalements par `quartier` + `statut`, compter, afficher un `CircleMarker` par groupe avec `radius` proportionnel au count
5. **Popup enrichie** : afficher quartier, type, nombre + liste des références (BJ-2026-XXXXX) des derniers signalements
6. **États UI** :
   - Loading skeleton pendant le fetch
   - Empty state si aucun signalement sur la période
   - Toast erreur si la requête échoue
7. **Résumé par quartier** : recalculer dynamiquement depuis les vraies données
8. **Realtime (optionnel léger)** : s'abonner aux INSERT sur `signalements_vol` pour rafraîchir la carte automatiquement

### Fichiers touchés

- `src/pages/MapPage.tsx` — refonte data layer (state, useEffect, fetch, agrégation)
- `src/lib/quartiers.ts` *(nouveau)* — constantes coordonnées + helper de mapping

### Notes techniques

- RLS déjà OK : "Authenticated users can view signalements" autorise le SELECT
- Pas de migration DB nécessaire
- Utilisateur doit être authentifié pour voir les données (la page est dans `/dashboard/enqueteur` zone protégée)
