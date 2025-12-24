# Bonne Mamie - Setup Guide

## Configuration Google Sheets

### Colonnes à créer dans votre Google Sheet

| Colonne | Nom | Description |
|---------|-----|-------------|
| A | id | Identifiant unique (timestamp) |
| B | titre | Titre de la recette |
| C | auteur | Nom de l'auteur |
| D | photo | URL de l'image |
| E | ingredients | JSON string des ingrédients |
| F | etapes | Instructions de préparation |
| G | portions | Nombre de portions par défaut |
| H | createdAt | Date de création |

### Exemple de première ligne (en-têtes) :
```
id | titre | auteur | photo | ingredients | etapes | portions | createdAt
```

## Configuration Sheet.best

1. Allez sur [sheet.best](https://sheet.best)
2. Créez un compte et connectez votre Google Sheet
3. Copiez l'URL de l'API fournie
4. Créez un fichier `.env` à la racine du projet :
   ```
   VITE_GOOGLE_SHEET_URL=https://sheet.best/api/sheets/VOTRE_ID
   ```

## Lancement du projet

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

## Déploiement Vercel

1. Configurez la variable d'environnement `VITE_GOOGLE_SHEET_URL` dans Vercel
2. Déployez depuis GitHub ou via `vercel deploy`
