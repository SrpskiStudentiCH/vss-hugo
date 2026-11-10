# Uređivanje sadržaja sajta — uputstvo

Ovaj sajt je statički (Hugo) i sav sadržaj se nalazi u Markdown fajlovima. Sve izmene možete
raditi sami u VS Code-u ili nam poslati izmene, pa ćemo ih mi primeniti.

## Gde se šta nalazi

| Šta želite da menjate | Gde |
| --- | --- |
| Tekstovi početne strane (naslovi, opisi) | `i18n/sr.yaml` (i `i18n/en.yaml`, `i18n/de.yaml` za druge jezike) |
| O nama | `content/about/_index.md` |
| Dokumenta | `content/documents/_index.md` |
| Naš tim (odbor) | `content/about/board.md` |
| Istorijat | `content/about/history.md` |
| Vodič (Studiranje) | `content/guide/_index.md` i podstranice u `content/guide/` |
| Događaji | `content/events/` — jedan fajl po događaju |
| Postani član | `content/join/_index.md`, `content/join/benefits.md`, `content/join/volunteer.md` |
| Kontakt | `content/contact/_index.md` |
| Alumni | `content/alumni/_index.md` |
| Podrška / donacije | `content/support/_index.md` |
| Blog / vesti | `content/blog/` — jedan fajl po članku |
| Mediji | `content/media/_index.md` |
| Svi prevodi (nemački/engleski) | isti fajlovi u `content/de/` i `content/en/` |
| Logo i slike | `static/images/` |
| Kontakt podaci (e-mail, LinkedIn, Instagram) | `hugo.toml` → sekcija `[params.contact]` |

## Kako se dodaje novi događaj

1. Napravite novi fajl u `content/events/`, npr. `2026-12-05-novogodisnje-druzenje.md`:

```markdown
+++
title = "Novogodišnje druženje"
date = 2026-12-05
draft = false
event_type = "social"
semester = "Jesenji semestar 2026"
description = "Kratak opis događaja."
+++

Ovde ide duži opis događaja.
```

2. Ako događaj traje više dana, dodajte i `end_date = 2026-12-06`.

3. Sačuvajte fajl — događaj će se automatski pojaviti u kategoriji
   **Predstojeći događaji**. Kada datum prođe, Hugo ga automatski prikazuje u
   **Prošlim događajima**, grupisanog po polju `semester`.

4. Prevodi: kopirajte isti fajl u `content/en/events/` i `content/de/events/` sa istim
   imenom fajla i prevedenim naslovom/opisom. **Važno:** ime fajla mora biti identično u
   sva tri jezika da bi prebacivanje jezika radilo.

## Kako se dodaje novi članak u blogu

Isto kao događaj, ali u `content/blog/`:

```markdown
+++
title = "Naslov članka"
date = 2026-08-31
draft = false
author = "Uredništvo"
description = "Kratak opis."
+++

Tekst članka...
```

## Kako se menjaju slike

- Slike postavite u `static/images/`.
- U front matter-u (zaglavlju između `+++`) navedite putanju, npr.
  `image = "/images/nova-slika.jpg"`.

## Kako se menjaju tekstovi u navigaciji

Tekstovi dugmadi, naslova sekcija i labela nalaze se u `i18n/sr.yaml`
(za engleski `i18n/en.yaml`, za nemački `i18n/de.yaml`). Na primer,
labela dugmeta „Aktivnosti“ je ključ `nav_activities`.

## Kontakt podaci

E-mail, LinkedIn i Instagram URL se menjaju na jednom mestu — u `hugo.toml`,
sekcija `[params.contact]`. Privatni brojevi telefona se namerno ne objavljuju.

Napomena: LinkedIn URL je trenutno postavljen na opštu adresu
(`https://www.linkedin.com/`) — zamenite je zvaničnim URL-om profila organizacije
u `hugo.toml` i u `content/contact/_index.md` (za sva tri jezika).

## Google Form za učlanjenje

Join stranica je pripremljena za budući Google Form. Kada formular bude spreman:

1. U `hugo.toml` postavite `joinFormUrl = "https://forms.gle/..."`.
2. CTA dugme „Učlani se preko formulara“ automatski će voditi na tu adresu i
   otvarati se u novom tabu.
3. Dok je polje prazno, dugme vodi na kontakt stranicu.

## Kalendar događaja

Na stranici Događaji (srpski, engleski i nemački) prikazan je Google kalendar
sa aktivnostima udruženja. Kalendar se podešava u `hugo.toml`, u `[params]`:

- `eventsCalendarId` — deo Google embed linka (`src=...`). Ako je polje prazno,
  kalendar se ne prikazuje.
- `eventsCalendarColor` — boja kalendara u hex formatu (npr. `"#7986cb"`).

Jezik prikaza kalendara se automatski prilagođava jeziku sajta, a termini se
menjaju direktno u Google kalendaru — bez izmene sadržaja sajta.

## Dodavanje dokumenta

U `content/documents/_index.md` svako dokumento je stavka u nizu `docs`:

```toml
docs = [
  { type = "Pravilnik", title = "Naziv", desc = "Kratak opis.", year = "2026", url = "https://..." }
]
```

Ako `url` nije naveden, dokument se prikazuje kao „uskoro“ (isprekidana kartica).

## Kako se primenjuju izmene

Nakon izmene Markdown fajlova pokrenite build u terminalu:

```bash
hugo
```

Sajt će se regenerisati u folderu `public/`.

## Napomena o placeholder sadržaju

Neki događaji (npr. „Dobrodošlica za nove studente“ i „Winter Network Night“) dodati su
kao primeri budućih događaja — slobodno ih izmenite ili obrišite kad budu poznati
stvarni termini.
