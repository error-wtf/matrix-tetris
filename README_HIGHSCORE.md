# Highscore-System - Matrix Tetris

## Wie es funktioniert

### **Lokaler Modus (Standard):**
- Highscores werden in **LocalStorage** gespeichert
- Funktioniert ohne Server
- Daten bleiben im Browser

### **Server-Modus (mit PHP):**
- Highscores werden in `highscores.json` gespeichert
- Alle Spieler sehen die gleichen Highscores
- Erfordert PHP-Server

---

## Server-Setup (Optional)

### **Voraussetzungen:**
- PHP 7.4+ installiert
- Webserver (Apache, Nginx, oder PHP Built-in Server)

### **Schnellstart mit PHP Built-in Server:**

```bash
cd E:\clone\Tetris
php -S localhost:8000
```

Dann öffne: `http://localhost:8000`

### **Apache/Nginx:**

1. Kopiere alle Dateien in dein Webroot (z.B. `htdocs/`)
2. Stelle sicher dass `save_highscore.php` ausführbar ist
3. Öffne die Seite über `http://localhost/tetris/`

---

## Dateien

| Datei | Zweck |
|-------|-------|
| `highscores.json` | Gespeicherte Highscores (wird automatisch erstellt) |
| `save_highscore.php` | Server-Script zum Speichern |
| `script.js` | Client-Code mit Fallback zu LocalStorage |

---

## Sicherheit

Das PHP-Script:
- ✅ Validiert Input
- ✅ Sanitized Namen (XSS-Schutz)
- ✅ Begrenzt auf Top 10
- ✅ CORS-Header für lokale Entwicklung

---

## Deployment

### **GitHub Pages:**
- Funktioniert **ohne PHP**
- Nutzt nur LocalStorage
- Jeder User hat eigene Highscores

### **Mit eigenem Server:**
- Upload aller Dateien via FTP
- PHP muss aktiviert sein
- `highscores.json` muss schreibbar sein (chmod 666)

---

## Troubleshooting

**Problem:** Highscores werden nicht gespeichert
- **Lösung:** Prüfe Browser-Console auf Fehler
- **Fallback:** LocalStorage funktioniert immer

**Problem:** PHP-Script funktioniert nicht
- **Lösung:** Prüfe ob PHP installiert ist (`php -v`)
- **Lösung:** Prüfe Dateiberechtigungen

**Problem:** CORS-Fehler
- **Lösung:** Nutze einen lokalen Server (nicht `file://`)
