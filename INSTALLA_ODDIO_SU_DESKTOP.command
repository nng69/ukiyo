#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/ODDIO"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Errore: cartella sorgente ODDIO non trovata accanto allo script." >&2
  exit 1
fi

DESKTOP_DIR=""
if command -v xdg-user-dir >/dev/null 2>&1; then
  DESKTOP_DIR="$(xdg-user-dir DESKTOP 2>/dev/null || true)"
fi

if [[ -z "$DESKTOP_DIR" || "$DESKTOP_DIR" == "$HOME" ]]; then
  for candidate in "$HOME/Desktop" "$HOME/Scrivania" "$HOME/OneDrive/Desktop" "$HOME/OneDrive/Scrivania"; do
    if [[ -d "$candidate" ]]; then
      DESKTOP_DIR="$candidate"
      break
    fi
  done
fi

if [[ -z "$DESKTOP_DIR" || "$DESKTOP_DIR" == "$HOME" ]]; then
  DESKTOP_DIR="$HOME/Desktop"
fi

mkdir -p "$DESKTOP_DIR"
rm -rf "$DESKTOP_DIR/ODDIO"
cp -R "$SOURCE_DIR" "$DESKTOP_DIR/ODDIO"

cat <<MSG
ODDIO installato sul Desktop:
$DESKTOP_DIR/ODDIO

Per avviare l'app:
1. apri $DESKTOP_DIR/ODDIO/index.html nel browser
2. oppure esegui $DESKTOP_DIR/ODDIO/AVVIA_ODDIO.sh e apri http://localhost:4173
MSG
