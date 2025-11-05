# ⚙️ Unity Configuration Steps - Kick Flight: Reborn

Guide étape par étape pour configurer Unity après création du projet.

---

## 📋 Ordre des Opérations

```
1. Créer le projet Unity
2. Installer les packages
3. Configurer Project Settings
4. Créer la structure de dossiers
5. Créer Input Actions
6. Importer les scripts
7. Créer la scène de test
8. Tester
```

---

## Étape 1: Créer le Projet Unity

### Dans Unity Hub

```
Projects > New Project

Configuration:
├─ Editor Version: 2022.3.x LTS
├─ Template: 3D (URP) ⚠️ IMPORTANT
├─ Project Name: KickFlightReborn
└─ Location: ~/Documents/kick-flight-reborn/UnityProject
```

Cliquer **Create Project** et attendre (2-5 minutes).

---

## Étape 2: Installer les Packages

### 2.1 Ouvrir Package Manager

```
Window > Package Manager
```

### 2.2 Netcode for GameObjects

```
1. En haut à gauche: Unity Registry
2. Chercher: "Netcode for GameObjects"
3. Cliquer sur le package
4. Cliquer Install
5. Attendre installation (30s-1min)
```

**Vérification:**
- Console: Aucune erreur
- Package Manager > In Project: Netcode visible

### 2.3 Input System

```
1. Unity Registry
2. Chercher: "Input System"
3. Install
4. Popup apparaît: "Backend change required"
   └─> Cliquer "Yes" (va redémarrer Unity)
5. Unity redémarre (1-2 min)
```

**Vérification:**
```
Edit > Project Settings > Player > Other Settings
└─> Active Input Handling: Input System Package (New) ✅
```

### 2.4 Cinemachine

```
1. Unity Registry
2. Chercher: "Cinemachine"
3. Install
```

### 2.5 TextMeshPro (Normalement pré-installé)

**Si pas installé:**
```
1. Unity Registry
2. Chercher: "TextMeshPro"
3. Install
```

**Import essentials:**
```
Window > TextMeshPro > Import TMP Essential Resources
Cliquer Import
```

---

## Étape 3: Configurer Project Settings

### 3.1 Player Settings

```
Edit > Project Settings > Player
```

**Company & Product:**
```
Company Name: Kick Flight Community
Product Name: Kick Flight Reborn
Version: 0.1.0
```

**Resolution and Presentation:**
```
Standalone:
├─ Default Screen Width: 1920
├─ Default Screen Height: 1080
└─ Run In Background: ✅

Mobile (iOS/Android):
├─ Default Orientation: Landscape
├─ Allowed Orientations:
│   ├─ Landscape Left: ✅
│   └─ Landscape Right: ✅
└─> Auto Rotation: ✅
```

**Other Settings:**

**Rendering:**
```
Color Space: Linear ⚠️ TRÈS IMPORTANT
(Si "Gamma", changer à Linear et attendre re-import)

Auto Graphics API: ❌ (décocher)

Graphics APIs:
├─ Windows: DirectX 11, Vulkan
├─ macOS: Metal
├─ iOS: Metal
└─ Android: Vulkan, OpenGLES3

Multithreaded Rendering: ✅
Static Batching: ✅
Dynamic Batching: ✅
```

**Identification:**
```
Package Name: com.kickflight.reborn
(Format: com.companyname.productname)

Version: 0.1.0
```

**Configuration:**
```
Scripting Backend:
├─ Standalone: Mono (pour dev) ou IL2CPP (pour release)
├─ iOS: IL2CPP
└─ Android: IL2CPP

Api Compatibility Level: .NET Standard 2.1
```

### 3.2 Quality Settings

```
Edit > Project Settings > Quality
```

**Créer 3 presets (ou utiliser existants):**

**Low (Mobile bas de gamme):**
```
Anti Aliasing: Disabled
Texture Quality: Eighth Res
Shadow Quality: Disable Shadows
Shadow Resolution: Low
Shadow Distance: 20
V Sync: Don't Sync
Target Frame Rate: 30
```

