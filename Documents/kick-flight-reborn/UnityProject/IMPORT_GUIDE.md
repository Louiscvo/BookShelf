# 📦 Guide d'Import - Kick Flight: Reborn

## ✅ Ce qui a été fait automatiquement

1. ✅ Structure complète Assets/ créée
2. ✅ Scripts Unity copiés:
   - AerialMovement.cs (Mouvement aérien 6DoF)
   - CombatSystem.cs (Combat avec combos)
   - KickerHealth.cs (Santé et respawn)
3. ✅ Scripts d'automatisation créés (Editor/)
4. ✅ Assembly Definition configuré

---

## 🚀 Comment Ouvrir le Projet

### Option 1: Nouveau Projet dans Unity Hub
```
Unity Hub > Projects > New Project

Configuration:
- Template: 3D (URP)
- Name: KickFlightReborn
- Location: /Users/louischavouet/Documents/kick-flight-reborn/UnityProject

Create Project
```

### Option 2: Ajouter le Projet Existant
```
Unity Hub > Projects > Add

Sélectionner: /Users/louischavouet/Documents/kick-flight-reborn/UnityProject

Open
```

---

## 📦 Packages à Installer (IMPORTANT)

Une fois Unity ouvert:

### 1. Netcode for GameObjects
```
Window > Package Manager
Unity Registry > "Netcode for GameObjects" > Install
```

### 2. Input System
```
Unity Registry > "Input System" > Install
⚠️ Accepter le redémarrage
```

### 3. Cinemachine
```
Unity Registry > "Cinemachine" > Install
```

---

## ⚙️ Configuration Automatique

Le projet se configure automatiquement au premier lancement:
- Color Space: Linear
- Company Name: Kick Flight Community
- Product Name: Kick Flight Reborn
- Multithreaded Rendering: Activé

### Configuration Manuelle des Layers & Tags

Si nécessaire:
```
Tools > Kick Flight > Setup Layers and Tags
```

Cela créera:
- Tags: Player, Enemy, Crystal, SpawnPoint, etc.
- Layers: Player (6), Environment (7), Collectible (8), Projectile (9)

---

## 📜 Vérifier les Scripts

Dans Unity, vérifier:
```
Assets/_Project/Scripts/
├── Movement/AerialMovement.cs
├── Combat/CombatSystem.cs
└── Player/KickerHealth.cs
```

Console devrait afficher:
```
✅ Kick Flight: Reborn - Setup complete!
```

---

## 🎮 Créer une Scène de Test

Voir le guide: `../docs/QUICK_START.md`

Ou demander à Claude Code:
```bash
cd ~/Documents/kick-flight-reborn
claude chat
"Crée une scène de test avec le player"
```

---

## 🐛 Problèmes Courants

### "Scripts have compilation errors"
- Installer Netcode for GameObjects
- Installer Input System
- Redémarrer Unity

### "Color Space is Gamma"
```
Edit > Project Settings > Player
Other Settings > Color Space > Linear
```

### "Tags/Layers manquants"
```
Tools > Kick Flight > Setup Layers and Tags
```

---

## 📚 Documentation

- `../README.md` - Vue d'ensemble
- `../docs/QUICK_START.md` - Démarrage rapide
- `../docs/UNITY_SETUP_GUIDE.md` - Setup complet
- `../docs/ARCHITECTURE.md` - Architecture
- `../docs/GAME_DESIGN.md` - Game design

---

## 🆘 Aide

Dans le terminal:
```bash
cd ~/Documents/kick-flight-reborn
claude chat
```

Puis demander:
- "Aide-moi à configurer Unity"
- "Crée une scène de test"
- "Explique-moi comment marche AerialMovement.cs"

---

**Projet prêt à être ouvert dans Unity ! 🎮✨**
