# 📧 Nexus-Mail API

API RESTful de gestion d'emails développée avec **Node.js**, **ExpressJs, **TypeScript** et **PostgreSQL**.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)

## 🎯 À propos

API backend pour une application de messagerie avec gestion des utilisateurs, dossiers, emails et tags.

**Fonctionnalités :**

- Authentification JWT (access + refresh tokens)
- CRUD utilisateurs et tags
- Gestion des dossiers et emails _(en cours)_
- Tests unitaires

## 🛠️ Stack technique

**Backend :** Node.js • Express • TypeScript  
**Database :** PostgreSQL • Prisma ORM  
**Auth :** JWT • Argon2  
**Validation :** Zod  
**Tests :** Node Test Runner

## 🚀 Installation

```bash
git clone https://github.com/Yorgan-Agb/Nexus-Mail.git
cd Nexus-Mail/api
npm install
```

**Configuration :** Créer un fichier `.env`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nexus_mail"
JWT_SECRET="your_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
```

**Lancer l'API :**

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 📁 Structure

```
src/
├── controllers/    # Logique des routes
├── services/       # Logique métier
├── middlewares/    # Auth & error handling
├── validations/    # Schémas Zod
└── routers/        # Routes API
```

## 🔒 Sécurité

- Hashing Argon2 pour les mots de passe
- JWT avec access tokens (1h) + refresh tokens (24h)
- Validation stricte des entrées (Zod)
- Protection CORS

## 🚧 Statut

✅ Auth & Users & Tags  
🔄 Folders & Mails (en cours)
