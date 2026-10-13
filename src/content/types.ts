// Format d'un épisode. Pour ajouter un épisode : créer un objet Episode dans
// src/content/episodes.ts. Quand les MP3 ElevenLabs existent, renseigner `audio`
// (fichiers dans /public/audio/) : l'appli les lira à la place de la voix du téléphone.

export type UeId = "ue1" | "ue2" | "ue3" | "ue4" | "ue5";

export type Speaker =
  | "narrateur" // voix off, en italique
  | "dirigeant" // le client dans la scène
  | "expert" // l'expert-comptable dans la scène
  | "cours"; // la voix du cours

export interface Line {
  who: Speaker;
  text: string; // `...` entoure une référence (article, seuil) mise en avant
  key?: boolean; // ligne essentielle à retenir
}

export interface FlashQuestion {
  q: string;
  choices: string[];
  answer: number; // index de la bonne réponse
  why: string;
}

// Trois formats selon la matière :
// - "juridique"  (UE1)          : scène, cours, flash
// - "technique"  (UE2, UE3, UE5): scène, cours, formules à retenir, flash
// - "comptable"  (UE4)          : scène, cours (droit comptable), écritures, flash
export type Format = "juridique" | "technique" | "comptable";

export interface Formule {
  nom: string; // ex. "Coût moyen pondéré du capital"
  formule: string; // ex. "CMPC = kcp × CP/(CP+D) + kd × (1 − t) × D/(CP+D)"
  legende?: string[]; // définition de chaque terme
  piege?: string; // l'erreur classique à éviter
}

export interface LigneEcriture {
  compte: string; // ex. "6815"
  intitule: string; // ex. "Dotations aux provisions d'exploitation"
  debit?: number;
  credit?: number;
}

export interface Ecriture {
  titre: string; // ex. "31/12/N · Constitution de la provision"
  lignes: LigneEcriture[];
  regle?: string; // la règle comptable qui justifie l'écriture
}

export interface Episode {
  id: string;
  ue: UeId;
  format: Format;
  formules?: Formule[];
  ecritures?: Ecriture[];
  title: string;
  ref: string; // référence principale, ex. "art. 145 et 216 CGI"
  minutes: number;
  // live : écrit ET en voix studio (seul état visible et jouable dans l'appli)
  // ecrit : rédigé, en attente de la voix studio · soon : pas encore rédigé
  status: "live" | "ecrit" | "soon";
  source?: string; // d'où vient le cas (sujet officiel, sujet zéro, cours perso)
  reviewedBy?: string; // relecteur — obligatoire avant publication payante
  scene: Line[];
  cours: Line[];
  flash: FlashQuestion[];
  audio?: { scene?: string; cours?: string }; // chemins MP3 dans /public
}

export interface Ue {
  id: UeId;
  short: string;
  name: string;
  available: boolean;
}