**Medium (Mobile milieu de gamme):**
```
Anti Aliasing: 2x Multi Sampling
Texture Quality: Half Res
Shadow Quality: Hard Shadows
Shadow Resolution: Medium
Shadow Distance: 50
Shadow Cascades: Two Cascades
V Sync: Don't Sync
Target Frame Rate: 60
```

**High (Desktop/Mobile haut de gamme):**
```
Anti Aliasing: 2x Multi Sampling
Texture Quality: Full Res
Shadow Quality: Soft Shadows
Shadow Resolution: Very High
Shadow Distance: 100
Shadow Cascades: Four Cascades
V Sync: Every V Blank
Target Frame Rate: 60
```

**Set Default:**
```
Standalone: High
Mobile: Medium
```

### 3.3 Physics Settings

```
Edit > Project Settings > Physics
```

**Gravity:**
```
X: 0
Y: -15  ⚠️ (Plus fort que réel pour arcade gameplay)
Z: 0
```

**Solver:**
```
Default Solver Iterations: 8
Default Solver Velocity Iterations: 2
Bounce Threshold: 2
Sleep Threshold: 0.005
Default Contact Offset: 0.01
```

**Queries:**
```
Queries Hit Triggers: ✅
Queries Hit Backfaces: ❌
```

**Layer Collision Matrix:**
```
(On va configurer après avoir créé les layers)
```

### 3.4 Time Settings

```
Edit > Project Settings > Time
```

```
Fixed Timestep: 0.02 (50 Hz pour physics)
Maximum Allowed Timestep: 0.1
Time Scale: 1
Maximum Particle Timestep: 0.03
```

### 3.5 Tags & Layers

```
Edit > Project Settings > Tags and Layers
```

**Tags (cliquer +):**
```
- Player
- Enemy
- Crystal
- SpawnPoint
- Projectile
- DeathZone
```

**Layers:**
```
Layer 6: Player
Layer 7: Environment
Layer 8: Collectible
Layer 9: Projectile
Layer 10: UI (ou utiliser built-in)
```

**Retourner aux Physics Settings:**
```
Edit > Project Settings > Physics
└─> Layer Collision Matrix:
    Configure interactions:

    Player x Player: ✅ (collision entre joueurs)
    Player x Environment: ✅
    Player x Collectible: ✅
    Player x Projectile: ✅

    Projectile x Environment: ✅
    Projectile x Player: ✅
    Projectile x Collectible: ❌

    Collectible x Everything: ❌ (sauf Player, en trigger)
```

### 3.6 Graphics Settings

```
Edit > Project Settings > Graphics
```

**Scriptable Render Pipeline Settings:**
```
Devrait déjà être assigné si template URP utilisé
Si vide: Assets/Settings/UniversalRP-HighQuality

(Si pas de URP Asset, voir section URP ci-dessous)
```

**Transparency Sort Mode:** Orthographic (ou Default)

---

## Étape 4: Configuration URP (Universal Render Pipeline)

### 4.1 Vérifier/Créer URP Asset

**Si template URP utilisé:** Déjà créé dans `Assets/Settings/`

**Si pas présent, créer:**
```
Assets > Create > Rendering > URP Asset (with Universal Renderer)

Nom: UniversalRP-HighQuality
Location: Assets/_Project/Settings/URP/
```

### 4.2 Assigner URP Asset

```
Edit > Project Settings > Graphics
└─> Scriptable Render Pipeline Settings: [Glisser URP Asset]
```

### 4.3 Configurer URP Asset

**Sélectionner le URP Asset, Inspector:**

**General:**
```
Depth Texture: ✅
Opaque Texture: ✅
Opaque Downsampling: None
```

**Quality:**
```
HDR: ✅
MSAA: 2x (bon compromis mobile/quality)
Render Scale: 1
```

