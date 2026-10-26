# Vidéos TikTok « Dessine-moi » : procédure quotidienne (5 vidéos)

1. Lire `media/tiktok/calendrier.md` et prendre la ligne du jour.
2. Écrire les 5 vidéos dans `media/tiktok/videos.json` (ids `jNN-sujet`), sur le modèle des vidéos existantes :
   - compta : `segments[].ligne = {compte, intitule, debit|credit}`, `nouvelle: true` pour démarrer une nouvelle écriture ;
   - finance / droit : `modele: "finance"`, `tag`, `segments[].rangs = [{op, lib, val, style: fort|ok}]`, `efface: true`, `titre` ;
   - `voix` = texte affiché (chiffres), `dit` = texte prononcé (nombres en lettres, sigles épelés, « Zenvaïze ») ;
   - vérifier chaque règle et chaque chiffre dans `src/content/` (les épisodes de l'appli font foi).
3. Aperçu sans voix : `python3 tiktok/fabriquer.py --apercu <ids>` puis regarder les images dans `tiktok/.travail/frames-<id>/` (rien ne doit déborder du tableau ni passer sous la bulle).
4. Pousser sur main, puis lancer le workflow « Voix des vidéos TikTok » (`voix-tiktok.yml`, input `videos` = les 5 ids). Attendre la fin ; en cas de `quota_exceeded`, s'arrêter et prévenir Jérémy.
5. `git pull`, puis `python3 tiktok/fabriquer.py <ids>` → `tiktok/sortie/Zenvise-<id>.mp4`.
6. Envoyer les 5 MP4 à Jérémy avec, pour chacune, une description TikTok prête à coller (accroche, règle en une ligne, appel à l'action, 5-6 hashtags) et l'ordre de publication conseillé.
7. Noter les ids produits dans la section « Suivi » de `media/tiktok/calendrier.md`, committer.

Coût : environ 750 caractères par vidéo, soit ≈ 3 750 crédits ElevenLabs par jour (les phrases déjà générées sont récupérées gratuitement depuis l'historique).
