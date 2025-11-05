# Guide de Configuration Unity - Kick Flight: Reborn

## 🎮 Configuration Recommandée

### Version Unity
- **Unity 2022.3 LTS** (Long Term Support)
- Version stable et optimisée pour mobile
- Support à long terme garanti

### Packages Essentiels

#### 1. **Netcode for GameObjects** (Multijoueur)
```
Window > Package Manager > Unity Registry
Chercher: "Netcode for GameObjects"
```

#### 2. **Input System** (Contrôles)
```
Window > Package Manager > Unity Registry
Chercher: "Input System"
```

#### 3. **Cinemachine** (Caméra dynamique)
```
Window > Package Manager > Unity Registry
Chercher: "Cinemachine"
```

#### 4. **Universal RP** (Rendu mobile optimisé)
```
Window > Package Manager > Unity Registry
Chercher: "Universal RP"
```

#### 5. **TextMeshPro** (UI texte)
```
Installé par défaut dans Unity 2022+
```

## 📁 Structure du Projet Unity

```
Assets/
├── _Project/
│   ├── Art/
│   │   ├── Characters/      # Modèles 3D des Kickers
│   │   ├── Environments/    # Arènes et décors
│   │   ├── Effects/         # VFX (particules, trails)
│   │   ├── Materials/       # Matériaux et shaders
│   │   └── UI/             # Sprites et assets UI
│   │
│   ├── Audio/
│   │   ├── Music/          # Musiques de fond
│   │   ├── SFX/            # Effets sonores
│   │   └── Voice/          # Voix des personnages
│   │
│   ├── Prefabs/
│   │   ├── Characters/     # Prefabs des Kickers
│   │   ├── Projectiles/    # Discs et projectiles
│   │   ├── Environment/    # Éléments d'arène
│   │   └── UI/            # Prefabs UI
│   │
│   ├── Scenes/
│   │   ├── MainMenu.unity
│   │   ├── Lobby.unity
│   │   ├── Arena_Test.unity
│   │   └── Arena_01.unity
│   │
│   ├── Scripts/
│   │   ├── Core/
│   │   │   ├── GameManager.cs
│   │   │   ├── NetworkManager.cs
│   │   │   └── MatchManager.cs
│   │   │
│   │   ├── Player/
│   │   │   ├── KickerController.cs
│   │   │   ├── KickerStats.cs
│   │   │   ├── KickerAbilities.cs
│   │   │   └── KickerAnimator.cs
│   │   │
│   │   ├── Movement/
│   │   │   ├── AerialMovement.cs
│   │   │   ├── FlightPhysics.cs
│   │   │   └── DashSystem.cs
│   │   │
│   │   ├── Combat/
│   │   │   ├── CombatSystem.cs
│   │   │   ├── DiscController.cs
│   │   │   ├── DamageSystem.cs
│   │   │   └── HitboxManager.cs
│   │   │
│   │   ├── Network/
│   │   │   ├── PlayerNetworkBehaviour.cs
│   │   │   ├── StateSync.cs
│   │   │   ├── ClientPrediction.cs
│   │   │   └── ServerReconciliation.cs
│   │   │
│   │   ├── UI/
│   │   │   ├── HUDManager.cs
│   │   │   ├── MainMenuController.cs
│   │   │   ├── CharacterSelectUI.cs
│   │   │   └── ScoreboardUI.cs
│   │   │
│   │   ├── Camera/
│   │   │   ├── DynamicCamera.cs
│   │   │   └── CameraFollow.cs
│   │   │
│   │   └── Utilities/
│   │       ├── ObjectPooler.cs
│   │       ├── AudioManager.cs
│   │       └── ParticleManager.cs
│   │
│   └── Settings/
│       ├── InputActions.inputactions
│       ├── URPSettings.asset
│       └── NetworkConfig.asset
│
├── Plugins/          # Packages tiers si nécessaire
└── Resources/        # Assets chargés dynamiquement
```

## 🎯 Configuration Initiale du Projet

### 1. Créer un nouveau projet Unity

```bash
# Via Unity Hub:
# - Ouvrir Unity Hub
# - "New Project"
# - Template: "3D (URP)"
# - Project name: "KickFlightReborn"
# - Location: ~/Documents/kick-flight-reborn/UnityProject
```

### 2. Configurer les Project Settings

#### Build Settings
```
File > Build Settings
- Platform: iOS / Android
- Architecture: ARM64
- Target API Level: Android 13+ (API 33)
```

#### Player Settings
```
Edit > Project Settings > Player

General:
- Company Name: Kick Flight Community
- Product Name: Kick Flight Reborn
- Default Icon: [À définir]

Resolution:
- Default Orientation: Landscape Left/Right
- Allowed Orientations: Landscape only

Other Settings:
- Color Space: Linear
- Auto Graphics API: false
- Graphics APIs: Metal (iOS), Vulkan (Android)
- Multithreaded Rendering: true
- Target Architectures: ARM64
```

