# Calendrier TikTok — 5 vidéos par jour à partir du mercredi 28 octobre 2026


**Statut de la bêta : pas encore en ligne** → appel à l'action « Commente BÊTA ». Quand Jérémy annonce la bêta en ligne, remplacer par « en ligne » → « Lien en bio ».
Format : « Dessine-moi » (voix de l'expert-comptable ElevenLabs, tableau dessiné, crayon, fin « Zenvaïze. Bientôt sur vos écrans. »).
- `modele: "compta"` pour une écriture (journal + bilan / compte de résultat).
- `modele: "finance"` pour un calcul, une cascade ou une liste de conditions (droit) ; `tag` personnalisable : « Dessine-moi la finance », « Dessine-moi le droit », « Dessine-moi le DSCG ».
- 45 à 60 secondes, 6 à 8 phrases, accroche contre-intuitive en première phrase, montants en chiffres à l'écran (`voix`) et en lettres pour la voix (`dit`).
- Chaque fait doit correspondre à un épisode de l'appli (même règle, mêmes chiffres de référence) : vérifier dans `src/content/`.

| Jour | 1 · Compta (modèle compta) | 2 · Finance | 3 · Droit DCG | 4 · DSCG | 5 · Fiscal / DSCG |
|---|---|---|---|---|---|
| J1 mer. 28/10 | Charges constatées d'avance (486) | Seuil de rentabilité | Période d'essai : durées | Écart d'acquisition (goodwill) | TVA dans un TTC : diviser par 6 |
| J2 jeu. 29/10 | Facture non parvenue (408) | FRNG, BFR, trésorerie nette | SARL ou SAS : qui décide ? | Régime mère-fille : 5 % et 2 ans | Dépréciation d'une créance client (491) |
| J3 ven. 30/10 | Variation de stock (6037) | CMPC | Rupture conventionnelle | Mise en équivalence | IS des PME : 15 % jusqu'à 42 500 € |
| J4 sam. 31/10 | Cession d'immobilisation (657 / 757, PCG 2025) | Effet de levier | Abus de biens sociaux | Impôts différés | Charges non déductibles |
| J5 dim. 1/11 | La paie (641, 421, 431) | CAF : méthode additive | Heures supplémentaires : 25 % / 50 % | Intégration fiscale : 95 % | IFRS 16 chez le preneur |
| J6 lun. 2/11 | Subvention d'investissement (131 / 139 / 747) | DCF et valeur terminale | Bail commercial : 9 ans | Quand nommer un CAC (5 M€ / 10 M€ / 50) | Seuils micro 2026-2028 |
| J7 mar. 3/11 | Provision pour garantie (1512) | Rachat d'actions et BPA | Licenciement économique | Sauvegarde, redressement, liquidation | Fusion : parité d'échange |
| J8 mer. 4/11 | Effets de commerce et escompte | MEDAF et bêta | Vente du fonds de commerce : 10 jours | Mali technique | Plus-values pro : court et long terme |
| J9 jeu. 5/11 | Intérêts courus (1688) | Duration d'une obligation | Faute grave ou faute lourde | Pacte Dutreil : 75 % | IAS 36 : valeur recouvrable |
| J10 ven. 6/11 | Créance en devises (476 / 1515) | Budget de trésorerie | Conventions réglementées | Marge interne en stock | TVA : exigibilité biens / services |

Après J10 : repartir des épisodes de l'appli non encore utilisés (UE1, UE4, DCG 9, DCG 2/3/4 en priorité), en gardant 1 compta, 1 finance, 1 droit DCG, 2 DSCG par jour.

## Suivi
Noter ici chaque jour les ids produits (`jNN-...`) et les éventuels problèmes.

- 28/10 : lot de 33 vidéos finance / M&A / conso / droit (modèle finance, 27 à 35 s), livré avec les descriptions, à publier 5 par jour jusqu'au 4/11 environ :
  fin-sig-ebitda, fin-van-actualisation, fin-tableau-flux, m-ve-titres, m-dette-nette, m-covenant, m-per, m-lbo-leviers, m-lbo-couverture, m-ifrs16-ebitda, c-goodwill, c-controle-interet, c-mise-equivalence, c-fusion-parite, c-mali-technique, c-impots-differes, m-cmpc, m-medaf, m-dcf, m-levier, m-seuil, m-frng-bfr, m-dps, m-rachat-actions, m-rente, m-duration, d-mere-fille, d-integration, d-concentrations, d-seuils-opa, d-fusion-procedure, d-abs, d-cession-sarl.
  M&A prononcé « M-and-A » (choix de Jérémy). Les sujets du tableau ci-dessus déjà couverts par ce lot ne sont pas à refaire.
- À partir du 5/11 : 5 vidéos par jour via la tâche planifiée.
