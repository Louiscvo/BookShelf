# BookShelf

Application de gestion de bibliothèque personnelle.

## Structure

```
Documents/
├── BookShelf/
│   ├── backend/         # API backend
│   ├── web-app/         # Application web
│   ├── docker-compose.yml
│   └── render.yaml      # Configuration déploiement
└── kick-flight-reborn/  # Projet Unity annexe
```

## Déploiement

L'application peut être déployée via Docker :

```bash
cd Documents/BookShelf
docker-compose up -d
```

Ou sur Render.com avec le fichier `render.yaml`.

## Fonctionnalités

- Gestion de livres (ajout, modification, suppression)
- Organisation par catégories
- Interface web responsive
