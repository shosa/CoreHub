# Test CoreHub - Istruzioni

## ✅ Stato Attuale

CoreHub è **ONLINE** e funzionante!

- ✅ Backend container running
- ✅ Frontend container running
- ✅ API `/api/status` funzionante
- ✅ Nginx aggiornato con nuova configurazione

## 🧪 Test Immediati

### 1. Apri la Dashboard

Apri il browser su: **http://localhost**

Dovresti vedere:
- **Header "Core Suite"** con gradiente viola/blu
- **2 Card** per CoreMachine e CoreDocument
- **Badge rossi "Offline"** (perché le app non sono avviate)
- **Pulsanti disabilitati** "Non Disponibile"

### 2. Avvia CoreMachine (Opzionale)

```bash
cd C:\Users\Stefano\Desktop\CoreSuite\CoreMachine
start.bat
```

**Dopo 30 secondi**, torna su http://localhost e vedrai:
- Badge CoreMachine diventa **verde "Online"**
- Pulsante "Apri Applicazione" si abilita
- Click sul pulsante → si apre CoreMachine in nuova tab

### 3. Avvia CoreDocument (Opzionale)

```bash
cd C:\Users\Stefano\Desktop\CoreSuite\CoreDocument
start.bat
```

**Dopo 30 secondi**, badge CoreDocument diventa verde.

## 🎨 Features da Notare

1. **Hover Effect** - Passa il mouse su una card online, si solleva con ombra colorata
2. **Auto-refresh** - Ogni 30 secondi aggiorna automaticamente gli stati
3. **Chip Contatore** - Mostra "X Servizi Online" / "Y Offline"
4. **Click to Open** - Click su card online apre app in nuova tab
5. **Design Responsive** - Funziona su desktop e mobile

## 🔧 Comandi Utili

```bash
# Ferma CoreHub
docker-compose down

# Riavvia CoreHub
docker-compose restart

# Logs in tempo reale
docker-compose logs -f

# Rebuild dopo modifiche
docker-compose up -d --build
```

## 📊 Porte Configurate

| URL | Servizio | Stato |
|-----|----------|-------|
| http://localhost | CoreHub Dashboard | ✅ ONLINE |
| http://localhost:81 | CoreMachine | ⚪ Da avviare |
| http://localhost:82 | CoreDocument | ⚪ Da avviare |

## 🚀 Prossimi Passi

1. ✅ Testa la dashboard su http://localhost
2. 🔄 Avvia CoreMachine/CoreDocument per vedere card online
3. 🎉 Goditi la tua dashboard centralizzata!

## 🐛 Troubleshooting

### Dashboard mostra schermata bianca

```bash
docker logs corehub-frontend
docker logs corehub-backend
```

### Backend non risponde

```bash
curl http://localhost:3001/api/status
docker restart corehub-backend
```

### Nginx non funziona

```bash
docker logs core-nginx
docker restart core-nginx
```

---

🎊 **CoreHub è pronto!** Divertiti con la tua nuova dashboard!