**Lighting:**
```
Main Light:
├─ Mode: Per Pixel
└─ Cast Shadows: ✅

Additional Lights:
├─ Mode: Per Pixel
├─ Per Object Limit: 4
└─ Cast Shadows: ❌ (pour performance)

Shadow Settings:
├─ Max Distance: 50
├─ Cascade Count: 2 (mobile) ou 4 (desktop)
└─> Working Unit: Metric
```

**Shadows:**
```
Main Light:
├─ Shadow Resolution: 2048
├─ Soft Shadows: ✅
└─ Depth Bias: 1

Additional Lights:
└─ Shadow Resolution: 512
```

**Post-processing:**
```
Post Processing: ✅ (pour effets visuels)
```

---

## Étape 5: Créer la Structure de Dossiers

### Méthode Manuelle (Recommandée pour comprendre)

Dans le Project panel, créer:

```
Assets/
└─ _Project/                    (dossier racine)
   ├─ Art/
   │  ├─ Characters/
   │  ├─ Environments/
   │  ├─ Effects/
   │  └─ Materials/
   ├─ Audio/
   │  ├─ Music/
   │  └─ SFX/
   ├─ Prefabs/
   │  ├─ Characters/
   │  ├─ Environment/
   │  └─ UI/
   ├─ Scenes/
   ├─ Scripts/
   │  ├─ Core/
   │  ├─ Player/
   │  ├─ Movement/
   │  ├─ Combat/
   │  ├─ Network/
   │  ├─ UI/
   │  ├─ Camera/
   │  └─ Utilities/
   ├─ Settings/
   │  ├─ InputActions/
   │  └─ URP/
   └─ ScriptableObjects/
      ├─ Kickers/
      └─ Arenas/
```

**Processus:**
```
Project panel (onglet en bas)
└─> Clic droit dans Assets
    └─> Create > Folder
        └─> Nom: _Project

Puis répéter pour chaque sous-dossier
```

### Méthode Automatique (Via Script)

**Créer le script:**
```
Assets > Create > Folder: "Editor"
Dans Editor > Create > C# Script: "SetupProject"
```

**Contenu du script:**
```csharp
using UnityEditor;
using UnityEngine;
using System.IO;

public class SetupProject
{
    [MenuItem("Tools/Setup/Create Folder Structure")]
    public static void CreateFolderStructure()
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
        Debug.Log("✅ Folder structure created successfully!");
    }
}
```

**Exécuter:**
```
Top menu > Tools > Setup > Create Folder Structure
```

---

## Étape 6: Créer Input Actions

### 6.1 Créer l'Asset

```
Project > Assets/_Project/Settings/InputActions/
└─> Clic droit > Create > Input Actions

Nom: KickerControls
```

### 6.2 Configurer les Actions

**Double-cliquer sur `KickerControls`**

**Créer Action Map: "Player"**
```
+ (Plus) à côté de "Action Maps"
Nom: Player
```

**Créer les Actions:**

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

**Pour chaque action:**
```
Click "+" à côté de Player
Nom: [nom de l'action]
Action Type: [type]
Control Type: [type]
```

### 6.3 Ajouter les Bindings

**Movement:**
```
Click Movement > + > Add Up/Down/Left/Right Composite

Composite:
├─ Type: 2D Vector
├─ Name: WASD

Bindings:
├─ Up: W [Keyboard]
├─ Down: S [Keyboard]
├─ Left: A [Keyboard]
└─ Right: D [Keyboard]

Add another binding:
└─> + > Add Binding
    └─> Path: <Gamepad>/leftStick
```

**Look:**
```
+ > Add Binding
├─> Path: <Mouse>/delta

+ > Add Binding
└─> Path: <Gamepad>/rightStick
```

**Kick:**
```
+ > Add Binding
├─> Path: <Mouse>/leftButton

+ > Add Binding
└─> Path: <Gamepad>/buttonSouth
```

**Boost:**
```
+ > Add Binding
├─> Path: <Keyboard>/leftShift

+ > Add Binding
└─> Path: <Gamepad>/buttonWest
```

**Dash:**
```
+ > Add Binding
├─> Path: <Keyboard>/space

+ > Add Binding
└─> Path: <Gamepad>/buttonEast
```

