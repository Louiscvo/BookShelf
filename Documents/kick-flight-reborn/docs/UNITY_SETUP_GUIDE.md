# ⚙️ Unity Setup Guide - Kick Flight: Reborn

Guide complet pour configurer Unity et démarrer le développement de Kick Flight: Reborn.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation Unity](#installation-unity)
3. [Création du Projet](#création-du-projet)
4. [Installation des Packages](#installation-des-packages)
5. [Structure des Dossiers](#structure-des-dossiers)
6. [Configuration Project Settings](#configuration-project-settings)
7. [Configuration URP](#configuration-urp)
8. [Setup Input System](#setup-input-system)
9. [Import des Scripts](#import-des-scripts)
10. [Création de la Scène de Test](#création-de-la-scène-de-test)
11. [Vérification & Tests](#vérification--tests)

---

## 🎯 Prérequis

### Système Requis

**Minimum:**
- OS: macOS 10.14+, Windows 10, Linux Ubuntu 18.04+
- CPU: Intel Core i5 ou équivalent
- RAM: 8 GB
- GPU: Support DirectX 11/Metal/Vulkan
- Stockage: 10 GB libre

**Recommandé:**
- RAM: 16 GB+
- GPU: Carte graphique dédiée
- SSD pour le projet

### Logiciels

- **Unity Hub**: Version récente
- **Unity 2022.3 LTS** (sera installé via Hub)
- **Git**: Pour version control
- **Code Editor** (au choix):
  - Visual Studio Code (recommandé)
  - Visual Studio 2022
  - Rider

---

## 🔧 Installation Unity

### 1. Installer Unity Hub

**macOS:**
```bash
# Via Homebrew
brew install --cask unity-hub

# OU télécharger depuis:
# https://unity.com/download
```

**Windows:**
```
Télécharger depuis: https://unity.com/download
Installer normalement
```

### 2. Installer Unity 2022.3 LTS

1. Ouvrir Unity Hub
2. Aller dans **Installs** (barre latérale)
3. Cliquer **Install Editor**
4. Sélectionner **2022.3 LTS** (version la plus récente 2022.3.x)
5. Cliquer **Continue**

### 3. Modules à Installer

Cocher les modules suivants:

**Obligatoires:**
- ✅ **Dev Tools**
  - Microsoft Visual Studio Community (ou VS Code)
- ✅ **Platforms**
  - macOS Build Support (si sur Mac)
  - Windows Build Support (si sur Windows)
  - iOS Build Support (pour build mobile future)
  - Android Build Support (+ OpenJDK + SDK & NDK)

**Optionnels:**
- Documentation (recommandé pour offline)
- Language packs (Français si désiré)

### 4. Lancer l'Installation

- Cliquer **Continue**
- Accepter les licences
- Attendre installation (15-30 minutes)

---

## 📁 Création du Projet

### Option 1: Nouveau Projet

1. Ouvrir Unity Hub
2. Aller dans **Projects**
3. Cliquer **New Project**

**Configuration:**
```
Editor Version: 2022.3.x LTS
Template: 3D (URP) - Universal Render Pipeline
Project Name: KickFlightReborn
Location: /Users/[votre-username]/Documents/kick-flight-reborn/UnityProject
```

4. Cliquer **Create Project**
5. Attendre le premier lancement (2-5 minutes)

### Option 2: Cloner depuis Git

```bash
cd ~/Documents
git clone https://github.com/[repo]/kick-flight-reborn.git
cd kick-flight-reborn/UnityProject

# Ouvrir dans Unity Hub
# Add > Sélectionner le dossier UnityProject/
```

---

## 📦 Installation des Packages

### Via Package Manager

1. Dans Unity, aller à **Window > Package Manager**
2. En haut à gauche, sélectionner **Unity Registry**

### Packages Essentiels

#### 1. Netcode for GameObjects

```
1. Dans Package Manager
2. Chercher "Netcode for GameObjects"
3. Cliquer Install
4. Version: 1.7.0 ou supérieure
```

**Alternative (via Git URL):**
```
Window > Package Manager > + > Add package from git URL
https://github.com/Unity-Technologies/com.unity.netcode.gameobjects.git
```

#### 2. Input System

```
1. Package Manager
2. Chercher "Input System"
3. Install
4. Accepter le redémarrage de l'éditeur
```

**Configuration après install:**
```
Edit > Project Settings > Player
└─> Active Input Handling: Input System Package (New)
```

#### 3. Cinemachine

```
1. Package Manager
2. Chercher "Cinemachine"
3. Install
4. Version: 2.9.0+
```

#### 4. TextMeshPro

**Normalement pré-installé avec URP template**

Si absent:
```
Package Manager > TextMeshPro > Install
```

Import TMP Essentials:
```
Window > TextMeshPro > Import TMP Essential Resources
```

#### 5. ProBuilder (Optionnel mais recommandé)

```
1. Package Manager
2. Chercher "ProBuilder"
3. Install
```

Utile pour level design et prototyping rapide.

### Liste Complète des Packages

Au final, vous devez avoir:

| Package | Version | Status |
|---------|---------|--------|
| Universal RP | 14.0.x | ✅ Pre-installed |
| Netcode for GameObjects | 1.7.0+ | 🔧 À installer |
| Input System | 1.7.0+ | 🔧 À installer |
| Cinemachine | 2.9.0+ | 🔧 À installer |
| TextMeshPro | 3.0.6+ | ✅ Pre-installed |
| ProBuilder | 5.0.0+ | 🔧 Optionnel |

---

## 📂 Structure des Dossiers

### Créer la Structure

**Via l'éditeur Unity:**

Clic droit dans Project > Create > Folder

**OU via script:**

Créer un fichier `Editor/CreateFolderStructure.cs`:

```csharp
using UnityEditor;
using UnityEngine;
using System.IO;

public class CreateFolderStructure
{
    [MenuItem("Tools/Setup/Create Folder Structure")]
    public static void CreateFolders()
    {
        string[] folders = new string[]
        {
            "Assets/_Project",
            "Assets/_Project/Art",
            "Assets/_Project/Art/Characters",
            "Assets/_Project/Art/Environments",
            "Assets/_Project/Art/Effects",
            "Assets/_Project/Art/Materials",
            "Assets/_Project/Audio",
            "Assets/_Project/Audio/Music",
            "Assets/_Project/Audio/SFX",
            "Assets/_Project/Prefabs",
            "Assets/_Project/Prefabs/Characters",
            "Assets/_Project/Prefabs/Environment",
            "Assets/_Project/Prefabs/UI",
            "Assets/_Project/Scenes",
            "Assets/_Project/Scripts",
            "Assets/_Project/Scripts/Core",
            "Assets/_Project/Scripts/Player",
            "Assets/_Project/Scripts/Movement",
            "Assets/_Project/Scripts/Combat",
            "Assets/_Project/Scripts/Network",
            "Assets/_Project/Scripts/UI",
            "Assets/_Project/Scripts/Camera",
            "Assets/_Project/Scripts/Utilities",
            "Assets/_Project/Settings",
            "Assets/_Project/Settings/InputActions",
            "Assets/_Project/Settings/URP",
            "Assets/_Project/ScriptableObjects",
            "Assets/_Project/ScriptableObjects/Kickers",
            "Assets/_Project/ScriptableObjects/Arenas",
        };

        foreach (string folder in folders)
        {
            if (!Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
                Debug.Log($"Created: {folder}");
            }
        }

        AssetDatabase.Refresh();
        Debug.Log("✅ Folder structure created!");
    }
}
```

**Exécuter:**
```
Tools > Setup > Create Folder Structure
```

### Structure Finale

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
│   │   ├── UI/
│   │   ├── Camera/
│   │   └── Utilities/
│   ├── Settings/
│   │   ├── InputActions/
│   │   └── URP/
│   └── ScriptableObjects/
│       ├── Kickers/
│       └── Arenas/
└── (Packages, Settings générés auto)
```

---

## ⚙️ Configuration Project Settings

### 1. Player Settings

**Edit > Project Settings > Player**

#### Quality & Graphics

```
Company Name: Kick Flight Community
Product Name: Kick Flight Reborn
Version: 0.1.0
Default Icon: [À ajouter plus tard]

Resolution and Presentation:
├─ Default Orientation: Landscape
├─ Allowed Orientations: Landscape Left/Right
└─ Run In Background: ✅ (pour multijoueur)

Other Settings:
├─ Color Space: Linear ⚠️ IMPORTANT
├─ Auto Graphics API: ❌
├─ Graphics APIs:
│   ├─ iOS: Metal
│   ├─ Android: Vulkan, OpenGLES3
│   └─ Standalone: DirectX 11, Vulkan
├─ Multithreaded Rendering: ✅
└─ Static Batching: ✅
```

#### Scripting

```
Scripting Backend:
├─ Standalone/Mobile: IL2CPP (pour performance)
└─ Editor: Mono (plus rapide pour iteration)

Api Compatibility Level: .NET Standard 2.1

Active Input Handling: Input System Package (New)
```

### 2. Quality Settings

**Edit > Project Settings > Quality**

Créer 3 presets: **Low, Medium, High**

**High (Desktop):**
```
Anti Aliasing: 2x MSAA
Texture Quality: Full Res
Shadow Quality: Soft Shadows
Shadow Resolution: Very High
Shadow Distance: 100
Shadow Cascades: 4
V Sync: On
Target Frame Rate: 60
```

**Medium (High-end Mobile):**
```
Anti Aliasing: 2x MSAA
Texture Quality: Full Res
Shadow Quality: Soft Shadows
Shadow Resolution: High
Shadow Distance: 50
Shadow Cascades: 2
V Sync: Off
Target Frame Rate: 60
```

**Low (Low-end Mobile):**
```
Anti Aliasing: Off
Texture Quality: Half Res
Shadow Quality: Hard Shadows
Shadow Resolution: Medium
Shadow Distance: 30
Shadow Cascades: 1
V Sync: Off
Target Frame Rate: 30
```

### 3. Physics Settings

**Edit > Project Settings > Physics**

```
Gravity:
├─ Y: -15 (plus fort que réel pour arcade feel)
└─ X, Z: 0

Default Solver Iterations: 8
Default Solver Velocity Iterations: 2

Queries Hit Triggers: ✅ (pour cristaux)

Layer Collision Matrix:
├─ Player x Player: ✅ (pour collisions)
├─ Player x Environment: ✅
├─ Player x Collectible: ✅ (trigger)
└─ Projectile x Player: ✅
```

**Layers à créer:**
```
Layer 6: Player
Layer 7: Environment
Layer 8: Collectible
Layer 9: Projectile
Layer 10: Ignore Raycast (déjà existe)
```

### 4. Time Settings

**Edit > Project Settings > Time**

```
Fixed Timestep: 0.02 (50 Hz - bon pour physics)
Maximum Allowed Timestep: 0.1
Time Scale: 1
```

### 5. Tags & Layers

**Edit > Project Settings > Tags and Layers**

**Tags:**
```
- Player
- Enemy
- Crystal
- SpawnPoint
- DeathZone
```

**Sorting Layers:**
```
- Default
- Background
- Gameplay
- UI
- Overlay
```

---

## 🎨 Configuration URP

### 1. Créer URP Asset

Si pas déjà créé avec le template:

```
Assets > Create > Rendering > URP Asset (with Universal Renderer)

Nom: UniversalRP-HighQuality
Location: Assets/_Project/Settings/URP/
```

### 2. Assigner URP Asset

```
Edit > Project Settings > Graphics
└─> Scriptable Render Pipeline Settings: [Glisser votre URP Asset]
```

### 3. Configuration URP Asset

**General:**
```
Rendering:
├─ Depth Texture: ✅ (pour effets)
├─ Opaque Texture: ✅ (pour transparency)
└─ Opaque Downsampling: None

Quality:
├─ HDR: ✅
└─ Anti Aliasing (MSAA): 2x (pour mobile balance)

Lighting:
├─ Main Light: Per Pixel
├─ Cast Shadows: ✅
├─ Shadow Resolution: 2048
└─ Additional Lights: Per Pixel, Max: 4

Post-processing: ✅ (pour polish visuel)
```

### 4. Créer Renderer Features (Optionnel)

Pour effets avancés plus tard:
```
Project > URP Asset > Renderer List > Universal Renderer
└─> Add Renderer Feature > [Choisir selon besoin]
```

---

## 🎮 Setup Input System

### 1. Créer Input Actions Asset

```
Assets/_Project/Settings/InputActions/ (clic droit)
└─> Create > Input Actions

Nom: KickerControls
```

### 2. Configurer les Actions

Double-cliquer sur `KickerControls` pour ouvrir l'éditeur.

**Action Maps:**

#### Player (Action Map)

**Actions:**

| Action | Type | Control Type |
|--------|------|--------------|
| Movement | Value | Vector2 |
| Look | Value | Vector2 |
| Kick | Button | Button |
| Boost | Button | Button |
| Dash | Button | Button |
| Ability1 | Button | Button |
| Ability2 | Button | Button |
| Ultimate | Button | Button |

**Bindings:**

**Movement:**
```
- WASD Composite (Keyboard)
  ├─ Up: W
  ├─ Down: S
  ├─ Left: A
  └─ Right: D
- Left Stick (Gamepad)
```

**Look:**
```
- Mouse Delta (Mouse)
- Right Stick (Gamepad)
```

**Kick:**
```
- Left Mouse Button
- South Button (Gamepad - A/Cross)
```

**Boost:**
```
- Left Shift (Keyboard)
- West Button (Gamepad - X/Square)
```

**Dash:**
```
- Space (Keyboard)
- East Button (Gamepad - B/Circle)
```

**Ability1:**
```
- Q (Keyboard)
- North Button (Gamepad - Y/Triangle)
```

**Ability2:**
```
- E (Keyboard)
- D-Pad Right (Gamepad)
```

**Ultimate:**
```
- R (Keyboard)
- L1 + R1 (Gamepad)
```

### 3. Générer C# Class

```
Dans Input Actions Editor:
├─> Cocher "Generate C# Class"
├─> Path: Assets/_Project/Scripts/
├─> Class Name: KickerControls
└─> Namespace: KickFlight
```

Cliquer **Apply**

### 4. Exemple d'Utilisation

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerInput : MonoBehaviour
{
    private KickerControls _controls;

    private void Awake()
    {
        _controls = new KickerControls();
    }

    private void OnEnable()
    {
        _controls.Enable();
        _controls.Player.Kick.performed += OnKick;
    }

    private void OnDisable()
    {
        _controls.Player.Kick.performed -= OnKick;
        _controls.Disable();
    }

    private void Update()
    {
        Vector2 movement = _controls.Player.Movement.ReadValue<Vector2>();
        Vector2 look = _controls.Player.Look.ReadValue<Vector2>();

        // Use movement and look...
    }

    private void OnKick(InputAction.CallbackContext context)
    {
        Debug.Log("Kick performed!");
    }
}
```

---

## 📜 Import des Scripts

### 1. Copier les Scripts

Les scripts sont dans `/kick-flight-reborn/UnityScripts/`

**À copier dans Unity:**
```
UnityScripts/Movement/AerialMovement.cs
  └─> Assets/_Project/Scripts/Movement/

UnityScripts/Combat/CombatSystem.cs
  └─> Assets/_Project/Scripts/Combat/

UnityScripts/Player/KickerHealth.cs
  └─> Assets/_Project/Scripts/Player/
```

### 2. Vérifier la Compilation

```
Console (Ctrl/Cmd + Shift + C)
└─> Aucune erreur doit apparaître
```

Si erreurs:
- Vérifier que Netcode est installé
- Vérifier que Input System est installé
- Vérifier les namespaces

---

## 🎬 Création de la Scène de Test

### 1. Créer la Scène

```
File > New Scene
Template: Basic (Built-in) - on va setup manuellement

Save as: Assets/_Project/Scenes/TestArena.unity
```

### 2. Setup Environnement

**Créer le Sol:**
```
Hierarchy (clic droit) > 3D Object > Plane
Nom: Ground
Scale: (20, 1, 20)
Position: (0, 0, 0)
```

**Créer des Obstacles:**
```
Hierarchy > 3D Object > Cube
Nom: Obstacle
Scale: (2, 5, 2)
Position: (5, 2.5, 5)

Dupliquer (Ctrl/Cmd + D) plusieurs fois pour créer une arène
```

**Lighting:**
```
Window > Rendering > Lighting

Skybox: Default (ou importer un Skybox plus joli)
Environment Lighting: Skybox
Environment Reflections: Skybox

Generate Lighting (en bas)
```

### 3. Créer le Player Prefab

```
Hierarchy > Create Empty
Nom: Player

Add Component:
├─ Character Controller
│   ├─ Height: 2
│   ├─ Radius: 0.5
│   └─ Center: (0, 1, 0)
├─ AerialMovement (script)
├─ KickerHealth (script)
├─ CombatSystem (script)
└─ NetworkObject (Netcode)

Enfants:
└─> Create > 3D Object > Capsule
    ├─ Nom: Visual
    ├─ Position: (0, 0, 0)
    └─ Remove Capsule Collider
```

**Sauvegarder en Prefab:**
```
Glisser Player depuis Hierarchy vers:
Assets/_Project/Prefabs/Characters/Player.prefab
```

### 4. Setup Caméra

```
Main Camera:
├─ Position: (0, 10, -10)
├─ Rotation: (45, 0, 0)
└─ Add Cinemachine Brain component

Create > Cinemachine > Virtual Camera
Nom: PlayerCamera
Follow: [Glisser Player]
Look At: [Glisser Player]
```

### 5. Configurer Network Manager

```
Hierarchy > Create Empty
Nom: NetworkManager

Add Component:
└─> Unity Transport (Netcode)
    └─> Port: 7777

Add Component:
└─> Network Manager
    └─> Player Prefab: [Glisser Player prefab]
```

---

## ✅ Vérification & Tests

### Checklist de Vérification

- [ ] Unity 2022.3 LTS installé
- [ ] Projet créé avec template 3D (URP)
- [ ] Tous les packages installés
- [ ] Structure de dossiers créée
- [ ] Project Settings configuré
  - [ ] Color Space: Linear
  - [ ] Input System activé
  - [ ] Layers créés
- [ ] URP Asset créé et assigné
- [ ] Input Actions créé
- [ ] Scripts importés sans erreur
- [ ] Scène de test créée
- [ ] Player prefab créé

### Test de Base

**Test 1: Mouvement**
```
1. Play mode
2. WASD pour bouger
3. Mouse pour regarder
4. Shift pour boost
5. Space pour dash
```

**Test 2: Combat**
```
1. Créer 2 players dans la scène (pour test)
2. Left Click pour kick
3. Vérifier les dégâts dans l'Inspector
```

**Test 3: Réseau (Local)**
```
1. Build & Run (pour créer un executable)
2. Lancer l'executable
3. Dans Unity Editor, Play
4. Un instance = Host, l'autre = Client
5. Test multijoueur local
```

---

## 🐛 Troubleshooting

### Problèmes Courants

**"Input System package required"**
```
Solution:
Edit > Project Settings > Player
└─> Active Input Handling: Input System Package (New)
Redémarrer Unity
```

**"NetworkBehaviour not found"**
```
Solution:
Window > Package Manager
└─> Installer Netcode for GameObjects
```

**"Scene est trop sombre"**
```
Solution:
Window > Rendering > Lighting
└─> Generate Lighting
```

**"Player tombe à l'infini"**
```
Solution:
Vérifier que le Ground a un Collider
Vérifier que Physics layers sont corrects
```

---

## 🚀 Prochaines Étapes

Après cette configuration:

1. ✅ Lire [QUICK_START.md](QUICK_START.md) pour créer votre premier prototype
2. ✅ Consulter [ARCHITECTURE.md](ARCHITECTURE.md) pour comprendre le design
3. ✅ Rejoindre la communauté Discord
4. ✅ Contribuer au projet !

---

## 📚 Ressources

- [Unity Learn](https://learn.unity.com/) - Tutoriels officiels
- [Netcode Docs](https://docs-multiplayer.unity3d.com/) - Documentation réseau
- [Input System Manual](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.7/manual/index.html)
- [URP Documentation](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@14.0/manual/index.html)

---

**Guide rédigé par la communauté Kick Flight: Reborn**
**Dernière mise à jour: Novembre 2025**
