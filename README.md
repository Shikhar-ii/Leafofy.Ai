# LeafCheck

LeafCheck identifies plant diseases from leaf photos and shows scan results on an outbreak map. This README covers the disease data, demo scans, and map.

## Project structure

```
data/
  diseases.json      Disease info for all 38 model labels
  demo-scans.json    13 fake scans for the demo
map/
  map.js             Leaflet outbreak map
```

## Disease data (`data/diseases.json`)

Covers the 38 PlantVillage classes (e.g. `Tomato___Late_blight`, `Apple___healthy`). Keys must match your model's output labels exactly.

Each entry has:

| Field | Description |
|---|---|
| `plant` | Plant name |
| `condition` | Disease name, or "Healthy" |
| `severity` | `none`, `low`, `moderate` or `high` |
| `description` | One-sentence plain-language summary |
| `symptoms` | List of what to look for |
| `treatment` | List of suggested actions |
| `prevention` | List of prevention tips |
| `source` | Institution the content is based on |

Example lookup:

```js
const { diseases } = await (await fetch('data/diseases.json')).json();
const info = diseases['Tomato___Late_blight'];
console.log(info.severity); // "high"
```

**Note:** Content was written from general knowledge and tagged with matching sources (Cornell, UMN Extension, Penn State, UF/IFAS, UC IPM, USDA). It has not been checked against the live pages, so verify entries (especially high-severity ones) before public use. Treatment text is general guidance, not professional advice.

## Demo scans (`data/demo-scans.json`)

13 fake scans around Elkins, WV, including a cluster of tomato and potato late blight to act as an outbreak hotspot.

Each scan has: `id`, `label`, `plant`, `condition`, `healthy` (boolean), `confidence` (0-1), `lat`, `lng`, `timestamp`.

## Outbreak map (`map/map.js`)

Leaflet map with **red** markers for diseased scans and **green** for healthy ones. Clicking a marker shows plant, condition, confidence, severity and a treatment tip. A legend sits in the bottom-right.

### Setup

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div id="map" style="height: 500px"></div>

<script src="map/map.js"></script>
<script>
  LeafCheckMap.init({ dataPath: 'data/' });
</script>
```

### API

- `LeafCheckMap.init(options)` creates the map and loads both JSON files. Options:
  - `elementId` (default `'map'`)
  - `dataPath` (default `'data/'`)
  - `center` (default `[38.926, -79.846]`)
  - `zoom` (default `11`)
- `LeafCheckMap.addScan(scan)` adds a marker, e.g. after a live scan:

```js
LeafCheckMap.addScan({
  label: 'Tomato___Early_blight', plant: 'Tomato', condition: 'Early blight',
  healthy: false, confidence: 0.89, lat: 38.93, lng: -79.85,
  timestamp: new Date().toISOString()
});
```

### Running locally

The map loads JSON with `fetch`, so open the page through a local server rather than double-clicking the file:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Credits

Disease labels follow the PlantVillage dataset. Map tiles are from OpenStreetMap contributors.