#### Quality Settings
```
Edit > Project Settings > Quality

Mobile Presets:
- Low: Pour anciens devices
- Medium: Pour devices moyens
- High: Pour devices récents
- Very High: Pour tests desktop

Settings clés:
- Anti Aliasing: 2x Multi Sampling
- Shadows: Soft Shadows
- Shadow Distance: 50
- VSync: 1
- Target Frame Rate: 60 FPS
```

#### Physics Settings
```
Edit > Project Settings > Physics

- Gravity: Y = -15 (plus fort pour combat aérien)
- Default Solver Iterations: 8
- Default Solver Velocity Iterations: 3
- Queries Hit Backfaces: false
- Layer Collision Matrix: [Configurer selon besoins]
```

## 🌐 Configuration Netcode

### Installation de Netcode for GameObjects

1. **Via Package Manager:**
```
Window > Package Manager
Registry: Unity Registry
Search: "Netcode for GameObjects"
Install
```

2. **Configuration de base:**

```csharp
// NetworkManager Setup
public class KFNetworkManager : NetworkBehaviour
{
    public static KFNetworkManager Instance { get; private set; }
    
    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }
    
    public void StartHost()
    {
        NetworkManager.Singleton.StartHost();
    }
    
    public void StartClient()
    {
        NetworkManager.Singleton.StartClient();
    }
    
    public void StartServer()
    {
        NetworkManager.Singleton.StartServer();
    }
}
```

### Layers de Collision

```
Layer 0: Default
Layer 6: Player
Layer 7: Enemy
Layer 8: Projectile
Layer 9: Environment
Layer 10: Trigger
Layer 11: UI
```

## 🎨 Configuration URP (Universal Render Pipeline)

### Créer URP Asset

```
1. Assets > Create > Rendering > URP Asset (with Universal Renderer)
2. Nommer: "KickFlight_URP_Mobile"
3. Edit > Project Settings > Graphics
4. Assigner le URP Asset créé
```

### Settings URP Optimisés Mobile

```
Quality:
- HDR: false
- MSAA: 2x
- Render Scale: 0.75-1.0
- Upscaling Filter: Automatic

Lighting:
- Main Light: Pixel
- Additional Lights: Disabled (ou Per Vertex)
- Cast Shadows: true
- Shadow Resolution: Medium (1024)

Post-processing:
- Bloom: On (léger)
- Color Grading: On
- Motion Blur: Off (performance)
- Ambient Occlusion: Off (mobile)
```

## 📱 Configuration Mobile

### Input System

Créer un Input Action Asset:
```
Assets > Create > Input Actions
Name: "KickerControls"

Action Maps:
- Player
  - Movement (Value, Vector2)
  - Kick (Button)
  - Ability1 (Button)
  - Ability2 (Button)
  - Ability3 (Button)
  - Ultimate (Button)
  - Dash (Button)
```

### Touch Controls

```csharp
// Exemple de setup tactile
using UnityEngine.InputSystem.EnhancedTouch;

void Start()
{
    EnhancedTouchSupport.Enable();
    TouchSimulation.Enable();
}
```

## 🚀 Scripts de Démarrage Essentiels

### 1. Mouvement Aérien de Base

```csharp
using Unity.Netcode;
using UnityEngine;

public class AerialMovement : NetworkBehaviour
{
    [Header("Flight Settings")]
    [SerializeField] private float flySpeed = 20f;
    [SerializeField] private float acceleration = 10f;
    [SerializeField] private float rotationSpeed = 5f;
    
    [Header("Physics")]
    [SerializeField] private float gravity = -15f;
    [SerializeField] private float dragCoefficient = 0.5f;
    
    private Rigidbody rb;
    private Vector3 moveInput;
    private Vector3 velocity;
    
    private void Start()
    {
        rb = GetComponent<Rigidbody>();
        rb.useGravity = false; // Custom gravity
    }
    
    public override void OnNetworkSpawn()
    {
        if (!IsOwner) return;
        // Setup input
    }
    
    private void FixedUpdate()
    {
        if (!IsOwner) return;
        
        ApplyMovement();
        ApplyGravity();
        ApplyDrag();
    }
    
    private void ApplyMovement()
    {
        Vector3 moveDirection = transform.forward * moveInput.z + 
                               transform.right * moveInput.x + 
                               transform.up * moveInput.y;
        
        velocity += moveDirection * acceleration * Time.fixedDeltaTime;
        velocity = Vector3.ClampMagnitude(velocity, flySpeed);
        
        rb.velocity = velocity;
    }
    
    private void ApplyGravity()
    {
        velocity.y += gravity * Time.fixedDeltaTime;
    }
    
    private void ApplyDrag()
    {
        velocity *= (1f - dragCoefficient * Time.fixedDeltaTime);
    }
    
    public void SetMoveInput(Vector3 input)
    {
        moveInput = input;
    }
}
```