**Ability1, Ability2, Ultimate:** (Même process avec Q, E, R)

### 6.4 Générer C# Class

**En haut de la fenêtre Input Actions:**
```
☑️ Generate C# Class

Settings:
├─ C# Class File: Assets/_Project/Scripts/KickerControls.cs
├─ C# Class Name: KickerControls
├─ C# Class Namespace: KickFlight
└─> [Apply]
```

**Save Asset** (Ctrl/Cmd + S)

---

## Étape 7: Importer les Scripts

### 7.1 Copier les Scripts

**Depuis le repo GitHub/local:**
```
kick-flight-reborn/UnityScripts/
├─ Movement/AerialMovement.cs
├─ Combat/CombatSystem.cs
└─ Player/KickerHealth.cs
```

**Vers Unity:**
```
Assets/_Project/Scripts/
├─ Movement/AerialMovement.cs
├─ Combat/CombatSystem.cs
└─ Player/KickerHealth.cs
```

**Méthodes:**

**Option A: Drag & Drop**
- Glisser les .cs depuis Finder/Explorer vers Unity

**Option B: Terminal**
```bash
cd ~/Documents/kick-flight-reborn
cp UnityScripts/Movement/AerialMovement.cs UnityProject/Assets/_Project/Scripts/Movement/
cp UnityScripts/Combat/CombatSystem.cs UnityProject/Assets/_Project/Scripts/Combat/
cp UnityScripts/Player/KickerHealth.cs UnityProject/Assets/_Project/Scripts/Player/
```

### 7.2 Vérifier la Compilation

```
Window > Console (Ctrl/Cmd + Shift + C)
```

**Si aucune erreur:** ✅ Bon à continuer !

**Si erreurs:**
- Vérifier packages installés (Netcode, Input System)
- Vérifier les namespaces
- Lire le message d'erreur

---

## Étape 8: Créer la Scène de Test

### 8.1 Créer la Scène

```
File > New Scene
Template: Basic (Built-in)

File > Save As
└─> Assets/_Project/Scenes/TestArena.unity
```

### 8.2 Configurer l'Environnement

**Sol:**
```
Hierarchy > Clic droit > 3D Object > Plane
Properties:
├─ Nom: Ground
├─ Transform:
│   ├─ Position: (0, 0, 0)
│   └─ Scale: (20, 1, 20)
└─ Layer: Environment
```

**Obstacles (optionnel):**
```
Hierarchy > 3D Object > Cube
Properties:
├─ Nom: Obstacle1
├─ Transform:
│   ├─ Position: (5, 2.5, 5)
│   └─ Scale: (2, 5, 2)
└─ Layer: Environment

Dupliquer (Ctrl/Cmd + D) pour créer plus d'obstacles
```

**Lighting:**
```
Window > Rendering > Lighting

Environment:
├─ Skybox Material: Default-Skybox
├─ Sun Source: Directional Light
└─ Environment Lighting: Skybox

Generate Lighting (bouton en bas)
```

### 8.3 Créer le Player

```
Hierarchy > Create Empty
Nom: Player

Transform:
├─ Position: (0, 2, 0)
├─ Rotation: (0, 0, 0)
└─ Scale: (1, 1, 1)

Layer: Player
Tag: Player
```

**Add Components (Inspector):**

1. **Character Controller**
```
Height: 2
Radius: 0.5
Center: (0, 1, 0)
Skin Width: 0.08
```

2. **AerialMovement** (script)
```
(Les paramètres ont des valeurs par défaut)
```

3. **KickerHealth** (script)
```
Max Health: 100
Max Shield: 50
```

4. **CombatSystem** (script)
```
Kick Damage: 25
Kick Range: 3
```

5. **NetworkObject** (Netcode)
```
(Valeurs par défaut OK)
```

**Enfant Visuel:**
```
Clic droit sur Player > 3D Object > Capsule
Nom: Visual

Transform:
├─ Position: (0, 0, 0)
└─ Scale: (1, 1, 1)

Components:
└─> Remove Component: Capsule Collider
    (Le Character Controller gère déjà la collision)
```

