# Fabrique les vidéos TikTok « Dessine-moi » : page animée, images, mixage voix + crayon, MP4.
# Les voix doivent déjà exister dans media/tiktok/<id>/NN.mp3 et fin.mp3 (workflow « Voix des vidéos TikTok »).
# Usage : python3 tiktok/fabriquer.py <id> [<id> ...]        → tiktok/sortie/Zenvise-<id>.mp4
#         python3 tiktok/fabriquer.py --apercu <id> ...       → images fixes seulement (durées estimées si pas de voix)
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__)); RACINE = os.path.dirname(D)
R = os.path.join(RACINE, "media", "tiktok")
FIN = "Zenvise. Bientôt sur vos écrans."
apercu = "--apercu" in sys.argv; ids = [a for a in sys.argv[1:] if not a.startswith("--")]
vids = {v["id"]: v for v in json.load(open(os.path.join(R, "videos.json")))}
MODELES = {m: open(os.path.join(D, f"{m}.src.html")).read() for m in ("compta", "finance")}
dur = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())
os.makedirs(os.path.join(D, "sortie"), exist_ok=True); os.makedirs(os.path.join(D, ".travail"), exist_ok=True)
for vid in ids:
    v = vids[vid]
    fs = [f"{R}/{vid}/{i:02d}.mp3" for i in range(len(v["segments"]))]; ffin = f"{R}/{vid}/fin.mp3"
    if not apercu and not all(os.path.exists(f) for f in fs + [ffin]): sys.exit(f"Voix manquantes pour {vid}")
    ds = [dur(f) if os.path.exists(f) else round(len(s.get("dit", s["voix"])) / 14.5, 2) for f, s in zip(fs, v["segments"])]
    ds.append(dur(ffin) if os.path.exists(ffin) else 2.2)
    html = MODELES[v.get("modele", "compta")].replace("{{video}}", json.dumps(v, ensure_ascii=False)).replace("{{durees}}", json.dumps(ds))
    open(os.path.join(D, f"{vid}.gen.html"), "w").write(html)
    subprocess.check_call(["node", os.path.join(D, "rendu.mjs"), vid] + (["stills"] if apercu else []))
    if apercu: continue
    T = os.path.join(D, ".travail")
    t = 0.1; starts = []
    for d in ds[:-1]: starts.append(t); t += d + 0.35
    tfin = t + 0.4; total = tfin + ds[-1] + 1.2
    ins = fs + [ffin]; st = starts + [tfin]
    for i in range(1, len(fs)):  # bruit du crayon pendant l'écriture de chaque phrase (sauf l'accroche)
        L = ds[i] * 0.92; sf = f"{T}/crayon-{vid}-{i}.wav"
        expr = "(random(0)*2-1)*max(0,0.6*sin(2*PI*6.3*t)+0.5*sin(2*PI*9.7*t+1)+0.15)"
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"aevalsrc='{expr}':s=44100:d={L:.2f}",
            "-af", f"highpass=f=4500,lowpass=f=11000,volume=0.08,afade=t=in:d=0.08,afade=t=out:st={max(0, L - 0.15):.2f}:d=0.15", "-ac", "1", sf])
        ins.append(sf); st.append(starts[i])
    args = ["ffmpeg", "-v", "error", "-y"]
    for f in ins: args += ["-i", f]
    nv = len(fs) + 1
    filt = "".join(f"[{i}]adelay={int(s * 1000)}|{int(s * 1000)}[a{i}];" for i, s in enumerate(st))
    filt += "".join(f"[a{i}]" for i in range(nv)) + f"amix=inputs={nv}:normalize=0,volume=1.7,alimiter=limit=0.95[voix];"
    filt += "".join(f"[a{i}]" for i in range(nv, len(ins))) + f"amix=inputs={len(ins) - nv}:normalize=0[crayon];"
    filt += f"[voix][crayon]amix=inputs=2:normalize=0,apad=whole_dur={total:.2f}[a]"
    subprocess.check_call(args + ["-filter_complex", filt, "-map", "[a]", "-t", f"{total:.2f}", "-ar", "44100", f"{T}/{vid}.wav"])
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-framerate", "30", "-i", f"{T}/frames-{vid}/%04d.jpg", "-i", f"{T}/{vid}.wav",
        "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest",
        "-movflags", "+faststart", os.path.join(D, "sortie", f"Zenvise-{vid}.mp4")])
    print("✓", vid, round(total, 1), "s")
