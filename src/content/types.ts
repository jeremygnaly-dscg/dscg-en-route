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

export interface Episode {
  id: string;
  ue: UeId;
  title: string;
  ref: string; // référence principale, ex. "art. 145 et 216 CGI"
  minutes: number;
  status: "live" | "soon";
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
