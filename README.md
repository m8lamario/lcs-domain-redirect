# lcs-domain-redirect

Progetto Next.js dedicato **solo** ai redirect permanenti (308) dai vecchi domini verso il sito nuovo.

- `estudentsleague.com` / `www.estudentsleague.com`
- `estudentsleague.it` / `www.estudentsleague.it`

ogni vecchio URL va in **un solo hop** a `https://www.legacalciostudenti.com`, con path già tradotto nella mappa del sito principale e query string conservata.

## Va tenuto attivo a tempo indeterminato

Finché i vecchi domini restano raggiungibili, questo progetto deve restare deployato. Spegnendolo, i bookmark, i backlink e i risultati di ricerca verso `estudentsleague.*` smettono di arrivare al sito nuovo.

## Aggiornare la mappa percorsi

Le regole stanno in `next.config.ts` (`PATH_MAP`), nello stesso ordine dal più specifico al più generico. Se cambia la mappa in `next.config.ts` del sito principale (repo LegaCalcioStudenti), va replicata qui, altrimenti i vecchi URL fanno una catena (questo progetto → path obsoleto → redirect del sito nuovo).

Verifica locale o su un deploy di anteprima:

```bash
npm run build
npm start
BASE_URL=http://127.0.0.1:3000 npm run check-redirects
BASE_URL=https://DEPLOY-DI-ANTEPRIMA.vercel.app npm run check-redirects
```
