# CoreHub

**Dashboard Centrale per la Suite Core***

CoreHub è la porta di accesso unificata per tutte le applicazioni della suite gestionale Core*. Offre una dashboard moderna che mostra lo stato in tempo reale dei servizi e permette di accedervi con un click.

## Caratteristiche

- 🎯 **Dashboard Centralizzata** - Un unico punto di accesso per tutte le app Core*
- 📊 **Monitoraggio Real-Time** - Stato online/offline dei servizi
- 🎨 **Design Moderno** - Interfaccia elegante con Material-UI
- ⚡ **Performance** - Polling automatico ogni 30 secondi
- 🔗 **Navigazione Semplice** - Click su card → apertura app in nuova tab
- 🐳 **Docker Native** - Integrazione diretta con Docker per il monitoraggio

## Architettura

CoreHub è un monorepo con due applicazioni:

```
CoreHub/
├── apps/
│   ├── backend/          # NestJS - API di status
│   │   └── src/
│   │       ├── status/   # Controller e Service per /api/status
│   │       └── config/   # Configurazione apps (apps.config.ts)
│   └── frontend/         # Next.js 14 - Dashboard
│       └── src/
│           ├── app/      # Pages
│           └── components/ # ServiceCard
├── docker-compose.yml    # Orchestrazione container
└── package.json          # Workspace root
```

## Prerequisiti

- **CoreServices** deve essere attivo (nginx, MySQL, ecc.)
- Docker e Docker Compose installati
- Node.js 20+ (solo per sviluppo locale)

## Avvio Rapido

### Produzione (Docker)

```bash
# Avvia CoreHub
start.bat

# Stop CoreHub
stop.bat

# Visualizza logs
logs.bat
```

### Sviluppo Locale

```bash
# Installa dipendenze
npm install

# Avvia backend + frontend in dev mode
npm run dev

# Oppure separatamente:
npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:3000
```

## Accesso

Dopo l'avvio, CoreHub è accessibile su:

- **Dashboard**: http://localhost
- **API Status**: http://localhost/api/status

## Configurazione Apps

Per aggiungere una nuova applicazione alla dashboard, modifica il file [apps/backend/src/config/apps.config.ts](apps/backend/src/config/apps.config.ts):

```typescript
{
  id: 'coreinventory',
  name: 'CoreInventory',
  description: 'Gestione Magazzino',
  icon: '📦',
  url: 'http://localhost:83',
  containerName: 'coreinventory-frontend',
  color: '#ed6c02', // Orange
}
```

Poi rebuilda i container:

```bash
docker-compose down
docker-compose up -d --build
```

## Stack Tecnologico

### Backend
- **NestJS 10** - Framework Node.js
- **Docker SDK** - Monitoring container via `docker ps`
- **TypeScript** - Type safety

### Frontend
- **Next.js 14** - React framework con App Router
- **Material-UI v5** - Component library
- **Emotion** - CSS-in-JS
- **TypeScript** - Type safety

## API Endpoints

### GET /api/status

Ritorna lo stato di tutte le applicazioni Core*.

**Response:**
```json
[
  {
    "id": "coremachine",
    "name": "CoreMachine",
    "description": "Gestione Macchine e Produzione",
    "icon": "🏭",
    "url": "http://localhost:81",
    "containerName": "coremachine-frontend",
    "color": "#1976d2",
    "status": "online"
  },
  {
    "id": "coredocument",
    "name": "CoreDocument",
    "description": "Gestione Documentale",
    "icon": "📄",
    "url": "http://localhost:82",
    "containerName": "coredocument-frontend",
    "color": "#2e7d32",
    "status": "offline"
  }
]
```

## Ports

| Porta | Servizio | Descrizione |
|-------|----------|-------------|
| 80 | CoreHub Frontend (via nginx) | Dashboard principale |
| 3000 | CoreHub Frontend (diretto) | Accesso diretto container (interno) |
| 3001 | CoreHub Backend (diretto) | API status (interno) |

