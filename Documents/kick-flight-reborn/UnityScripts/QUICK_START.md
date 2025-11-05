# 🚀 Démarrage Rapide - Kick Flight: Reborn

## Installation Rapide (5 minutes)

### 1. Vérifier Unity Hub
```bash
# Ouvrir Unity Hub (devrait être installé maintenant)
open /Applications/Unity\ Hub.app
```

### 2. Installer Unity 2022.3 LTS

Dans Unity Hub:
1. Cliquer sur "Installs" (à gauche)
2. Cliquer sur "Install Editor"
3. Choisir **Unity 2022.3 LTS** (version stable recommandée)
4. Ajouter les modules:
   - ✅ **Android Build Support**
   - ✅ **iOS Build Support** 
   - ✅ **WebGL Build Support**
   - ✅ **Documentation**

### 3. Créer le Projet Unity

1. Dans Unity Hub, cliquer sur "Projects"
2. Cliquer sur "New Project"
3. Configuration:
   - **Template**: 3D (URP) ← IMPORTANT !
   - **Project Name**: KickFlightReborn
   - **Location**: `~/Documents/kick-flight-reborn/UnityProject`
4. Cliquer sur "Create Project"

### 4. Attendre l'ouverture du projet (2-3 minutes)

Unity va:
- Créer la structure du projet
- Importer les packages par défaut
- Compiler les shaders

## 🎮 Configuration Initiale (5 minutes)

### Étape 1: Installer les Packages Essentiels

Dans Unity, aller dans `Window > Package Manager`:

1. **Netcode for GameObjects** (Multijoueur)
   - Registry: Unity Registry
   - Chercher: "Netcode for GameObjects"
   - Cliquer sur "Install"

2. **Input System** (Contrôles modernes)
   - Chercher: "Input System"
   - Cliquer sur "Install"
   - Accepter le redémarrage quand demandé

3. **Cinemachine** (Caméra dynamique)
   - Chercher: "Cinemachine"
   - Cliquer sur "Install"

### Étape 2: Créer la Structure de Dossiers

Dans Unity, panneau "Project":

Créer ces dossiers dans `Assets/`:
```
Assets/
├── _Project/
│   ├── Art/
│   │   ├── Characters/
│   │   ├── Environments/
│   │   ├── Effects/
│   │   └── Materials/
│   ├── Audio/
│   │   ├── Music/
│   │   └── SFX/
│   ├── Prefabs/
│   │   ├── Characters/
│   │   ├── Environment/
│   │   └── UI/
│   ├── Scenes/
│   ├── Scripts/
│   │   ├── Core/
│   │   ├── Player/
│   │   ├── Movement/
│   │   ├── Combat/
│   │   ├── Network/
│   │   └── UI/
│   └── Settings/
```

**Raccourci**: Clic droit dans Project > Create > Folder

### Étape 3: Importer les Scripts

1. Copier les 3 scripts que j'ai créés:
   - `AerialMovement.cs`
   - `CombatSystem.cs`
   - `KickerHealth.cs`

2. Les placer dans:
   - `AerialMovement.cs` → `Assets/_Project/Scripts/Movement/`
   - `CombatSystem.cs` → `Assets/_Project/Scripts/Combat/`
   - `KickerHealth.cs` → `Assets/_Project/Scripts/Player/`

### Étape 4: Configurer le Projet pour Mobile

`Edit > Project Settings`:

**Player Settings**:
```
Company Name: Kick Flight Community
Product Name: Kick Flight Reborn
Default Orientation: Landscape
Color Space: Linear
```

**Quality Settings**:
```
Anti Aliasing: 2x Multi Sampling
VSync: 1
Target Frame Rate: 60
```

**Physics Settings**:
```
Gravity Y: -15
Fixed Timestep: 0.02
```

## 🎯 Créer le Premier Prototype (10 minutes)

### 1. Créer la Scène de Test

1. `File > New Scene`
2. Template: "Basic (URP)"
3. `File > Save As`: `Assets/_Project/Scenes/TestArena.unity`

### 2. Créer le Sol/Arène

1. Clic droit dans Hierarchy > 3D Object > Plane
2. Renommer: "Arena Floor"
3. Scale: (10, 1, 10)
4. Position: (0, 0, 0)

### 3. Créer le Joueur Prototype

1. Clic droit dans Hierarchy > 3D Object > Capsule
2. Renommer: "Player"
3. Position: (0, 2, 0)
4. Ajouter les composants:
   - `Add Component` > Physics > Rigidbody
   - `Add Component` > Scripts > Aerial Movement
   - `Add Component` > Scripts > Combat System
   - `Add Component` > Scripts > Kicker Health

### 4. Configurer les Inputs

1. `Assets > Create > Input Actions`
2. Nommer: "KickerControls"
3. Double-cliquer pour ouvrir l'éditeur
4. Créer les actions:

