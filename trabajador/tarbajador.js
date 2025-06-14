// /js/trabajador.js
document.addEventListener('DOMContentLoaded', () => {
  const fileInput      = document.getElementById('fileInput');
  const selectorDiv    = document.getElementById('selectorCitas');
  const citaSelect     = document.getElementById('citaSelect');
  const detalleDiv     = document.getElementById('detalleYFormulario');
  const datosCitaPre   = document.getElementById('datosCita');
  const formAtencion   = document.getElementById('trabajadorForm');
  let citas = [];
  let headers = [];

  // 1) Leer BD.txt como CSV
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = reader.result.trim().split('\n');
      headers = lines.shift().split(';');
      citas = lines.map(line => {
        const cols = line.split(';');
        const obj = {};
        headers.forEach((h,i) => obj[h] = cols[i]);
        return obj;
      });

      // poblar <select>
      citaSelect.innerHTML = '<option value="">-- elige --</option>';
      citas.forEach((c,i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${c.nombreDueño} – ${c.dia}/${c.mes}/${c.año} ${c.hora}`;
        citaSelect.appendChild(opt);
      });
      selectorDiv.style.display = 'block';
    };
    reader.readAsText(file, 'utf-8');
  });

  // 2) Al elegir cita, mostrar datos + formulario
  citaSelect.addEventListener('change', () => {
    const idx = citaSelect.value;
    if (idx === '') {
      detalleDiv.style.display = 'none';
      return;
    }
    const c = citas[idx];
    // mostramos cada campo del objeto en texto plano
    datosCitaPre.textContent = headers
      .map(h => `${h}: ${c[h]}`)
      .join('\n');
    detalleDiv.style.display = 'block';
  });

  // 3) Mostrar campo diagnóstico si corresponde
  formAtencion.emiteDiagnostico.forEach(r => {
    r.addEventListener('change', () => {
      document.getElementById('campoDiagnostico').style.display =
        r.value === 'sí' ? 'block' : 'none';
    });
  });

  // 4) Envío de formulario de atención
  formAtencion.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(formAtencion);
    const datos = {};
    for (let [k,v] of fd.entries()) datos[k] = v;
    console.log('Atención registrada:', datos);
    alert('Atención guardada en consola.');
    formAtencion.reset();
    document.getElementById('campoDiagnostico').style.display = 'none';
  });
});