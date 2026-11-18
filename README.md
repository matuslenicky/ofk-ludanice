# OFK Ludanice – návrh webu

Návrh nového webu futbalového klubu OFK Ludanice (Obecný futbalový klub Ludanice). **Nie je to oficiálna stránka klubu.** Ukážka má v hlavičke pás s týmto upozornením a vyhľadávače ju neindexujú (`noindex`).

Ukážka: https://matuslenicky.github.io/ofk-ludanice/ · administrácia (ukážka bez ukladania): https://matuslenicky.github.io/ofk-ludanice/admin/

## Vzhľad

**„Záložky tímov“ (dizajn v2, 17. 11. 2026).** Biela, zelená z erbu, modrá len v detailoch. Písmo Familjen Grotesk (nadpisy) a Gelasio (text).

- hlavička s menom v strede a menu na zelenom páse pod ním,
- úvod: titulok „Futbal za štrekou“, najbližší zápas áčka a záložky tímov (áčko, žiaci, prípravky); každá záložka ukáže najbližší zápas, posledné zápasy a výrez tabuľky, bez JavaScriptu sú tímy pod sebou,
- krátko o ihrisku Za štrekou, celá kronika ihriska, správy z Ludanických novín, ročníky a obec sú na stránke Klub,
- menu na telefóne je biela plocha cez celú obrazovku.

Web sa skladá zo spoločného jadra v2 (`kluby-siet/engine`: `python assemble.py <web>`), vlastný je `src/site.js` (úvod, Klub, nastavenia) a `src/css/skin.css`.

## Obsah a zdroje

- Zápasy, výsledky, strelci, karty, počty divákov, zostavy dospelých, tabuľky a súpisky 5 tímov (áčko, U15, U13, U11, U9) zo Sportnetu (Futbalnet), verejné API súťaží (`scripts/sportnet.mjs` → `data/sportnet.json`). Vek hráčov sa neukladá, zostavy len pri dospelých.
- Ročníky áčka 2014/15 – 2025/26 z konečných tabuliek na Sportnete, tituly 2016/17 a 2021/22, kvalifikácia o VI. ligu Severovýchod 8. 8. 2026 (`data/klub.json`).
- História ihriska z webu obce (stránka Obecný futbalový klub): lúky v 20. rokoch, ihrisko za traťou 1946 – 1947 a 50 líp, povodeň 1950, kabíny 1971, zápas s Interom Bratislava k 50. výročiu (1985), nové kabíny a tribúna 1997.
- Správy z klubu z Ludanických novín 2025 a 2026 (príspevky OFK). Obec podľa webu obce (História, Benediktínsky kláštor, Štatút obce – popis erbu).
- Rok založenia 1935 podľa webu obce (50. výročie v roku 1985) a Wikipédie. E-mail zo Sportnetu. Vlastný web ani sociálne siete klubu sme nenašli (17. 11. 2026).
- Erb klubu a erby súperov zo Sportnetu (`scripts/logos.py`). Patria príslušným klubom.
- Písmo Young Serif, Barlow a Barlow Condensed, licencia SIL Open Font License 1.1 (`scripts/fonts.py`, rovné číslice sú zapečené do písma).

## Zostavenie

Statický generátor bez závislostí (Node 20+, Python 3 s Pillow na erby a fontTools na písmo):

```
node scripts/sportnet.mjs        # zápasy, tabuľky a súpisky (FULL=1 stiahne znova aj detaily zápasov)
python -I scripts/logos.py       # erby súperov a náš erb do src/img (FORCE=1 stiahne znova)
node build.js                    # data/ + src/ -> dist/ (TODAY=2026-11-17 prepíše dnešný dátum)
node scripts/serve.mjs dist 5420 # náhľad na http://127.0.0.1:5420/ (?nolr = bez obnovovania, s CSP)
node scripts/deploy.mjs          # nasadenie dist/ na vetvu gh-pages (GitHub Pages)
```

Výsledky sa po zápasoch aktualizujú samé cez GitHub Actions (`.github/workflows/sportnet.yml`). Ročníky v `data/klub.json` treba po sezóne doplniť ručne.
