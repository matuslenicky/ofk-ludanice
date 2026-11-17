// Statický generátor webu OFK Ludanice: data/ + src/ -> dist/   (node build.js; TODAY=2026-11-17 prepíše dnešný dátum)
// Zostavuje ho kluby-siet/engine/assemble.py zo spoločného jadra v2 a tohto súboru (vzhľad, úvod, stránka Klub).
// Kostra „Záložky tímov“: hlavička s menom v strede a menu pod ním, úvod s najbližším zápasom áčka a záložkami
// tímov (áčko, žiaci, prípravky) – každá záložka ukáže najbližší zápas, posledné výsledky a výrez tabuľky tímu.
// Pod tým krátko o ihrisku Za štrekou. Biela, zelená z erbu, modrá len v detailoch. Písmo Space Grotesk a Gelasio.
const SKIN = {
  nav: 'mast', theme: '#235a28', brand: 'OFK Ludanice', brandSub: `od roku ${club.zalozenie}`,
  fonts: ['space-grotesk-700.woff', 'gelasio-400.woff', 'gelasio-600.woff'],
  sources: 'História ihriska podľa webu obce, správy z klubu podľa Ludanických novín.',
  adminHero: 'Futbal v Ludaniciach od roku 1935',
  adminFacts: club.stadion.kronika,
  links: [[club.obecFutbal, 'Futbal na webe obce'], [club.noviny, 'Ludanické noviny']],
};
const NAV = [['zapasy/', 'Zápasy'], ['tabulky/', 'Tabuľky'], ['timy/', 'Tímy'], ['klub/', 'Klub'], ['kontakt/', 'Kontakt']];
const DESC = `${club.nazov} – futbal v Ludaniciach od roku ${club.zalozenie}. Zápasy, výsledky, tabuľky a súpisky áčka (${A.leagueName}) a mládeže, ihrisko Za štrekou.`;

function teamPanel(t, R) {
  const list = teamMatches(t.slug);
  const nx = list.find((m) => !m.past);
  const rs = list.filter((m) => m.past).reverse().slice(0, 3);
  return `<section class="tp" role="tabpanel" id="p-${t.slug}" aria-labelledby="t-${t.slug}">
  <h3 class="tp-h">${esc(t.full)} <span>${esc(t.leagueName)}${t.pos ? ` · ${t.pos}. miesto ${zo(t.of)}` : ''}</span></h3>
  <div class="tp-grid">
    <div>${nx ? `<p class="tp-k">Najbližší zápas</p><p class="tp-o">${nx.home ? 'doma' : 'vonku'}: <b>${esc(nx.opponent)}</b></p><p class="tp-d"><time datetime="${nx.date}">${dLong(nx.date)}</time>, ${esc(nx.time || '')}</p>` : '<p class="tp-k">Ďalší zápas zatiaľ nie je vyžrebovaný.</p>'}
      ${rs.length ? `<p class="tp-k tp-k--gap">Posledné zápasy</p>${fxList(rs, R, { showTeam: false })}` : ''}</div>
    <div>${t.table ? tableHtml(t.table, R, { compact: true, caption: `<span class="sr">Výrez tabuľky ${esc(t.full)}</span>` }) : '<p class="tp-k">Prípravka hrá bez tabuľky.</p>'}</div>
  </div>
  ${more(`${R}${t.url}`, `${t.short}: zápasy a súpiska`)}
</section>`;
}

add('', {
  title: `futbal od roku ${club.zalozenie}`, active: '', bodyClass: 'home',
  body: (R) => {
    const n = nextA;
    const wl = winterLine();
    return `<section class="hero"><div class="wrap hero-in">
  <div>
    <h1 class="h1">Futbal za štrekou</h1>
    <p class="hero-p">${esc(A.leagueName)}${A.pos ? `, ${A.pos}. miesto ${zo(A.of)}` : ''}. Áčko sa v auguste 2026 vrátilo do krajskej súťaže, v mládeži ${youth.length >= 2 && youth.length <= 4 ? 'hrajú' : 'hrá'} ${plural(youth.length, 'tím', 'tímy', 'tímov')}.</p>
  </div>
  ${n ? `<a class="hero-next" href="${R}${n.url}"><span class="tp-k">Najbližší zápas áčka</span><b>${n.home ? 'Ludanice – ' : ''}${esc(n.opponent)}${n.home ? '' : ' – Ludanice'}</b><span>${dLong(n.date)}, ${esc(n.time || '')}</span>${wl ? '' : `<span class="cd" data-kickoff="${isoLocal(n.date, n.time)}" hidden></span>`}</a>` : ''}
</div></section>
<section class="sec" aria-labelledby="tabs-h"><div class="wrap">
  ${secHead('Tímy', 'tabs-h', more(`${R}zapasy/`, 'Všetky zápasy'))}
  <div class="tabs" data-tabs>
    <div class="tablist" role="tablist" aria-label="Tímy">${teams.map((t) => `<button type="button" role="tab" id="t-${t.slug}" aria-controls="p-${t.slug}" aria-selected="false">${esc(t.short)}</button>`).join('')}</div>
    ${teams.map((t) => teamPanel(t, R)).join('')}
  </div>
</div></section>
<section class="sec sec--tint" aria-labelledby="st-h"><div class="wrap cols2">
  <div>${secHead('Za štrekou', 'st-h', '', 'Ihrisko od rokov 1946 – 1947')}<p>${esc(club.stadion.kronika[1].t)}</p>${more(`${R}klub/`, 'Kronika ihriska')}</div>
  <div>${facts(ST.fakty.slice(1))}</div>
</div></section>`;
  },
});

add('klub/', {
  title: 'Klub', active: 'klub/', desc: `${club.nazov}: kronika ihriska Za štrekou, ročníky áčka, tituly 2016/17 a 2021/22, návrat do VI. ligy a obec Ludanice.`,
  body: (R) => `${pageHead({ title: 'Klub', sub: `${esc(club.pravnyNazov)}, futbal od roku ${club.zalozenie}. Klubové farby: ${esc(club.farby)}.`, R, crumbs: [[null, 'Klub']] })}
<section class="sec sec--first"><div class="wrap cols2">
  <div><h2 class="h2">Kronika ihriska</h2>${facts(club.stadion.kronika)}</div>
  <div><h2 class="h2">Z Ludanických novín</h2>${facts(club.spravy.zoznam.map((x) => ({ k: x.rok, t: x.text })))}<h2 class="h2 h2--gap">Veľké dni</h2>${facts(club.dni.zoznam.map((x) => ({ k: x.rok, t: x.text })))}</div>
</div></section>
<section class="sec sec--tint"><div class="wrap">
  <h2 class="h2">Ročníky áčka</h2>${seasonsTable(club.rocniky.zoznam)}<p class="note">${esc(club.kvalifikacia.text)}</p>
</div></section>
<section class="sec"><div class="wrap">
  <h2 class="h2">Ludanice</h2>${facts(club.obec.fakty)}
  <p class="note">Zdroje: web obce Ludanice, Ludanické noviny 2025 a 2026, Sportnet, Wikipédia.</p>
</div></section>`,
});
