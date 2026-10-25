# Transcrit chaque phrase des vidéos TikTok (Whisper) et la compare au texte prévu,
# pour repérer les bégaiements ou mots déformés de la synthèse vocale.
import json, os, re, difflib, glob, traceback, sys

D = "media/tiktok"
FIN = "Zenvaïze. Bientôt sur vos écrans."
vids = json.load(open(f"{D}/videos.json"))
try:
    from faster_whisper import WhisperModel
    model = WhisperModel("medium", device="cpu", compute_type="int8")
except Exception:
    json.dump({"erreur": traceback.format_exc()}, open(f"{D}/verification.json", "w"), ensure_ascii=False, indent=2); sys.exit(0)
norm = lambda s: re.sub(r"[^a-z0-9àâäéèêëîïôöùûüç ]", " ", s.lower()).split()
rapport = []
for v in vids:
    textes = [s["voix"] for s in v["segments"]] + [FIN]
    fichiers = [f"{D}/{v['id']}/{i:02d}.mp3" for i in range(len(v["segments"]))] + [f"{D}/{v['id']}/fin.mp3"]
    for i, (t, f) in enumerate(zip(textes, fichiers)):
        segs, _ = model.transcribe(f, language="fr", beam_size=5, word_timestamps=False)
        entendu = " ".join(s.text.strip() for s in segs)
        a, b = norm(t), norm(entendu)
        ratio = difflib.SequenceMatcher(None, a, b).ratio()
        # mot répété deux fois de suite à l'oral mais pas dans le texte : signe de bégaiement
        rep = [w for k, w in enumerate(b[1:], 1) if w == b[k - 1] and len(w) > 1 and not any(a[j] == a[j - 1] == w for j in range(1, len(a)))]
        rapport.append({"video": v["id"], "phrase": i, "prevu": t, "entendu": entendu, "ressemblance": round(ratio, 3), "repetitions": rep})
        print(f"{v['id']} #{i} {ratio:.2f} {rep} | {entendu}")
json.dump(rapport, open(f"{D}/verification.json", "w"), ensure_ascii=False, indent=2)
