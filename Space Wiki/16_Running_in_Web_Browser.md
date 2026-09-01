# Running the Game in Web Browser

## Quick Start

### 1. Start the Dev Server

```powershell
cd C:\Users\ina25\OneDrive\Documents\GitHub\Mobile-Invaders
npm run dev
```

This starts Vite on **http://localhost:5173/**

### 2. Open in Browser

- Navigate to `http://localhost:5173` in your browser
- Or run: `Start-Process "http://localhost:5173"`

### 3. Stop the Server

Press `Ctrl + C` in the terminal running the dev server.

---

## Available Commands

| Command | Purpose | Port |
|---------|---------|------|
| `npm run dev` | Dev server with hot reload | 5173 |
| `npm run build` | Build production bundle | — |
| `npm run preview` | Preview production build | 4173 |

---

## Common Issues

### "Site can't be reached"
- The dev server may have stopped — restart it with `npm run dev`
- The server runs in the foreground; if the terminal closes, the server stops

### Game loads but nothing appears
- Open browser console (`F12` → Console tab) and check for JS errors
- Verify `assets/` and `src/` are copied (Vite plugin copies them to output)

### Port already in use
- Kill the existing process: `Get-Process -Name node | Stop-Process`
- Or use a different port: `npm run dev -- --port 3000`

---

## Browser Testing Notes

- Use Chrome DevTools mobile emulator (`F12` → toggle device toolbar) for mobile testing
- Test touch controls by enabling touch emulation in DevTools
- Game canvas is 540×960 (portrait mode)
