# 💰 FluxTransaction - Application de Transfert d'Argent en Ligne

![Angular](https://img.shields.io/badge/Angular-20.1.0-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-cyan.svg)
![License](https://img.shields.io/badge/License-Private-orange.svg)

## 📋 Description du Projet

**FluxTransaction** est une application web moderne de transfert d'argent en ligne développée avec Angular. Elle permet aux utilisateurs d'effectuer des transactions financières de manière sécurisée et rapide, avec une interface utilisateur intuitive et des fonctionnalités complètes de gestion financière.

## ✨ Fonctionnalités Principales

### 🔐 Authentification Sécurisée
- **Connexion utilisateur** : Système d'authentification robuste avec JWT
- **Inscription** : Création de compte sécurisée
- **Gestion des sessions** : Protection des données utilisateur

### 💸 Gestion des Transactions
- **Virements** : Transfert d'argent entre comptes
- **Dépôts** : Ajout de fonds sur le compte utilisateur
- **Retraits** : Retrait d'argent du compte
- **Annulation de transactions** : Possibilité d'annuler certaines opérations

### 📊 Suivi et Historique
- **Historique des transactions** : Consultation complète des mouvements
- **Tableau de bord** : Vue d'ensemble des finances personnelles
- **Graphiques** : Visualisation des données avec Chart.js

### 🛡️ Sécurité Avancée
- **Chiffrement des données** : Protection des informations sensibles
- **Validation côté client et serveur** : Double vérification des transactions
- **Gestion des tokens** : Authentification sécurisée

## 🛠️ Technologies Utilisées

### Frontend
- **Angular 20.1.0** : Framework JavaScript moderne
- **TypeScript 5.8.2** : Langage de programmation typé
- **TailwindCSS 4.1.11** : Framework CSS utilitaire
- **Chart.js & ng2-charts** : Visualisation de données
- **JWT Decode** : Gestion des tokens d'authentification

### Backend (Connecté)
- **Spring Boot** : Framework Java pour l'API
- **Base de données** : Stockage sécurisé des informations
- **API REST** : Communication entre frontend et backend

## 🏗️ Architecture de l'Application

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (Angular)     │◄──►│   (Spring Boot) │
│                 │    │                 │
│ • Interface UI  │    │ • API REST      │
│ • Logique métier│    │ • Gestion BDD   │
│ • Authentification│  │ • Sécurité      │
└─────────────────┘    └─────────────────┘
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Angular CLI

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd Project-Operation-Front_end
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des environnements**
```bash
# Copier les fichiers d'environnement
cp src/environments/environment.ts.example src/environments/environment.ts
```

4. **Démarrer l'application**
```bash
# Développement local
npm run start:local

# Environnement de développement
npm run start:dev

# Environnement de staging
npm run start:staging

# Environnement de production
npm run start:prod
```

## 📱 Utilisation

### Accès à l'Application
- **URL locale** : `http://localhost:4200`
- **URL de production** : `https://flux.hackbou.com`

### Navigation
1. **Page d'accueil** : Présentation de l'application
2. **Authentification** : Connexion/Inscription
3. **Tableau de bord** : Vue d'ensemble des finances
4. **Transactions** : Gestion des virements, dépôts, retraits
5. **Historique** : Consultation des mouvements
6. **Administration** : Gestion des utilisateurs (admin)

## 🔧 Scripts Disponibles

```bash
# Développement
npm run start          # Serveur de développement par défaut
npm run start:local    # Environnement local
npm run start:dev      # Environnement de développement
npm run start:staging  # Environnement de staging
npm run start:prod     # Environnement de production

# Build
npm run build          # Build de production
npm run watch          # Build en mode watch

# Tests
npm run test           # Tests unitaires avec Karma
```

## 🏛️ Structure du Projet

```
src/
├── app/
│   ├── authentification/     # Modules d'authentification
│   ├── backoffice/           # Interface d'administration
│   ├── core/                 # Services et guards
│   ├── pages/                # Pages principales
│   └── shared/               # Composants partagés
├── assets/                   # Ressources statiques
└── environments/             # Configuration des environnements
```

## 🔒 Sécurité

- **Authentification JWT** : Tokens sécurisés pour les sessions
- **Validation des données** : Vérification côté client et serveur
- **Gestion des permissions** : Contrôle d'accès basé sur les rôles

## 🚀 Déploiement

### Docker
```bash
# Build de l'image Docker
docker build -t flux-transaction .

# Exécution avec Docker Compose
docker-compose up -d
```

### Environnements
- **Local** : Développement local
- **Production** : Environnement de production

## 📈 Avantages du Projet

- ⚡ **Rapidité** : Transactions instantanées et interface réactive
- 🔒 **Sécurité** : Protection avancée des données et transactions
- 📱 **Responsive** : Interface adaptée à tous les appareils
- 🎨 **Moderne** : Design contemporain avec TailwindCSS

## 🎯 Défis Techniques

- **Sécurité** : Protection contre les fraudes et attaques
- **Scalabilité** : Gestion d'un grand nombre d'utilisateurs
- **Performance** : Optimisation des temps de réponse
- **Conformité** : Respect des réglementations financières

## 📋 Plan de Développement

1. **Phase 1** : Conception UI/UX et architecture
2. **Phase 2** : Développement des fonctionnalités core
3. **Phase 3** : Intégration backend et tests
4. **Phase 4** : Tests de sécurité et optimisation
5. **Phase 5** : Déploiement et mise en production


---

**FluxTransaction** - Faciliter les transferts d'argent de manière sécurisée et moderne 🚀
