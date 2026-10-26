# Voix de secours, sans crédit ElevenLabs : synthèse locale Piper (modèles libres), voix française masculine.
# Lancé par GitHub Actions (workflow « Voix libre TikTok »). Écrit media/tiktok-libre/<id>/NN.mp3 et fin.mp3.
import json, os, subprocess, sys, wave
from piper.voice import PiperVoice

MODELES = sys.argv[1].split(",")          # ex. fr_FR-tom-medium
VIDEOS = (os.environ.get("VIDEOS") or "all").split(",")
FIN = "Zènvaïze. Bientôt sur vos écrans."
vids = json.load(open("media/tiktok/videos.json"))
for modele in MODELES:
    voix = PiperVoice.load(f"modeles/{modele}.onnx", config_path=f"modeles/{modele}.onnx.json")
    suffixe = "" if len(MODELES) == 1 else f"-{modele}"
    for v in vids:
        if "all" not in VIDEOS and v["id"] not in VIDEOS:
            continue
        d = f"media/tiktok-libre/{v['id']}{suffixe}"
        os.makedirs(d, exist_ok=True)
        textes = [s.get("libre", s.get("dit", s["voix"])) for s in v["segments"]] + [FIN]
        for i, t in enumerate(textes):
            nom = "fin" if i == len(textes) - 1 else f"{i:02d}"
            w = f"{d}/{nom}.wav"
            with wave.open(w, "wb") as f:
                voix.synthesize(t, f, length_scale=0.95, sentence_silence=0.15)
            subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", w, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1", "-b:a", "160k", f"{d}/{nom}.mp3"])
            os.remove(w)
        print("✓", v["id"], modele)
