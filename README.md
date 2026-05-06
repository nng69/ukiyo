# ODDIO

ODDIO è una web app dimostrativa per l'Italia che mette in relazione eventi di cronaca e indicatori d'odio ispirati al framework spagnolo HODIO (Huella del Odio y la Polarización).

## Funzionalità

- Dashboard con filtri per regione italiana, provincia italiana e settimana.
- KPI e grafici per indice composito, prevalenza, amplificazione, incitamento e polarizzazione.
- Lista di eventi contestuali che possono aver condizionato gli scostamenti degli indici.
- Generazione di report settimanali scaricabili in PDF tramite jsPDF, con fallback alla stampa del browser.
- Modulo di iscrizione email a campo singolo con simulazione double opt-in in `localStorage`.

## Avvio locale

Essendo un prototipo statico, basta servire la cartella con un web server:

```bash
python3 -m http.server 4173
```

Poi aprire `http://localhost:4173`.



## Se non trovi la cartella sul Desktop

La cartella creata dall'agente dentro l'ambiente di sviluppo non compare automaticamente sul Desktop del tuo computer. Dopo aver scaricato o clonato questo repository, esegui lo script `INSTALLA_ODDIO_SU_DESKTOP.sh` / `INSTALLA_ODDIO_SU_DESKTOP.command` su Linux/macOS oppure `INSTALLA_ODDIO_SU_DESKTOP.bat` su Windows: lo script copierà `ODDIO/` nel Desktop reale del tuo utente.

## Pacchetto Desktop

La cartella `ODDIO/` contiene una copia pronta da mettere sul Desktop: apri `ODDIO/index.html` direttamente nel browser oppure avvia `ODDIO/AVVIA_ODDIO.sh` / `ODDIO/AVVIA_ODDIO.command` per servirla localmente su `http://localhost:4173`.

## Nota sui dati

I dati inclusi sono sintetici e servono a dimostrare l'esperienza utente. Una versione di produzione dovrebbe integrare fonti pubbliche autorizzate, rassegna stampa verificata, revisione umana, audit dei modelli, anonimizzazione e un backend per reportistica e double opt-in reale.


## Riferimenti HODIO

- Sito OBERAXE/HODIO del Ministerio de Inclusión, Seguridad Social y Migraciones: https://www.inclusion.gob.es/web/oberaxe/hodio
- Nota istituzionale sul lancio di HODIO: https://www.inclusion.gob.es/en/w/el-presidente-del-gobierno-anuncia-la-herramienta-hodio-para-medir-el-discurso-de-odio-en-redes-sociales
