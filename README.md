# 📚 LibraShelf — Librari Online

Projekt universitar për lëndën **Zhvillim i Ueb-it në Anën e Klientit**. LibraShelf është një aplikacion full-stack i ndërtuar me **Next.js (Pages Router)**, ku përdoruesit mund të shfletojnë libra, të lënë komente/vlerësime, t'i ruajnë librat e preferuar dhe të menaxhojnë profilin e tyre, ndërsa administratorët menaxhojnë katalogun nga një panel i dedikuar.

🔗 **Link live:** _(vendos këtu URL-në e Vercel pas deployment-it, p.sh. https://librashelf.vercel.app)_

## Ekipi

| Emri | Roli |
|---|---|
| _Emri Mbiemri 1_ | Frontend & UI (komponentë, Tailwind CSS, faqet publike) |
| _Emri Mbiemri 2_ | Backend & Autentifikim (NextAuth, API routes, MongoDB) |
| _Emri Mbiemri 3_ | Admin Panel, Testim (Jest/RTL) & Deployment |

## Përmbajtja

- [Funksionalitetet](#funksionalitetet)
- [Teknologjitë](#teknologjitë)
- [Struktura e Projektit](#struktura-e-projektit)
- [Instalimi Lokal](#instalimi-lokal)
- [Konfigurimi i MongoDB Atlas](#konfigurimi-i-mongodb-atlas)
- [Konfigurimi i Google OAuth](#konfigurimi-i-google-oauth)
- [Mbushja e Bazës me të Dhëna (Seed)](#mbushja-e-bazës-me-të-dhëna-seed)
- [Testimi](#testimi)
- [Deployment në Vercel](#deployment-në-vercel)
- [Screenshots](#screenshots)

## Funksionalitetet

- **10+ faqe**: Ballina, Rreth Nesh, Kontakt, Hyrje, Regjistrim, Dashboard, Admin Panel, Librat, Detajet e Librit, Profili, Të Preferuarat + bonus (Kërko, FAQ, Kushtet e Përdorimit, 404).
- **Autentifikim** me NextAuth (Credentials + Google OAuth) dhe role `user` / `admin`, mbrojtur me `middleware.js`.
- **CRUD i plotë** për Libra (admin) dhe Komente/Vlerësime (përdoruesi i kyçur mund të krijojë, lexojë, editojë dhe fshijë komentet e veta).
- **MongoDB** me 5 modele: `User`, `Book`, `Review`, `Favorite`, `Message`.
- **Hooks & Context**: `useState`, `useEffect`, `FavoritesContext` (Context API) dhe custom hook `useFavorites` / `useDebouncedValue`.
- **Data fetching**: `getStaticProps` (About), `getStaticProps` + `revalidate` (Home, Books – ISR), `getStaticPaths` + ISR (Detajet e Librit), `getServerSideProps` (Dashboard, Profile, Favorites, Admin – të dhëna gjithmonë të freskëta).
- **Formularë** me `react-hook-form` dhe validim (Kontakt, Regjistrim, Hyrje, Formulari i Librit, Komentet, Profili).
- **Tailwind CSS** — dizajn plotësisht responsive (mobile/tablet/desktop).
- **Teste** me Jest + React Testing Library (komponentë) dhe API routes.

## Teknologjitë

Next.js 14 (Pages Router) · React 18 · NextAuth.js v4 · MongoDB + Mongoose · Tailwind CSS · react-hook-form · Jest · React Testing Library

## Struktura e Projektit

```
libra-shelf/
├─ components/       # Header, Footer, BookCard, Button, Modal, Loader, BookForm, Layout
├─ context/           # FavoritesContext (Context API)
├─ hooks/             # useFavorites, useDebouncedValue (custom hooks)
├─ lib/               # mongodb.js (lidhja), authOptions.js (NextAuth config)
├─ models/            # User, Book, Review, Favorite, Message
├─ pages/
│  ├─ api/            # auth, books, reviews, favorites, contact, profile
│  ├─ admin/           # panel + shto/ndrysho libra
│  ├─ books/           # listë (ISR) + detaje (SSG/ISR)
│  ├─ index.js, about.js, contact.js, login.js, register.js,
│  │  dashboard.js, profile.js, favorites.js, search.js, faq.js, terms.js, 404.js
├─ scripts/seed.js    # mbush bazën me admin + libra shembull
├─ middleware.js      # mbrojtja e rrugëve sipas rolit
└─ __tests__/         # teste Jest (komponentë + API)
```

## Instalimi Lokal

### 1. Instalo Node.js

Shkarko dhe instalo **Node.js LTS** (v18 ose më i ri) nga [nodejs.org](https://nodejs.org/). Verifiko instalimin:

```bash
node -v
npm -v
```

### 2. Instalo varësitë e projektit

Brenda folderit `libra-shelf`:

```bash
npm install
```

### 3. Konfiguro variablat e ambientit

Kopjo `.env.local.example` në `.env.local`:

```bash
cp .env.local.example .env.local
```

Plotëso vlerat sipas udhëzimeve më poshtë (MongoDB, NextAuth, Google OAuth).

### 4. (Opsionale) Mbush bazën me të dhëna shembull

```bash
npm run seed
```

### 5. Nis serverin e zhvillimit

```bash
npm run dev
```

Hap [http://localhost:3000](http://localhost:3000) në browser.

## Konfigurimi i MongoDB Atlas

1. Shko te [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) dhe krijo një llogari falas.
2. Krijo një **Cluster** të ri (opsioni falas M0 mjafton).
3. Te **Database Access**, krijo një përdorues me username/password.
4. Te **Network Access**, shto `0.0.0.0/0` (lejo qasje nga kudo — mjafton për zhvillim/projekt universitar).
5. Kliko **Connect → Drivers**, kopjo connection string-un (duket si `mongodb+srv://<user>:<password>@cluster0.mongodb.net/`).
6. Vendose te `.env.local` si `MONGODB_URI`, duke shtuar emrin e bazës në fund (p.sh. `.../librashelf?retryWrites=true&w=majority`).

## Konfigurimi i Google OAuth

1. Shko te [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials).
2. Krijo një projekt të ri (ose përdor një ekzistues).
3. **Create Credentials → OAuth client ID** → tipi "Web application".
4. Te **Authorized redirect URIs** shto:
   - `http://localhost:3000/api/auth/callback/google` (për zhvillim lokal)
   - `https://<domain-i-vercel>/api/auth/callback/google` (pas deployment-it)
5. Kopjo `Client ID` dhe `Client Secret` te `.env.local` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

Për `NEXTAUTH_SECRET`, gjenero një string të rastësishëm, p.sh.:

```bash
openssl rand -base64 32
```

## Mbushja e Bazës me të Dhëna (Seed)

`npm run seed` krijon:
- Një përdorues admin: **admin@librashelf.com** / **Admin123!**
- 4 libra shembull në kategori të ndryshme

## Testimi

```bash
npm test
```

Testet ndodhen te `__tests__/components` (3 komponentë) dhe `__tests__/api` (2 API routes: `/api/contact`, `/api/books`).

## Deployment në Vercel

1. Puno commit/push të projektit në një repository GitHub.
2. Shko te [vercel.com](https://vercel.com) → **Add New Project** → zgjidh repository-n.
3. Te **Environment Variables**, shto të njëjtat variabla nga `.env.local`:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` → vendos URL-në finale të Vercel (p.sh. `https://librashelf.vercel.app`)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
4. Kliko **Deploy**. Vercel do të instalojë varësitë dhe të bëjë build automatikisht.
5. Pas deployment-it, përditëso **Authorized redirect URI** te Google Cloud Console me domain-in e ri të Vercel.
6. Vendos linkun final në krye të këtij README-je.

## Screenshots

_(Shto këtu screenshot-e të aplikacionit pas testimit lokal: Ballina, Katalogu i Librave, Detajet e Librit, Dashboard, Admin Panel, etj. Mund t'i vendosësh si `docs/screenshot-home.png` dhe t'i referosh me `![Ballina](docs/screenshot-home.png)`.)_