### 8.4 Configurer la Caméra

**Main Camera:**
```
Transform:
├─ Position: (0, 8, -8)
└─ Rotation: (35, 0, 0)

Camera component:
├─ Field of View: 70
└─ Clipping Planes:
    ├─ Near: 0.1
    └─ Far: 1000
```

**Ajouter Cinemachine (optionnel mais recommandé):**
```
Add Component > Cinemachine Brain
```

**Créer Virtual Camera:**
```
Hierarchy > Cinemachine > Virtual Camera
Nom: PlayerCamera

Properties:
├─ Follow: [Drag Player ici]
├─ Look At: [Drag Player ici]
└─ Lens:
    └─ FOV: 70
```

### 8.5 Sauvegarder Player en Prefab

```
Glisser Player depuis Hierarchy vers:
Assets/_Project/Prefabs/Characters/

Nom: Player.prefab
```

---

## Étape 9: Setup Network Manager (Pour Multijoueur)

### 9.1 Créer NetworkManager Object

```
Hierarchy > Create Empty
Nom: NetworkManager

Transform: (0, 0, 0) - Peu importe
```

### 9.2 Add Components

**1. Unity Transport**
```
Add Component > Unity Transport

Settings:
├─ Address: 127.0.0.1 (localhost pour test)
└─ Port: 7777
```

**2. Network Manager**
```
Add Component > Network Manager

Settings:
└─> NetworkConfig:
    └─> Player Prefab: [Drag Player.prefab ici]
```

---

## Étape 10: Tester !

### 10.1 Test Local (Sans Réseau)

```
Appuyer sur Play ▶️

Controls:
├─ WASD: Voler
├─ Mouse: Regarder
├─ Shift: Boost
├─ Space: Dash
└─ Left Click: Kick

Vérifier:
✅ Player vole
✅ Contrôles répondent
✅ Aucune erreur Console
```

### 10.2 Test Réseau Local (Host/Client)

**Créer une simple UI de connexion** (optionnel):
```
(Voir documentation Netcode ou utiliser le script de test)
```

**OU Build & Run pour test rapide:**
```
File > Build Settings
├─> Add Open Scenes
├─> Build And Run
└─> Dans l'executable: Start Host
    Dans Unity Editor: Start Client
```

---

## ✅ Checklist Finale

Configuration complète:

**Projet**
- [ ] Unity 2022.3 LTS
- [ ] Template 3D (URP)
- [ ] Projet créé et ouvert

**Packages**
- [ ] Netcode for GameObjects
- [ ] Input System
- [ ] Cinemachine
- [ ] TextMeshPro

**Project Settings**
- [ ] Color Space: Linear
- [ ] Input System activé
- [ ] Layers créés (Player, Environment, Collectible, Projectile)
- [ ] Physics configuré (Gravity -15)
- [ ] Quality presets créés

**Structure**
- [ ] Dossiers créés (_Project/Art/Scripts/etc)
- [ ] Input Actions créé (KickerControls)
- [ ] Scripts importés (AerialMovement, CombatSystem, KickerHealth)

**Scène**
- [ ] TestArena créée
- [ ] Ground placé
- [ ] Player créé avec tous les components
- [ ] Player Prefab sauvegardé
- [ ] Caméra configurée
- [ ] NetworkManager créé

**Test**
- [ ] Play mode fonctionne
- [ ] Mouvement fonctionne
- [ ] Aucune erreur Console

---

## 🎉 Configuration Terminée !

Vous êtes prêt à développer Kick Flight: Reborn !

**Prochaines étapes:**
- Consulter [QUICK_START.md](docs/QUICK_START.md)
- Lire [GAME_DESIGN.md](docs/GAME_DESIGN.md)
- Rejoindre la communauté
- Contribuer !

---

**Temps total estimé: 30-45 minutes**

*Guide rédigé par la communauté Kick Flight: Reborn*
*Dernière mise à jour: Novembre 2025*
