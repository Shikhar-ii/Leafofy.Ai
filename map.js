// LeafCheck outbreak map. Requires Leaflet (L) loaded first and <div id="map"></div>.
// Usage: LeafCheckMap.init({ dataPath: 'data/' });  then LeafCheckMap.addScan(scan) for live scans.
const LeafCheckMap = (() => {
  const RED = '#d62828', GREEN = '#2a9d3f';
  let map, layer, diseases = {};

  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function popupHtml(s) {
    const d = (diseases[s.label]) || {};
    const status = s.healthy ? 'Healthy' : 'Diseased';
    let html = `<strong>${esc(s.plant)}: ${esc(s.condition)}</strong><br>` +
      `Status: ${status}<br>Confidence: ${Math.round(s.confidence * 100)}%`;
    if (!s.healthy && d.severity) html += `<br>Severity: ${esc(d.severity)}`;
    if (!s.healthy && d.treatment) html += `<br><em>Tip:</em> ${esc(d.treatment[0])}`;
    if (s.timestamp) html += `<br><small>${new Date(s.timestamp).toLocaleDateString()}</small>`;
    return html;
  }

  function addScan(s) {
    const color = s.healthy ? GREEN : RED;
    L.circleMarker([s.lat, s.lng], {
      radius: 9, color: '#fff', weight: 2, fillColor: color, fillOpacity: 0.9
    }).bindPopup(popupHtml(s)).addTo(layer);
  }

  function addLegend() {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'leafcheck-legend');
      div.style.cssText = 'background:#fff;padding:8px 10px;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,.3);font:13px sans-serif;line-height:1.6';
      div.innerHTML = `<span style="color:${RED}">●</span> Diseased<br><span style="color:${GREEN}">●</span> Healthy`;
      return div;
    };
    legend.addTo(map);
  }

  async function init({ elementId = 'map', dataPath = 'data/', center = [38.926, -79.846], zoom = 11 } = {}) {
    map = L.map(elementId).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    layer = L.layerGroup().addTo(map);
    addLegend();
    try {
      const [dRes, sRes] = await Promise.all([
        fetch(dataPath + 'diseases.json'), fetch(dataPath + 'demo-scans.json')
      ]);
      diseases = (await dRes.json()).diseases;
      (await sRes.json()).scans.forEach(addScan);
    } catch (e) {
      console.error('LeafCheck map: failed to load data', e);
    }
    return map;
  }

  return { init, addScan };
})();
