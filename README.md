# Srpski studenti u Švajcarskoj - Hugo

Ovo je novi statički Hugo sajt za organizaciju Srpskih studenata u Švajcarskoj.

## Start

```bash
hugo server -D
```

## Sadržaj

- `content/` za markdown sadržaj
- `layouts/` za templates
- `assets/scss/` za stilove
- `archetypes/` za nove blog i event postove

## Kreiranje sadržaja

```bash
hugo new blog/moj-prvi-post.md
hugo new events/moj-dogadaj.md
```

## Deploy

Build izlazi u `public/` (folder je u `.gitignore`, ne commit-uje se).

- **GitHub Pages** — `.github/workflows/hugo.yml` pokreće `hugo` i objavljuje `public/`. `baseURL` se pri build-u preuzima iz `actions/configure-pages` (`steps.pages.outputs.base_url`), pa se automatski prilagođava stvarnom Pages domenu; `baseURL` u `hugo.toml` (`https://srpskistudentich.github.io/vss-hugo/`) služi samo kao fallback za lokalni build. Pages za **privatne** repo-e zahteva GitHub Pro/Team/Enterprise — na Free planu deploy pada sa HTTP 422.
- **Netlify** — `netlify.toml` definiše build komandu, publish folder i verziju Hugo-a. `baseURL` se pri build-u postavlja na URL deploy-a (`DEPLOY_PRIME_URL`, odnosno `URL`), pa sajt radi i na `*.netlify.app` i na custom domenu bez menjanja `hugo.toml`.

Netlify za `HUGO_VERSION` instalira extended Hugo build, što je neophodno za `toCSS` pipeline iz `assets/scss/`.

### Verzija Hugo-a

GitHub Pages i Netlify su **pinovani na Hugo 0.167.0**. `hugo.toml` koristi `module.mounts.lang` i `module.mounts.excludeFiles` (da srpski build ne bi preuzeo `content/en` i `content/de`); oba ključa su uklonjena u Hugu 0.168.0, pa podizanje na 0.168+ ruši build sa `error building site: logged 2 error(s)`. Pre prelaska na noviji Hugo, mount-ove treba migrirati na `sites.matrix` i `files`.

Lokalna provera Netlify build-a:

```bash
hugo --gc --baseURL "https://example.netlify.app" -d public
```
