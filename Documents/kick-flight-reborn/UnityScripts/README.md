# Unity Scripts

Ce dossier contient tous les scripts C# Unity prêts à être importés dans le projet Unity.

## Structure

- **Movement/** - Scripts de mouvement aérien
- **Combat/** - Scripts de combat et attaques
- **Player/** - Scripts du joueur (santé, stats, etc.)
- **Core/** - Scripts core du jeu (GameManager, etc.)
- **Network/** - Scripts réseau et multijoueur
- **UI/** - Scripts d'interface utilisateur
- **Camera/** - Scripts de caméra
- **Utilities/** - Scripts utilitaires

## Import dans Unity

Copier ces fichiers dans `UnityProject/Assets/_Project/Scripts/` en respectant la structure de dossiers.

## Scripts Principaux

1. **AerialMovement.cs** - Système de mouvement aérien 6DoF
2. **CombatSystem.cs** - Système de combat avec combos
3. **KickerHealth.cs** - Système de santé et respawn

Tous les scripts sont compatibles avec:
- Unity 2022.3 LTS
- Netcode for GameObjects
- Input System
