# Setup CoreHub - Guida Rapida

## Prerequisiti

Prima di avviare CoreHub, assicurati che:

1. **CoreServices sia attivo**:
   ```bash
   cd C:\Users\Stefano\Desktop\CoreSuite\CoreServices
   start.bat
   ```

2. **CoreMachine e CoreDocument siano attivi** (opzionale, per testare il monitoring):
   ```bash
   cd C:\Users\Stefano\Desktop\CoreSuite\CoreMachine
   start.bat

   cd C:\Users\Stefano\Desktop\CoreSuite\CoreDocument
   start.bat
   ```

## Prima Build

```bash
cd C:\Users\Stefano\Desktop\CoreSuite\CoreHub

# Installa dipendenze
npm install

# Build con Docker
docker-compose up -d --build
```

La prima build richiederà 5-10 minuti perché deve:
- Scaricare le immagini Node.js
- Installare tutte le dipendenze npm
- Compilare TypeScript (backend)
- Buildare Next.js (frontend)

## Test

### 1. Verifica Container Attivi

```bash
docker ps --filter "name=corehub"
```

Dovresti vedere:
- `corehub-backend`
- `corehub-frontend`

### 2. Test API Status

```bash
curl http://localhost:3001/api/status
```

Risposta attesa (JSON con array di apps e loro status).

### 3. Accedi alla Dashboard

Apri il browser su: **http://localhost**

Dovresti vedere:
- ✅ Header "Core Suite" con gradiente
- ✅ Chip che mostra "X Servizi Online"
- ✅ Card per CoreMachine (porta 81)
- ✅ Card per CoreDocument (porta 82)
- ✅ Badge "Online" verde se le app sono attive, "Offline" rosso altrimenti

### 4. Test Navigazione

- Click su una card con badge "Online"
- Si apre l'app in una nuova tab
- La navigazione funziona correttamente

## Architettura Porte

| URL | Servizio | Descrizione |
|-----|----------|-------------|
| http://localhost | CoreHub | Dashboard centrale |
| http://localhost:81 | CoreMachine | Gestione Macchine |
| http://localhost:82 | CoreDocument | Gestione Documentale |
| http://localhost:3306 | MySQL | Database (CoreServices) |
| http://localhost:8080 | PHPMyAdmin | Admin MySQL |
| http://localhost:9001 | MinIO Console | Object Storage |

## Aggiungere una Nuova App

1. **Modifica [apps/backend/src/config/apps.config.ts](apps/backend/src/config/apps.config.ts)**:

   ```typescript
   {
     id: 'coreinventory',
     name: 'CoreInventory',
     description: 'Gestione Magazzino',
     icon: '📦',
     url: 'http://localhost:83',
     containerName: 'coreinventory-frontend',
     color: '#ed6c02',
   },
   ```

2. **Aggiungi routing in [CoreServices/nginx/nginx.conf](../CoreServices/nginx/nginx.conf)**:

   ```nginx
   # Upstream
   upstream coreinventory-backend {
       server coreinventory-backend:3001;
   }
   upstream coreinventory-frontend {
       server coreinventory-frontend:3000;
   }

   # Server block
   server {
       listen 83;
       server_name localhost;
       # ... proxy_pass config
   }
   ```

3. **Rebuilda CoreHub**:

   ```bash
   cd CoreHub
   docker-compose down
   docker-compose up -d --build
   ```

4. **Riavvia CoreServices nginx**:

   ```bash
   docker restart core-nginx
   ```

## Comandi Utili

```bash
# Logs in tempo reale
docker-compose logs -f

# Restart backend (dopo modifica apps.config.ts)
docker-compose restart backend

# Rebuild solo frontend
docker-compose up -d --build frontend

# Stop tutto
docker-compose down

# Rimuovi anche i volumi (reset completo)
docker-compose down -v
```

## Troubleshooting

### Tutti i servizi mostrano "Offline"

```bash
# Verifica che il backend possa accedere a Docker
docker exec corehub-backend docker ps

# Se fallisce, ricrea con permessi corretti
docker-compose down
docker-compose up -d
```

### Schermata bianca sul frontend

```bash
# Controlla logs
docker logs corehub-frontend

# Rebuilda
docker-compose up -d --build frontend
```

### Porta 80 già in uso

```bash
# Verifica cosa sta usando la porta 80
netstat -ano | findstr :80

# Se è un altro servizio, fermalo o cambia porta CoreHub
```

## Sviluppo Locale (senza Docker)

Se vuoi sviluppare senza Docker:

```bash
# Installa dipendenze
npm install

# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Accedi su http://localhost:3000
```

**Nota**: In dev mode l'API è su `localhost:3001`, in produzione Docker tutto passa da nginx su porta 80.

## Prossimi Passi

1. ✅ Testa la dashboard
2. ✅ Verifica che mostri lo stato corretto
3. ✅ Prova a fermare CoreMachine e vedi se il badge diventa rosso
4. ✅ Testa la navigazione alle app
5. 🔄 Quando aggiungi nuove app Core*, aggiungi alla config

---

🎉 **CoreHub è pronto!** Apri http://localhost e goditi la tua dashboard centralizzata!
