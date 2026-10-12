# Révizen

Appli web installable (PWA) pour réviser le DSCG en audio : une scène d'examen, le cours, trois questions flash.

## Ce qui est en place (V1)

- Accueil : choix de l'UE, liste des épisodes classés par fréquence à l'examen, progression.
- Lecteur : Scène → Cours → Flash, voix Femme/Homme, ton Apaisant/Dynamique, vitesse, ambiance (mer, plage & oiseaux, nappe zen) avec volume séparé.
- Lecture des MP3 « voix studio » quand ils existent, sinon voix du téléphone.
- Titre et commandes sur l'écran verrouillé et le casque (lecture MP3).
- Installable sur l'écran d'accueil, utilisable hors connexion pour les épisodes déjà ouverts.

## Mettre l'appli en ligne (gratuit, ~15 min, depuis un ordinateur)

1. Créer un compte sur github.com, puis un dépôt privé `dscg-en-route`.
2. Envoyer ce dossier dans le dépôt (bouton « uploading an existing file » sur GitHub, ou `git push`).
3. Créer un compte sur vercel.com avec GitHub, cliquer « Add New Project », choisir le dépôt, puis « Deploy ».
4. L'appli est en ligne sur une adresse en `.vercel.app`. Sur iPhone : Safari → Partager → « Sur l'écran d'accueil ».

Chaque modification envoyée sur GitHub remet l'appli à jour automatiquement.

## Ajouter un épisode

Tout le contenu est dans `src/content/episodes.ts`. Un épisode = un objet avec :
`scene` (dialogue), `cours` (lignes du cours), `flash` (3 questions). Entourer une référence de
backticks (`` `art. 145` ``) pour la mettre en avant, `key: true` pour une ligne essentielle.
Passer `status: "live"` pour le publier. Renseigner `reviewedBy` une fois relu.

## Passer à la voix studio (ElevenLabs)

1. Générer deux MP3 par épisode (scène, cours) avec la voix choisie.
2. Les déposer dans `public/audio/`, par ex. `public/audio/regime-mere-fille-scene.mp3`.
3. Dans l'épisode : `audio: { scene: "/audio/regime-mere-fille-scene.mp3", cours: "/audio/regime-mere-fille-cours.mp3" }`.

L'appli lit alors le MP3 au lieu de la voix du téléphone, et la lecture continue écran verrouillé.

## Prochaines étapes

- Page d'attente + collecte d'e-mails.
- Comptes utilisateurs et progression synchronisée (Supabase).
- Abonnements 9,99 € (1 UE) / 19,99 € (toutes les UE) avec Stripe.
- Vrais enregistrements d'ambiance libres de droits dans `public/ambiances/`.

## Développement

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # export statique dans out/
```

## Avertissement contenu

Les épisodes démo sont rédigés à partir du Code général des impôts et doivent être relus par un
enseignant avant toute vente. Ne pas reprendre de corrigés tiers (Compta Online, éditeurs) sans
autorisation écrite.
