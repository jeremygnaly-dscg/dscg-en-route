# Transcrit chaque phrase des vidéos TikTok (Whisper) et la compare au texte prévu,
# pour repérer les bégaiements ou mots déformés de la synthèse vocale.
import json, re, difflib, traceback

D = "media/tiktok"
FIN = "Zenvaïze. Bientôt sur vos écrans."
norm = lambda s: re.sub(r"[^a-z0-9àâäéèêëîïôöùûüç ]", " ", s.lower()).split()
rapport = []
try:
    from faster_whisper import WhisperModel
    model = WhisperModel("medium", device="cpu", compute_type="int8")
    vids = json.load(open(f"{D}/videos.json"))
    for v in vids:
        textes = [s["voix"] for s in v["segments"]] + [FIN]
        fichiers = [f"{D}/{v['id']}/{i:02d}.mp3" for i in range(len(v["segments"]))] + [f"{D}/{v['id']}/fin.mp3"]
        for i, (t, f) in enumerate(zip(textes, fichiers)):
            segs, _ = model.transcribe(f, language="fr", beam_size=5)
            entendu = " ".join(s.text.strip() for s in segs)
            a, b = norm(t), norm(entendu)
            ratio = difflib.SequenceMatcher(None, a, b).ratio()
            rep = [w for k, w in enumerate(b[1:], 1) if w == b[k - 1] and len(w) > 1]
            rapport.append({"video": v["id"], "phrase": i, "prevu": t, "entendu": entendu, "ressemblance": round(ratio, 3), "repetitions": rep})
            print(f"{v['id']} #{i} {ratio:.2f} {rep} | {entendu}", flush=True)
except Exception:
    rapport.append({"erreur": traceback.format_exc()})
json.dump(rapport, open(f"{D}/verification.json", "w"), ensure_ascii=False, indent=2)