```
Action Maps: Player
  - Movement (Value, Vector2) → WASD/Left Stick
  - Look (Value, Vector2) → Mouse/Right Stick
  - Kick (Button) → Left Click/South Button
  - Boost (Button) → Left Shift/West Button
  - Dash (Button) → Space/East Button
```

5. Cliquer sur "Generate C# Class"
6. Sauvegarder

### 5. Lier les Inputs au Joueur

1. Sélectionner "Player"
2. `Add Component` > Player Input
3. Actions: Assigner "KickerControls"
4. Default Map: Player
5. Behavior: Invoke Unity Events

### 6. Configurer la Caméra

1. Sélectionner "Main Camera"
2. Position: (0, 5, -10)
3. Rotation: (20, 0, 0)
4. Ou utiliser Cinemachine pour une caméra qui suit

### 7. Tester le Jeu !

1. Cliquer sur le bouton **Play** (▶️) en haut
2. Tester les contrôles:
   - **WASD**: Mouvement
   - **Souris**: Rotation
   - **Shift**: Boost
   - **Space**: Dash
   - **Clic gauche**: Kick

## 🌐 Activer le Multijoueur (5 minutes)

### 1. Créer le Network Manager

1. Clic droit dans Hierarchy > Create Empty
2. Renommer: "NetworkManager"
3. `Add Component` > Netcode > NetworkManager
4. Configuration:
   - Transport: Unity Transport
   - Player Prefab: (on le créera après)

### 2. Transformer le Joueur en Prefab Réseau

1. Sélectionner "Player" dans Hierarchy
2. `Add Component` > Netcode > NetworkObject
3. Drag "Player" dans `Assets/_Project/Prefabs/Characters/`
4. Supprimer "Player" de la Hierarchy
5. Assigner le prefab "Player" au Network Manager > Player Prefab

### 3. Créer l'UI de Connexion Basique

1. Clic droit dans Hierarchy > UI > Canvas
2. Ajouter 2 boutons:
   - "Host" → Appelle `NetworkManager.Singleton.StartHost()`
   - "Join" → Appelle `NetworkManager.Singleton.StartClient()`

### 4. Tester en Local

1. Play
2. Cliquer sur "Host"
3. Build > Build and Run pour créer un deuxième client
4. Dans le build, cliquer sur "Join"

## 🎨 Améliorer Visuellement (15 minutes)

### 1. Matériaux Basiques

Créer des matériaux dans `Assets/_Project/Art/Materials/`:
- `Mat_Player` (Bleu)
- `Mat_Enemy` (Rouge)
- `Mat_Arena` (Gris)

### 2. Lighting

`Window > Rendering > Lighting`:
- Skybox: Choisir un skybox ou créer gradient
- Environment Lighting: Skybox
- Realtime GI: On

### 3. Post-Processing

1. `Assets > Create > Rendering > URP Post-Process Volume Profile`
2. Ajouter effets:
   - Bloom
   - Color Grading
   - Vignette

### 4. Particules pour les Attaques

1. Clic droit > Effects > Particle System
2. Configurer pour ressembler à un kick effect
3. Sauvegarder comme prefab
4. Assigner au CombatSystem

## 📝 Avec Claude Code

Maintenant que tout est configuré, vous pouvez utiliser Claude Code:

```bash
cd ~/Documents/kick-flight-reborn
claude chat
```

Exemples de commandes:
```
"Crée un système de collecte de cristaux"
"Ajoute des power-ups dans l'arène"
"Implémente un système de score pour les matchs 4v4"
"Crée un menu principal avec sélection de personnage"
"Optimise le code pour mobile"
"Ajoute des effets de particules pour le boost"
```

## 🎯 Checklist de Progression

- [ ] Unity installé et projet créé
- [ ] Packages Netcode, Input System installés
- [ ] Structure de dossiers créée
- [ ] Scripts de base importés
- [ ] Scène de test créée
- [ ] Joueur prototype fonctionnel
- [ ] Contrôles configurés
- [ ] Test du mouvement aérien réussi
- [ ] Network Manager configuré
- [ ] Test multijoueur local réussi

## 🚨 Problèmes Courants

**Erreur: "Input System not found"**
→ Redémarrer Unity après installation du Input System

**Le joueur tombe à travers le sol**
→ Vérifier que le Plane a un Collider

**Pas de mouvement**
→ Vérifier que Player Input est bien lié au script

**Netcode ne fonctionne pas**
→ Vérifier que tous les GameObjects ont NetworkObject

## 📚 Ressources

- [Documentation complète](./UNITY_SETUP_GUIDE.md)
- [Unity Learn](https://learn.unity.com)
- [Netcode Docs](https://docs-multiplayer.unity3d.com)

## 🎮 C'est Parti !

Vous êtes maintenant prêt à développer Kick Flight: Reborn !

**Prochaines étapes suggérées:**
1. Créer plus de Kickers avec des capacités uniques
2. Designer des arènes verticales intéressantes
3. Implémenter le système de cristaux
4. Ajouter des animations
5. Créer l'UI complète
6. Tester et équilibrer le gameplay

**Bon développement ! 🚀**
