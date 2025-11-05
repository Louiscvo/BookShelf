# Kick Flight: Reborn - Unity Project

## Structure du Projet

### Scripts/
- **Movement/** - Systèmes de mouvement aérien
  - `AerialMovement.cs` - Vol 6DoF avec boost et dash
- **Combat/** - Systèmes de combat
  - `CombatSystem.cs` - Kicks, combos, attaques spéciales
- **Player/** - Composants du joueur
  - `KickerHealth.cs` - Santé, shield, respawn
- **Core/** - Scripts core du jeu
- **Network/** - Scripts réseau
- **UI/** - Scripts d'interface
- **Camera/** - Scripts de caméra
- **Utilities/** - Utilitaires

### Prefabs/
- **Characters/** - Prefabs des Kickers
- **Environment/** - Props d'arène
- **UI/** - Prefabs UI

### Scenes/
Scènes Unity du jeu

### Art/
Assets visuels (modèles, textures, materials)

### Audio/
Sons et musiques

### Settings/
- **InputActions/** - Input System actions
- **URP/** - Universal Render Pipeline settings

### ScriptableObjects/
- **Kickers/** - Données des personnages
- **Arenas/** - Données des arènes

## Prochaines Étapes

1. Ouvrir ce projet dans Unity 2022.3 LTS
2. Installer les packages requis:
   - Netcode for GameObjects
   - Input System
   - Cinemachine
3. Suivre le guide: `docs/QUICK_START.md`

## Scripts Créés

Tous les scripts sont déjà compatibles avec:
- Unity 2022.3 LTS
- Netcode for GameObjects (multijoueur)
- Input System (contrôles modernes)

Pour plus d'infos, voir la documentation dans `/docs/`