**Nota**: In produzione si accede sempre tramite nginx sulla porta 80.

## Design della Dashboard

### Features UI/UX

- **Gradient Background** - Sfondo viola/blu professionale
- **Card Hover Effects** - Animazione smooth su hover
- **Status Badges** - Badge colorati online/offline
- **Chip Count** - Contatore servizi attivi
- **Responsive Design** - 3 colonne desktop, 1 mobile
- **Loading State** - Spinner durante caricamento iniziale
- **Auto-refresh** - Polling ogni 30 secondi senza reload

### Colori delle Card

Ogni app ha un colore distintivo:
- 🏭 **CoreMachine**: Blue (#1976d2)
- 📄 **CoreDocument**: Green (#2e7d32)
- 📦 **CoreInventory** (futuro): Orange (#ed6c02)

## Comandi Docker

```bash
# Build e avvio
docker-compose up -d --build

# Stop
docker-compose down

# Logs in tempo reale
docker-compose logs -f

# Logs solo backend
docker-compose logs -f backend

# Logs solo frontend
docker-compose logs -f frontend

# Riavvia singolo servizio
docker-compose restart backend
```

## Troubleshooting

### Dashboard mostra tutti i servizi offline

**Causa**: Il backend non riesce a comunicare con Docker.

**Soluzione**:
- Verifica che il socket Docker sia montato: `docker inspect corehub-backend | grep docker.sock`
- Su Windows, assicurati che Docker Desktop abbia accesso ai volumi

### API /api/status ritorna errore 500

**Causa**: Docker non è accessibile dal container.

**Soluzione**:
```bash
# Verifica che il backend possa eseguire docker ps
docker exec corehub-backend docker ps

# Se fallisce, ricrea il container con il volume del socket
docker-compose down
docker-compose up -d
```

### Card non apre l'applicazione

**Causa**: Il servizio è veramente offline oppure l'URL è errato.

**Soluzione**:
- Verifica che l'app sia avviata: `docker ps | grep coremachine`
- Controlla l'URL in [apps.config.ts](apps/backend/src/config/apps.config.ts)
- Verifica che nginx stia inoltrando correttamente: `curl http://localhost:81`

### Frontend mostra schermata bianca

**Causa**: Errore JavaScript o problema di build.

**Soluzione**:
```bash
# Controlla i logs del frontend
docker logs corehub-frontend

# Rebuilda il frontend
docker-compose up -d --build frontend
```

## Integrazione con CoreServices

CoreHub si integra con l'infrastruttura CoreServices tramite:

1. **Network Condivisa** (`core-network`) - Comunicazione tra container
2. **Nginx Reverse Proxy** - Routing sulla porta 80
3. **Docker Socket** - Monitoraggio stato container

### Configurazione Nginx

In [CoreServices/nginx/nginx.conf](../CoreServices/nginx/nginx.conf):

```nginx
# CoreHub - Porta 80 (Dashboard Centrale)
server {
    listen 80;
    server_name localhost;

    location /api {
        proxy_pass http://corehub-backend;
        # ...
    }

    location / {
        proxy_pass http://corehub-frontend;
        # ...
    }
}
```

## Roadmap

- [ ] Grafici di uptime per servizio
- [ ] Notifiche push quando un servizio va offline
- [ ] Pulsante "Restart" per admin (con autenticazione)
- [ ] Logs in tempo reale nella dashboard
- [ ] Health checks personalizzati oltre a Docker status
- [ ] Dark/Light mode toggle
- [ ] Supporto per metriche (CPU, RAM, Network)

## Link Correlati

- **CoreMachine**: http://localhost:81
- **CoreDocument**: http://localhost:82
- **CoreServices**: [../CoreServices/README.md](../CoreServices/README.md)

## Licenza

© 2025 CoreSuite - Sistema Gestionale Integrato
