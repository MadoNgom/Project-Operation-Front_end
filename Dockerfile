# Dockerfile pour l'application Angular
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (dev + prod)
RUN npm install

# Copier le code source
COPY . .

# Exposer le port 4200 (port par défaut d'Angular)
EXPOSE 4200

# Commande pour démarrer l'application en mode production
CMD ["npm", "run", "start:prod", "--", "--host", "0.0.0.0"]
