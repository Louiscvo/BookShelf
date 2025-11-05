# 🎮 Game Design Document - Kick Flight: Reborn

**Version:** 1.0
**Date:** Novembre 2025
**Status:** Living Document

---

## 📋 Table des Matières

1. [Vision du Jeu](#vision-du-jeu)
2. [Core Gameplay](#core-gameplay)
3. [Systèmes de Jeu](#systèmes-de-jeu)
4. [Kickers (Personnages)](#kickers-personnages)
5. [Arènes](#arènes)
6. [Modes de Jeu](#modes-de-jeu)
7. [Progression](#progression)
8. [Économie](#économie)
9. [Équilibrage](#équilibrage)

---

## 🎯 Vision du Jeu

### Pitch Élevateur (30 secondes)

**Kick Flight: Reborn** est un jeu d'action aérienne compétitif en arène 4v4 où les joueurs s'affrontent dans des combats verticaux intenses à 360°. Avec des personnages uniques (Kickers), des capacités explosives et un mouvement ultra-fluide en 6 degrés de liberté, chaque match est une bataille aérienne chaotique et stratégique.

### Piliers de Design

1. **⚡ Mouvement = Roi**
   - Le mouvement aérien doit être ultra-fluide et satisfaisant
   - Facile à apprendre, difficile à maîtriser
   - La mobilité est votre meilleure défense

2. **💥 Combat Dynamique**
   - Combats rapprochés avec kicks et combos
   - Mix de mêlée et capacités spéciales
   - Chaque coup doit être satisfaisant

3. **🎭 Expression du Joueur**
   - Chaque Kicker a une personnalité unique
   - Styles de jeu variés
   - Customisation visuelle

4. **🏆 Compétitif mais Accessible**
   - Easy to learn, hard to master
   - Skill ceiling élevé
   - Matchs courts (3-5 min)

5. **🌍 Communauté First**
   - Open source et modding-friendly
   - Tournois communautaires
   - Feedback loops constants

### Références & Inspirations

| Jeu | Ce qu'on en prend |
|-----|-------------------|
| **Kick-Flight (original)** | Mouvement aérien, Kickers, objectifs |
| **Overwatch** | Hero design, team composition |
| **Rocket League** | Skill ceiling élevé, mouvement 3D |
| **Apex Legends** | Mouvement fluide, ping system |
| **Super Smash Bros** | Combat accessible mais profond |

---

## 🎮 Core Gameplay

### Gameplay Loop

```
┌──────────────────────────────────────────────────┐
│  1. SELECT KICKER                                 │
│     └─→ Choose character based on team comp      │
└───────────────┬──────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────┐
│  2. SPAWN IN ARENA                                │
│     └─→ 2s invulnerability, orient yourself      │
└───────────────┬──────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────┐
│  3. NAVIGATE & FIGHT                              │
│     ├─→ Fly to objectives (crystals)             │
│     ├─→ Engage enemies                           │
│     ├─→ Use abilities                            │
│     └─→ Coordinate with team                     │
└───────────────┬──────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────┐
│  4. COLLECT CRYSTALS                              │
│     └─→ Secure points for your team              │
└───────────────┬──────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────┐
│  5. VICTORY OR DEFEAT                             │
│     ├─→ Team with most points wins               │
│     ├─→ XP & rewards                             │
│     └─→ Rematch or return to lobby               │
└──────────────────────────────────────────────────┘
```

### Moment-to-Moment Gameplay

**Seconde par seconde:**
- Voler librement en 3D
- Scanner l'environnement pour ennemis/cristaux
- Ajuster trajectoire et vitesse
- Anticiper les attaques

**Toutes les 5-10 secondes:**
- Engagement de combat
- Utilisation de capacités
- Décisions tactiques (fight or flight)
- Coordination d'équipe

**Toutes les 30-60 secondes:**
- Ultimate ready
- Phase shifts (début, mid, fin de match)
- Team fights majeurs

---

## 🛠️ Systèmes de Jeu

### 1. Système de Mouvement

#### Mécaniques de Base

**Vol Libre (6DoF)**
```
Controls:
├── WASD / Left Stick: Translation (forward, back, strafe)
├── Mouse / Right Stick: Rotation (pitch, yaw)
├── Auto-Roll: Tilt basé sur direction
└── Space: Ascension verticale
```

**Paramètres:**
- **Vitesse de base**: 20 m/s
- **Vitesse de boost**: 35 m/s (75% plus rapide)
- **Vitesse de dash**: Instantané 50 unités
- **Gravité**: -15 (plus fort que réel pour arcade feel)
- **Drag aérien**: 0.5 (pour momentum contrôlé)
- **Rotation speed**: 180°/s

#### Mécaniques Avancées

**Boost**
- Maintenir Shift pour vitesse accrue
- Consommation d'énergie: 10/s
- Régénération: 5/s (quand pas utilisé)
- Capacité totale: 100
- Vide = 5s cooldown avant regen

**Dash**
- Tap Space (ou button)
- Direction: Où vous regardez
- Cooldown: 3 secondes
- I-frames: 0.2s au début (dodge)
- VFX trail

**Advanced Techniques (skill expression):**
- **Boost-Dash**: Dash pendant boost = distance max
- **Momentum Conservation**: Lâcher boost garde vitesse 1s
- **Wall Kick**: Kick près d'un mur = bounce
- **Dive Bombing**: Descente rapide + dash = impact AOE

### 2. Système de Combat

#### Combat de Mêlée

**Kick de Base**
- Input: Left Click / Button
- Range: 3 mètres
- Dégâts: 25
- Knockback: 5 unités
- Cooldown: 0.5s
- Hit detection: SphereCast (radius 1.5m)

**Combo System**
```
Hit 1 → Hit 2 → Hit 3 → Finisher
25 dmg   30 dmg   37 dmg   50 dmg
(1.0x)   (1.2x)   (1.5x)   (2.0x)

Window: 1.5s entre chaque hit
Reset: Après 2s sans hit ou si touché
```

**Kickback & Hitstun**
- Victim: 0.3s stun, knockback
- Attacker: 0.1s recovery
- Direction knockback: Opposite de l'attaque

#### Capacités Spéciales

**Ability 1** (par Kicker)
- Cooldown: 8-12s selon Kicker
- Range: Variable
- Type: Damage, Support, Mobility

**Ability 2** (par Kicker)
- Cooldown: 15-20s
- Plus puissant que Ability 1
- Effets uniques

**Ultimate** (tous les Kickers)
- Charge: 100 points
- Gain: +10 par kill, +5 par hit, +20 par crystal
- Effet: Game-changing ability
- Duration: 5-10s selon type
- Audio cue global

### 3. Système de Santé

**Stats de Base**
```
Health: 100 HP
Shield: 50 SP (optionnel selon Kicker)
─────────────────────
Total Effective HP: 150
```

**Shield Mechanics**
- Absorbe dégâts avant health
- Régénération après 5s sans dégâts
- Taux: 10 SP/s
- Break sound/VFX quand détruit

**Healing**
- Rare (certains Kickers support)
- Ne peut pas overheal (sauf ultimate)
- Heal over time preferred sur instant

**Death & Respawn**
```
1. Health = 0
   └─→ Death animation (1s)
   └─→ Ragdoll + camera transition

2. Spectate teammates (2s)

3. Respawn countdown (3s total)
   └─→ Choose spawn point (auto si pas choisi)

4. Spawn avec 2s invulnerability
   └─→ VFX aura pour indiquer invuln
```

### 4. Système de Cristaux

**Spawning**
- 10 cristaux dans l'arène simultanément
- Respawn 5s après collecte
- Positions: Mix de facile et difficile d'accès
- Indicateur visuel (beam de lumière)

**Collecte**
- Contact avec cristal = collecte instantanée
- Points: +10 pour l'équipe
- XP personnel: +5
- Son/VFX de satisfaction

**Stratégie**
- Risk/reward: Cristaux difficiles = exposé
- Contrôle de zone
- Spawn camping prevention (invuln près spawn)

### 5. Système de Score

**Conditions de Victoire**
```
Mode Standard: Premier à 200 points OU 5 minutes
├── Cristaux: +10 pts
├── Kills: +5 pts
└── Assists: +2 pts

Mode Ranked: 5 minutes, score le plus élevé
```

**Tie-breaker**
1. Total kills
2. K/D ratio
3. Sudden death (1 minute, next point wins)

---

## 👥 Kickers (Personnages)

### Classes de Kickers

#### 1. AGILE 🏃‍♂️
**Caractéristiques:**
- Haute mobilité
- Faible HP
- Dégâts moyens
- Excellents pour collecte de cristaux

**Stats Type:**
```
Health: 80
Shield: 30
Speed: 25 m/s (125% base)
Damage: 20 (80% base)
```

**Exemple: Zephyr (Prototype)**
- **Passive**: +20% vitesse de vol
- **Ability 1**: Speed Burst (dash x3 en rafale)
- **Ability 2**: Decoy (clone holographique)
- **Ultimate**: Supersonic (invulnérable, ultra rapide, 5s)

#### 2. TANK 🛡️
**Caractéristiques:**
- Haute HP
- Faible mobilité
- Dégâts élevés
- Zone control

**Stats Type:**
```
Health: 150
Shield: 100
Speed: 15 m/s (75% base)
Damage: 35 (140% base)
```

**Exemple: Bastion (Prototype)**
- **Passive**: -30% knockback reçu
- **Ability 1**: Shield Wall (bouclier directionnel)
- **Ability 2**: Ground Slam (AOE damage + stun)
- **Ultimate**: Fortress Mode (immobile, double HP/damage, 10s)

#### 3. SUPPORT 💚
**Caractéristiques:**
- HP moyenne
- Mobilité moyenne
- Utilitaires
- Teamplay focused

**Stats Type:**
```
Health: 100
Shield: 50
Speed: 20 m/s (100% base)
Damage: 15 (60% base)
```

**Exemple: Aurora (Prototype)**
- **Passive**: Régénère 5 HP/s hors combat
- **Ability 1**: Healing Pulse (heal 30 HP dans 10m radius)
- **Ability 2**: Speed Boost (team +30% speed, 5s)
- **Ultimate**: Revive Beacon (ramène teammates morts, 1 use)

#### 4. DPS (Damage) 💥
**Caractéristiques:**
- HP faible
- Mobilité moyenne
- Très hauts dégâts
- Glass cannon

**Stats Type:**
```
Health: 80
Shield: 20
Speed: 22 m/s (110% base)
Damage: 40 (160% base)
```

**Exemple: Blitz (Prototype)**
- **Passive**: Combos donnent +10% damage par hit
- **Ability 1**: Lightning Strike (ranged projectile)
- **Ability 2**: Blink (téléport court range)
- **Ultimate**: Fury Mode (attaque speed x2, 8s)

### Roster Prévu

**Phase 1 (Prototype):**
- 1 Agile (Zephyr)
- 1 Tank (Bastion)
- Total: 2 Kickers

**Phase 2 (Alpha):**
- +1 Support (Aurora)
- +1 DPS (Blitz)
- Total: 4 Kickers

**Phase 3 (Beta):**
- +2 Agiles
- +1 Tank
- +1 Support
- Total: 8 Kickers

**Release:**
- 10-12 Kickers
- Meta variée
- Contre-picks possibles

### Principes de Design des Kickers

1. **Clarity** - Silhouette reconnaissable
2. **Counterplay** - Chaque Kicker a des weaknesses
3. **Synergy** - Team compositions variées
4. **Skill Expression** - Haut skill ceiling
5. **Fun** - Satisfaisant à jouer ET contre

---

## 🏟️ Arènes

### Design Principles

1. **Verticalité** - L'arène DOIT utiliser les 3 dimensions
2. **Sightlines** - Mix de zones ouvertes et cover
3. **Objectives** - Cristaux à positions stratégiques
4. **Aesthetics** - Thème unique, mémorable
5. **Symétrie** - Fairness pour les deux équipes

### Arène 1: "Sky Citadel" (Arène de Test)

**Thème:** Citadelle flottante futuriste

**Layout:**
```
      [Cristal High]
            │
    ┌───────┼───────┐
    │   Open Sky    │
    │               │
[Blue]──[Center]──[Red] Spawn zones
    │   Platform   │
    │               │
    └───────┬───────┘
            │
     [Cristal Low]
```

**Zones:**
- **Center Platform**: Zone de combat principale, 2 cristaux
- **High Tower**: Cristal à 50m hauteur, exposé
- **Low Cavern**: Cristal sous la map, risqué
- **Side Corridors**: Cover, flanking routes
- **Outer Ring**: Vitesse maximale zone

**Taille:** 200x200x100m (L x W x H)

**Points d'Intérêt:**
- 10 spawn points de cristaux
- 8 spawn points joueurs (4 par équipe)
- Hazards: Aucun (arène de base)

### Arène 2: "Neon Tokyo" (Future)

**Thème:** Ville cyberpunk verticale

**Features:**
- Gratte-ciels à naviguer
- Néons et esthétique Blade Runner
- Zones de boost (tunnels de vent)
- Cristaux sur toits et dans rues

### Arène 3: "Crystal Caverns" (Future)

**Thème:** Cavernes de cristaux lumineux

**Features:**
- Environment sombre, cristaux lumineux
- Stalactites/stalagmites = cover
- Zones d'eau (slow movement)
- Cristaux intégrés naturellement

### Checklist Design d'Arène

- [ ] Map flow clair
- [ ] Pas de zones mortes
- [ ] Spawn points équilibrés
- [ ] Cristaux risk/reward balancés
- [ ] Performance optimisée (< 1000 tris visible)
- [ ] Occlusion culling setup
- [ ] Audio zones configurées
- [ ] Minimap readable

---

## 🎯 Modes de Jeu

### Mode 1: Crystal Rush (Principal)

**Objectif:** Collecter le plus de cristaux en équipe

**Règles:**
- 4v4
- Durée: 5 minutes
- Premier à 200 points OU temps écoulé
- Cristaux: +10 pts
- Kills: +5 pts
- Respawn: 3s

**Stratégie:**
- Balance entre collecte et combat
- Contrôle de zone important
- Team coordination cruciale

### Mode 2: Team Deathmatch (Secondaire)

**Objectif:** Éliminer l'équipe adverse

**Règles:**
- 4v4
- Durée: 5 minutes OU 50 kills
- Respawn: 5s
- Pas de cristaux

**Stratégie:**
- Pure combat
- Picks sont cruciaux
- Spawn camping = dissuadé (invuln 3s)

### Mode 3: Free-for-All (Casual)

**Objectif:** Survive et score

**Règles:**
- 8 joueurs solo
- Durée: 5 minutes
- Cristaux + Kills comptent
- Respawn: 2s

**Stratégie:**
- Chaos total
- Opportunisme
- Éviter les 3rd parties

### Mode 4: Ranked (Compétitif)

**Objectif:** Monter les rangs

**Règles:**
- Crystal Rush standard
- Pick/Ban de Kickers (en beta)
- MMR-based matchmaking
- Pénalités pour abandon

**Rangs:**
```
Bronze → Silver → Gold → Platinum → Diamond → Master → Grandmaster
```

---

## 📈 Progression

### Système de Niveau

**XP Sources:**
```
Match participé: +100 XP
Victoire: +50 XP
Cristal collecté: +5 XP
Kill: +10 XP
Assist: +5 XP
Match duration bonus: +10 XP/min
```

**Level Cap:**
- Max Level: 100
- Unlocks cosmetics
- Pas de gameplay advantage

### Unlocks

**Niveaux 1-10:**
- Tutoriels
- Kickers de base (4)
- Arènes de base (2)

**Niveaux 10-30:**
- Unlock nouveaux Kickers
- Nouvelles arènes
- Cosmetics basiques

**Niveaux 30-100:**
- Cosmetics rares
- Ranked mode unlock (level 20)
- Prestige skins

### Achievements

**Exemples:**
- "First Blood" - Première kill
- "Hat Trick" - 3 kills sans mourir
- "Crystal Hunter" - 100 cristaux collectés
- "Sky Master" - 50 heures de vol
- "Untouchable" - Match sans mourir

---

## 💰 Économie

### Monnaie

**Crystals (gratuit):**
- Gagné en jouant
- Achète cosmetics communs
- Taux: ~100/heure de jeu

**Premium Currency (optionnel, si besoin):**
- Cosmetics exclusifs
- Battle Pass
- **PAS** pay-to-win

### Cosmetics

**Types:**
- Skins de Kickers
- Trails de vol
- Victory poses
- Voice lines
- Emotes

**Rareté:**
```
Common (blanc) - 100 Crystals
Rare (bleu) - 500 Crystals
Epic (violet) - 1500 Crystals
Legendary (or) - 5000 Crystals
```

### Battle Pass (Post-Launch)

**Structure:**
- 100 tiers
- Free track + Premium track
- Durée: 3 mois/saison
- Contenu: Skins, emotes, currency

---

## ⚖️ Équilibrage

### Principes d'Équilibrage

1. **Data-Driven** - Décisions basées sur stats
2. **Community Feedback** - Écouter les joueurs
3. **Itération** - Patches réguliers
4. **No Knee-Jerk** - Attendre 2 semaines avant nerf/buff
5. **Fun First** - Buffing > Nerfing quand possible

### Métriques Clés

**Par Kicker:**
- Win rate (target: 48-52%)
- Pick rate (evenly distributed)
- K/D ratio
- Damage per match

**Par Arène:**
- Win rate par side (target: 49-51%)
- Match duration moyenne
- Hot zones (heatmap)

**Global:**
- Match duration moyenne (target: 4-5 min)
- Abandon rate (target: <5%)
- New player retention

### Patch Cadence

- **Hotfixes:** Immédiat (game-breaking bugs)
- **Balance Patches:** Bi-weekly (ajustements)
- **Content Updates:** Monthly (nouveaux Kickers/arènes)
- **Major Updates:** Quarterly (features majeures)

---

## 🎨 Direction Artistique

### Style Visuel

**Inspiration:** Anime/Cel-shaded + Sci-fi

**Palette de Couleurs:**
- Vibrant et saturé
- Haut contraste
- Teamcolor coding (bleu vs rouge)

**VFX:**
- Exagérés et satisfaisants
- Trails de mouvement
- Impact frames sur hits
- Screen shake modéré

**Audio:**
- Sound design punchy
- Musique énergique (EDM/Synthwave)
- Voicelines de personnalité

---

## 🎯 Expérience Utilisateur

### Onboarding (Nouveaux Joueurs)

**Tutoriel Intégré:**
1. Mouvement de base (2 min)
2. Combat basique (2 min)
3. Collecte de cristaux (1 min)
4. Match pratique vs bots (5 min)

**Learning Curve:**
```
Facile à comprendre (15 min)
     │
     │ Compétent (5h)
     │
     │ Avancé (50h)
     │
     │ Master (200h+)
     ▼
Skill ceiling élevé
```

### Accessibility

**Options:**
- Colorblind modes
- Subtitles
- Remappable controls
- Sensitivity ajustable
- FOV slider (60-120)
- Motion blur toggle

### Social Features

**In-Game:**
- Voice chat (opt-in)
- Ping system (like Apex)
- Quick chat wheel
- Emotes

**Meta:**
- Friends list
- Party system (4 max)
- Clans (future)
- Spectate friends

---

## 📊 Métriques de Succès

### KPIs (Key Performance Indicators)

**Engagement:**
- DAU/MAU ratio: > 0.25
- Session length: 30+ minutes
- Sessions per day: 2+

**Rétention:**
- D1: > 50%
- D7: > 30%
- D30: > 15%

**Qualité:**
- Average rating: > 4.5/5
- Bug reports: < 10/1000 players
- Server uptime: > 99%

**Communauté:**
- Discord members: 1000+ (launch)
- GitHub stars: 500+ (launch)
- Monthly contributors: 10+

---

## 🔮 Vision Future

### Post-Launch Features (Wishlist)

- **Custom Games** - Server browser
- **Map Editor** - Community maps
- **Replay System** - Revoir matchs
- **Tournaments** - In-game competitive
- **Cross-Platform** - PC/Mobile crossplay
- **Spectator Mode** - Esports ready
- **Clan Wars** - Competitive clans
- **Seasonal Events** - Thèmes temporaires

---

## 📝 Notes de Design

### Ce Qu'on VEUT

✅ Mouvement fluide et satisfaisant
✅ Combats clairs et lisibles
✅ Skill expression élevée
✅ Communauté engagée
✅ Fair play (pas de P2W)

### Ce Qu'on NE VEUT PAS

❌ Pay-to-win
❌ Grind excessif
❌ Matchmaking déséquilibré
❌ Power creep
❌ Toxicité encouragée

---

**Document vivant - Sera mis à jour régulièrement selon feedback**

**Dernière révision:** Novembre 2025
**Prochaine révision prévue:** Après premiers playtests

---

## 🤝 Contributeurs Game Design

Ce document est ouvert aux suggestions communautaires !

Voir [CONTRIBUTING.md](../community/CONTRIBUTING.md) pour proposer des idées.