### 2. Système de Combat de Base

```csharp
using Unity.Netcode;
using UnityEngine;

public class CombatSystem : NetworkBehaviour
{
    [Header("Combat Stats")]
    [SerializeField] private float kickDamage = 25f;
    [SerializeField] private float kickRange = 3f;
    [SerializeField] private float kickCooldown = 0.5f;
    
    private float lastKickTime;
    
    public void PerformKick()
    {
        if (!IsOwner) return;
        if (Time.time - lastKickTime < kickCooldown) return;
        
        PerformKickServerRpc();
    }
    
    [ServerRpc]
    private void PerformKickServerRpc()
    {
        lastKickTime = Time.time;
        
        // Détecter les ennemis dans la portée
        Collider[] hits = Physics.OverlapSphere(
            transform.position + transform.forward * kickRange/2, 
            kickRange,
            LayerMask.GetMask("Player")
        );
        
        foreach (var hit in hits)
        {
            if (hit.gameObject == gameObject) continue;
            
            var health = hit.GetComponent<KickerHealth>();
            if (health != null)
            {
                health.TakeDamage(kickDamage);
            }
        }
        
        // Sync animation avec clients
        PlayKickAnimationClientRpc();
    }
    
    [ClientRpc]
    private void PlayKickAnimationClientRpc()
    {
        // Play kick animation
    }
}
```

### 3. Système de Santé Réseau

```csharp
using Unity.Netcode;
using UnityEngine;

public class KickerHealth : NetworkBehaviour
{
    [Header("Health Settings")]
    [SerializeField] private float maxHealth = 100f;
    
    private NetworkVariable<float> currentHealth = new NetworkVariable<float>(
        100f, 
        NetworkVariableReadPermission.Everyone, 
        NetworkVariableWritePermission.Server
    );
    
    public override void OnNetworkSpawn()
    {
        currentHealth.Value = maxHealth;
        currentHealth.OnValueChanged += OnHealthChanged;
    }
    
    public override void OnNetworkDespawn()
    {
        currentHealth.OnValueChanged -= OnHealthChanged;
    }
    
    [ServerRpc(RequireOwnership = false)]
    public void TakeDamageServerRpc(float damage)
    {
        currentHealth.Value = Mathf.Max(0, currentHealth.Value - damage);
        
        if (currentHealth.Value <= 0)
        {
            Die();
        }
    }
    
    private void OnHealthChanged(float oldValue, float newValue)
    {
        // Update UI
        Debug.Log($"Health changed: {oldValue} -> {newValue}");
    }
    
    private void Die()
    {
        if (!IsServer) return;
        
        // Handle death logic
        DieClientRpc();
    }
    
    [ClientRpc]
    private void DieClientRpc()
    {
        // Death animation and effects
    }
}
```

## 🎯 Prochaines Étapes

1. ✅ Installer Unity Hub et Unity 2022.3 LTS
2. ✅ Créer le projet avec template URP
3. ✅ Installer les packages essentiels
4. ✅ Configurer la structure de dossiers
5. ✅ Créer les scripts de base (mouvement, combat, santé)
6. 🔄 Créer le premier Kicker prototype
7. 🔄 Implémenter le système de caméra
8. 🔄 Créer une arène de test
9. 🔄 Tester le multijoueur local
10. 🔄 Créer l'UI de base

## 📚 Ressources Utiles

### Documentation
- [Unity Netcode Docs](https://docs-multiplayer.unity3d.com/)
- [Unity URP Manual](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@latest)
- [Unity Input System](https://docs.unity3d.com/Packages/com.unity.inputsystem@latest)

### Tutoriels Recommandés
- Brackeys: Unity Multiplayer
- CodeMonkey: Netcode for GameObjects
- Dapper Dino: Advanced Flying Mechanics

### Assets Gratuits Utiles
- Kenney's Asset Packs (prototypage)
- Mixamo (animations de personnages)
- Freesound (effets sonores)

## 🐛 Debugging

### Network Debug Tools

```csharp
// Activer les logs réseau
NetworkManager.Singleton.LogLevel = LogLevel.Developer;
```

### Performance Profiling

```
Window > Analysis > Profiler
- CPU Usage
- Rendering
- Memory
- Physics
- Network Messages
```

## 🎮 Configuration Claude Code

Le fichier `.claude/config.json` a déjà été créé avec des instructions spécifiques pour Unity et le développement de Kick Flight: Reborn.

Pour travailler avec Claude Code sur Unity:
```bash
cd ~/Documents/kick-flight-reborn
claude chat

# Exemples de commandes:
# "Crée un nouveau script pour le dash aérien"
# "Implémente le système de collecte de cristaux"
# "Ajoute un effet de particules pour le kick"
# "Optimise les performances pour mobile"
```

---

**Bon développement ! 🚀 Faisons revivre Kick-Flight ensemble !**
