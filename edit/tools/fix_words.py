"""Betulkan ralat transkrip Whisper (ikut indeks token dalam words_raw.json) -> public/words.json untuk caption."""
import json
raw = json.load(open("tools/words_raw.json"))
FIX = {16: "Hello", 34: "Rolf", 35: "Dobelli", 48: "informasi", 68: "kongsikan", 70: "", 90: "tu", 94: "Dia", 96: "tu kat",
       114: "pemikiran", 119: "strong", 120: "berbanding", 121: "", 122: "pemikiran", 154: "jalan", 159: "mengecualikan", 160: "dia",
       177: "positif", 183: "cerita", 205: "Justru", 206: "", 230: "akal", 244: "memujuk", 260: "isu tu", 261: "Convince", 277: "dapat",
       299: "convince", 302: "info", 304: "dia", 305: "bagi tu", 306: "info", 321: "cognitive", 327: "senarai", 331: "", 332: "satu-satu",
       356: "hype", 357: "success", 378: "", 379: "Dah", 381: "checklist", 382: "lah", 383: "Last", 387: "", 397: "tenaga.", 398: "",
       407: "ancaman", 412: "perlu", 443: "Bab 1", 444: ""}
out = []
for i, (s, e, t) in enumerate(raw):
    t = FIX.get(i, t)
    if not t: continue
    out.append({"s": s, "e": e, "t": t})
for i in range(len(out) - 1):  # elak hujung perkataan melepasi permulaan seterusnya
    out[i]["e"] = round(min(out[i]["e"], out[i + 1]["s"] + 0.05), 2)
json.dump(out, open("public/words.json", "w"), ensure_ascii=False)
print(len(out), "perkataan")
