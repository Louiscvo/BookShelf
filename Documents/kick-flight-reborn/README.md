# 🎮 Kick Flight: Reborn

[![Unity Version](https://img.shields.io/badge/Unity-2022.3%20LTS-blue.svg)](https://unity.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow.svg)]()

> Un projet communautaire visant à recréer **Kick-Flight**, le jeu mobile d'action aérienne en arène 4v4 développé par Grenge/CyberAgent.

---

## 🌟 À Propos

Kick Flight: Reborn est une recréation open-source du jeu mobile Kick-Flight, offrant des combats aériens verticaux intenses dans des arènes 3D. Les joueurs contrôlent des "Kickers" dans des batailles 4v4 rapides et dynamiques avec un système de vol en 6 degrés de liberté.

### ✨ Caractéristiques Principales

- 🚀 **Vol libre en 3D** - 6 degrés de liberté pour une mobilité totale
- ⚔️ **Combat aérien dynamique** - Kicks, combos et capacités spéciales
- 🌐 **Multijoueur temps réel** - Matchs 4v4 en ligne
- 🎯 **Personnages uniques** - Différents Kickers avec capacités distinctes
- 🏟️ **Arènes verticales** - Environnements conçus pour le combat aérien
- 📱 **Optimisé mobile** - Performance 60 FPS sur devices moyens

---

## 🎯 Gameplay

### Mécaniques Core

**Vol & Mobilité:**
- Vol libre dans toutes les directions
- Système de boost pour vitesse accrue
- Dash avec cooldown pour esquives
- Physique aérienne arcade

**Combat:**
- Kicks de base avec système de combo (jusqu'à 3 hits)
- Attaques spéciales (AOE)
- Ultimates uniques par personnage
- Knockback et effets de zone

**Modes de Jeu:**
- Battle Royale aérien (4v4)
- Capture de cristaux
- Elimination
- Ranked matches

---

## 🛠️ Stack Technique

### Moteur & Outils
- **Unity 2022.3 LTS** - Moteur de jeu principal
- **Universal Render Pipeline (URP)** - Rendu optimisé mobile
- **C#** - Langage de programmation

### Packages Unity
- **Netcode for GameObjects** - Multijoueur temps réel
- **Input System** - Système d'input moderne
- **Cinemachine** - Caméra dynamique
- **TextMeshPro** - UI texte

### Architecture
- **Client-Server** - Architecture autoritaire
- **Validation serveur** - Anti-cheat intégré
- **Client prediction** - Mouvement fluide

---

## 📦 Installation

### Prérequis
- Unity Hub installé
- Unity 2022.3 LTS ou supérieur
- Git
- 10 GB d'espace disque minimum

### Démarrage Rapide

```bash
# 1. Cloner le repository
git clone https://github.com/[votre-username]/kick-flight-reborn.git
cd kick-flight-reborn

# 2. Ouvrir dans Unity Hub
# - Ajouter le dossier UnityProject/
# - Ouvrir avec Unity 2022.3 LTS

# 3. Installer les packages requis
# Window > Package Manager > Install:
# - Netcode for GameObjects
# - Input System
# - Cinemachine
```

📖 **Guide détaillé:** Voir [QUICK_START.md](docs/QUICK_START.md)

---

## 📚 Documentation

- 🚀 [Guide de Démarrage Rapide](docs/QUICK_START.md) - Commencez en 5 minutes
- 🏗️ [Architecture Technique](docs/ARCHITECTURE.md) - Design du système
- 🎮 [Game Design Document](docs/GAME_DESIGN.md) - Mécaniques et équilibrage
- ⚙️ [Guide Setup Unity](docs/UNITY_SETUP_GUIDE.md) - Configuration détaillée
- 🤝 [Guide de Contribution](community/CONTRIBUTING.md) - Comment contribuer

---

## 🗂️ Structure du Projet

```
kick-flight-reborn/
├── UnityProject/              # Projet Unity principal
│   └── Assets/_Project/
│       ├── Scripts/           # Code C#
│       ├── Prefabs/           # Prefabs de jeu
│       ├── Scenes/            # Scènes Unity
│       └── Art/               # Assets visuels
├── UnityScripts/              # Scripts organisés (pré-import)
├── docs/                      # Documentation
├── community/                 # Ressources communautaires
└── tools/                     # Outils de développement
```

---

## 🚀 Roadmap

### Phase 1: Prototype (Q1 2025) ✅ En cours
- [x] Configuration projet Unity
- [x] Scripts de mouvement aérien
- [x] Système de combat basique
- [ ] Network Manager
- [ ] Scène de test
- [ ] Premier Kicker jouable

### Phase 2: Core Gameplay (Q2 2025)
- [ ] 4-5 Kickers avec capacités uniques
- [ ] 2-3 Arènes complètes
- [ ] Matchmaking en ligne
- [ ] HUD et UI
- [ ] Système de score

### Phase 3: Polish & Beta (Q3-Q4 2025)
- [ ] Optimisation mobile
- [ ] Plus de contenu
- [ ] Système de progression
- [ ] Beta testing communautaire
- [ ] Équilibrage

### Phase 4: Lancement (2026)
- [ ] Release publique
- [ ] Support post-lancement

Voir la [roadmap complète](community/CONTRIBUTING.md#roadmap)

---

## 🤝 Contribution

Nous accueillons toutes les contributions ! Que vous soyez développeur, artiste, game designer ou testeur.

### Comment Contribuer

1. **Fork** le projet
2. **Créez** une branche (`git checkout -b feature/MaSuperFeature`)
3. **Commit** vos changements (`git commit -m 'Ajout de MaSuperFeature'`)
4. **Push** vers la branche (`git push origin feature/MaSuperFeature`)
5. **Ouvrez** une Pull Request

📖 Voir le [Guide de Contribution](community/CONTRIBUTING.md) pour plus de détails.

---

## 📜 Développé Avec

Ce projet utilise ces ressources open-source:

- [Unity](https://unity.com/) - Moteur de jeu
- [Netcode for GameObjects](https://docs-multiplayer.unity3d.com/) - Networking
- [Mixamo](https://www.mixamo.com/) - Animations de personnages
- [Freesound](https://freesound.org/) - Effets sonores

---

## 👥 Communauté

- **Discord**: [À créer]
- **Reddit**: [À créer]
- **GitHub Discussions**: Pour les discussions techniques
- **Twitter**: [À créer]

---

## 📄 Licence

Ce projet est sous licence MIT - voir [LICENSE](LICENSE) pour plus de détails.

**Note:** Ce projet est un fan-made recréation et n'est pas affilié avec Grenge, CyberAgent ou les créateurs originaux de Kick-Flight.

---

## 🙏 Remerciements

- **Grenge/CyberAgent** - Pour le jeu original Kick-Flight
- **La communauté Kick-Flight** - Pour leur passion et support
- **Contributeurs open-source** - Pour leurs outils et ressources

---

## ⭐ Support

Si vous aimez ce projet, donnez-lui une ⭐ sur GitHub !

**Développé avec ❤️ par la communauté Kick-Flight**

---

## 📞 Contact

- **Repository**: https://github.com/[votre-username]/kick-flight-reborn
- **Issues**: https://github.com/[votre-username]/kick-flight-reborn/issues
- **Email**: [votre-email]

---

**Status du Projet:** 🟡 En développement actif - Alpha

*Dernière mise à jour: Novembre 2025*
