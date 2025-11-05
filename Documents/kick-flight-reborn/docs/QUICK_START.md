# 🚀 Quick Start - Kick Flight: Reborn

Commencez à développer Kick Flight: Reborn en **5 minutes** !

---

## ⚡ TL;DR (Trop Long, Pas Lu)

```bash
# 1. Installer Unity Hub + Unity 2022.3 LTS
# 2. Cloner le projet
git clone https://github.com/[repo]/kick-flight-reborn.git
cd kick-flight-reborn

# 3. Ouvrir dans Unity Hub
# 4. Installer packages (Netcode, Input System, Cinemachine)
# 5. Play!
```

---

## 📋 Étapes Rapides

### Étape 1: Installer Unity (10 minutes)

**Si Unity Hub n'est pas installé:**

1. Télécharger [Unity Hub](https://unity.com/download)
2. Installer Unity Hub
3. Dans Unity Hub, aller à **Installs**
4. Cliquer **Install Editor**
5. Choisir **Unity 2022.3 LTS** (latest)
6. Modules à cocher:
   - ✅ Dev Tools
   - ✅ iOS Build Support (optionnel)
   - ✅ Android Build Support (optionnel)
7. Cliquer **Install** et attendre (15-30 min)

**Si Unity est déjà installé:** Passer à l'étape 2 ✅

---

### Étape 2: Obtenir le Projet (2 minutes)

**Option A: Cloner depuis Git**
```bash
cd ~/Documents
git clone https://github.com/[votre-repo]/kick-flight-reborn.git
cd kick-flight-reborn
```

**Option B: Créer un nouveau projet**
```
Unity Hub > New Project
├─ Template: 3D (URP)
├─ Name: KickFlightReborn
└─ Location: ~/Documents/kick-flight-reborn/UnityProject

Create Project
```

---

### Étape 3: Ouvrir dans Unity (1 minute)

**Si cloné depuis Git:**
1. Ouvrir Unity Hub
2. Aller dans **Projects**
3. Cliquer **Add** (ou **Open**)
4. Naviguer vers `kick-flight-reborn/UnityProject`
5. Cliquer **Open**
6. Attendre le chargement initial (2-5 min)

**Si créé nouveau:** Le projet s'ouvre automatiquement ✅

---

### Étape 4: Installer les Packages (3 minutes)

Dans Unity:

```
Window > Package Manager
```

**Installer ces 3 packages:**

**1. Netcode for GameObjects**
```
Unity Registry > Chercher "Netcode" > Install
```

**2. Input System**
```
Unity Registry > Chercher "Input System" > Install
(Accepter le redémarrage)
```

**3. Cinemachine**
```
Unity Registry > Chercher "Cinemachine" > Install
```

**Vérification:**
```
Package Manager > In Project
Vous devez voir:
✅ Netcode for GameObjects
✅ Input System
✅ Cinemachine
✅ Universal RP (pré-installé)
✅ TextMeshPro (pré-installé)
```

---

### Étape 5: Configuration Rapide (2 minutes)

**5.1 Activer Input System**
```
Edit > Project Settings > Player
└─> Other Settings
    └─> Active Input Handling: Input System Package (New)

(Redémarrer Unity si demandé)
```

**5.2 Vérifier Color Space**
```
Edit > Project Settings > Player
└─> Other Settings
    └─> Color Space: Linear ✅
```

**5.3 Créer les Layers**
```
Edit > Project Settings > Tags and Layers

Layers:
├─ 6: Player
├─ 7: Environment
├─ 8: Collectible
└─ 9: Projectile
```

---

### Étape 6: Importer les Scripts (1 minute)

**Option A: Si projet cloné**
Les scripts sont déjà là dans `Assets/_Project/Scripts/` ✅

**Option B: Si nouveau projet**
Copier les scripts depuis le repo:

```bash
# Dans le terminal
cp -r ../UnityScripts/Movement/* UnityProject/Assets/_Project/Scripts/Movement/
cp -r ../UnityScripts/Combat/* UnityProject/Assets/_Project/Scripts/Combat/
cp -r ../UnityScripts/Player/* UnityProject/Assets/_Project/Scripts/Player/
```

OU glisser-déposer les fichiers .cs dans Unity.

**Vérifier compilation:**
```
Console (Ctrl/Cmd + Shift + C)
└─> Aucune erreur ✅
```

---

### Étape 7: Créer Scène de Test (3 minutes)

**7.1 Nouvelle Scène**
```
File > New Scene > Basic (Built-in)
Save as: Assets/_Project/Scenes/TestArena.unity
```

**7.2 Créer le Sol**
```
Hierarchy (clic droit) > 3D Object > Plane
└─> Nom: Ground
    ├─ Scale: (20, 1, 20)
    └─> Add Component: Box Collider (si pas déjà présent)
```

**7.3 Créer le Player**
```
Hierarchy > Create Empty
Nom: Player
Position: (0, 2, 0)

Add Components:
├─ Character Controller
│   ├─ Height: 2
│   └─ Radius: 0.5
├─ Scripts:
│   ├─ AerialMovement
│   ├─ KickerHealth
│   └─ CombatSystem
└─ NetworkObject (Netcode component)

Enfant (visuel):
└─> 3D Object > Capsule
    └─ Nom: Visual
    └─ Remove Capsule Collider
    └─ Position: (0, 0, 0)
```

**7.4 Configurer Input System**

Dans le script `AerialMovement` Inspector:
```
Si erreur "KickerControls not found":
└─> Créer Input Actions (voir étape optionnelle ci-dessous)

OU utiliser les inputs par défaut (legacy)
```

**7.5 Ajuster la Caméra**
```
Main Camera:
├─ Position: (0, 8, -8)
└─ Rotation: (35, 0, 0)
```

---

### Étape 8: TESTER ! (30 secondes)

**Appuyer sur Play ▶️**

**Contrôles:**
- **WASD**: Voler
- **Mouse**: Regarder
- **Shift**: Boost
- **Space**: Dash
- **Left Click**: Kick

**Vous devriez:**
- ✅ Voir le player voler
- ✅ Pouvoir contrôler la direction
- ✅ Booster et dasher
- ✅ Aucune erreur dans la Console

---

## 🎉 Succès !

Si tout fonctionne, vous avez un prototype de Kick Flight: Reborn qui tourne !

---

## 📝 Prochaines Étapes

### Immédiatement

1. **Créer Input Actions (Recommandé)**
   ```
   Assets/_Project/Settings/InputActions/ > Create > Input Actions
   Nom: KickerControls
   └─> Voir UNITY_SETUP_GUIDE.md section Input System
   ```

2. **Sauvegarder Player en Prefab**
   ```
   Glisser Player depuis Hierarchy vers:
   Assets/_Project/Prefabs/Characters/
   ```

3. **Tester le Combat**
   ```
   Dupliquer Player dans la scène (Ctrl/Cmd + D)
   Repositionner le 2ème
   Play et tester les kicks entre les deux
   ```

### Dans les prochaines heures

4. **Setup Network Manager**
   ```
   Hierarchy > Create Empty > NetworkManager
   Add: Unity Transport + Network Manager components
   Assigner Player Prefab
   ```

5. **Build & Test Multijoueur**
   ```
   File > Build Settings
   Add Open Scenes
   Build and Run
   Test local multiplayer (1 instance = Host, 1 = Client)
   ```

6. **Améliorer l'Arène**
   ```
   Ajouter obstacles (Cubes, Spheres)
   Ajouter lighting
   Tester gameplay
   ```

### Cette semaine

7. **Créer votre premier Kicker**
   - ScriptableObject pour stats
   - Capacités uniques
   - VFX basiques

8. **Implémenter le Système de Cristaux**
   - Spawner
   - Collectible script
   - Score UI

9. **Créer une vraie Arène**
   - Design vertical
   - Spawn points
   - Zones intéressantes

10. **Rejoindre la Communauté**
    - Discord: [À créer]
    - GitHub Discussions
    - Contribuer !

---

## 🐛 Problèmes Courants

### "Input System package is not installed"

**Solution:**
```
Window > Package Manager
└─> Unity Registry > Input System > Install
Redémarrer Unity
```

### "NetworkBehaviour could not be found"

**Solution:**
```
Window > Package Manager
└─> Unity Registry > Netcode for GameObjects > Install
```

### "Player tombe à l'infini"

**Solution:**
```
Vérifier que Ground a un Collider
Vérifier que AerialMovement est activé
Vérifier gravity dans Physics Settings
```

### "Rien ne bouge quand j'appuie sur WASD"

**Solution:**
```
Vérifier que Input System est activé:
Edit > Project Settings > Player
└─> Active Input Handling: Input System Package (New)

OU utiliser legacy inputs dans les scripts
```

### "Le script AerialMovement a des erreurs"

**Solution:**
```
Vérifier que vous avez:
✅ Input System installé
✅ Netcode for GameObjects installé
✅ Copié le script complet

Console > Double-cliquer erreur pour voir détails
```

---

## 🎓 Tutoriels Recommandés

### Unity Basics (si débutant)
- [Unity Essentials](https://learn.unity.com/pathway/unity-essentials) (gratuit)
- [Create with Code](https://learn.unity.com/course/create-with-code) (gratuit)

### Multijoueur avec Netcode
- [Netcode Getting Started](https://docs-multiplayer.unity3d.com/netcode/current/tutorials/get-started-ngo/)
- [Boss Room Sample](https://github.com/Unity-Technologies/com.unity.multiplayer.samples.coop)

### Input System
- [Input System Quickstart](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.7/manual/QuickStartGuide.html)

---

## 📚 Documentation Complète

- 📖 [UNITY_SETUP_GUIDE.md](UNITY_SETUP_GUIDE.md) - Configuration détaillée
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture technique
- 🎮 [GAME_DESIGN.md](GAME_DESIGN.md) - Design du jeu
- 🤝 [CONTRIBUTING.md](../community/CONTRIBUTING.md) - Guide de contribution

---

## 🆘 Besoin d'Aide ?

- **Documentation:** Ce dossier `/docs`
- **GitHub Issues:** [Créer une issue](https://github.com/[repo]/issues)
- **Discord:** [Rejoindre le serveur] (à créer)
- **Reddit:** r/KickFlightReborn (à créer)

---

## ✅ Checklist de Démarrage

Cochez au fur et à mesure:

**Installation**
- [ ] Unity Hub installé
- [ ] Unity 2022.3 LTS installé
- [ ] Projet ouvert dans Unity

**Configuration**
- [ ] Netcode installé
- [ ] Input System installé
- [ ] Cinemachine installé
- [ ] Color Space: Linear
- [ ] Layers créés

**Scène de Test**
- [ ] Scène TestArena créée
- [ ] Ground placé
- [ ] Player créé avec scripts
- [ ] Caméra positionnée

**Test**
- [ ] Play mode fonctionne
- [ ] Mouvement fonctionne (WASD)
- [ ] Boost fonctionne (Shift)
- [ ] Dash fonctionne (Space)
- [ ] Aucune erreur Console

**Prêt pour le Développement !**
- [ ] Player Prefab sauvegardé
- [ ] Documentation lue
- [ ] Communauté rejointe
- [ ] Première contribution planifiée 🚀

---

**Temps total estimé: 20-30 minutes**

**Bienvenue dans l'équipe Kick Flight: Reborn ! 🎮✨**

---

*Dernière mise à jour: Novembre 2025*
*Guide rédigé par la communauté Kick Flight*
