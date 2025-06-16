document.addEventListener('DOMContentLoaded', () => {
  // Referencias al DOM
  const txtInput       = document.getElementById('fileInput');      // BD.txt
  const excelInput     = document.getElementById('excelInput');    // Excel destino
  const selectorDiv    = document.getElementById('selectorCitas');
  const citaSelect     = document.getElementById('citaSelect');
  const detalleDiv     = document.getElementById('detalleYFormulario');
  const datosCitaPre   = document.getElementById('datosCita');
  const formAtencion   = document.getElementById('trabajadorForm');

  let citas = [], headersTxt = [];
  let workbook, sheetName;

  // --- 1) Cargar BD.txt ---
  txtInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = reader.result.trim().split('\n');
      headersTxt = lines.shift().split(';');
      citas = lines.map(line => {
        const cols = line.split(';');
        const obj = {};
        headersTxt.forEach((h,i) => obj[h] = cols[i]);
        return obj;
      });
      // Poblar selector
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

  // --- 2) Cargar Excel destino ---
  excelInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      // Leer workbook con SheetJS
      workbook  = XLSX.read(evt.target.result, { type: 'binary' });
      sheetName = workbook.SheetNames[0];
      alert(`Excel cargado: ${file.name} (hoja: ${sheetName})`);
    };
    reader.readAsBinaryString(file);
  });

  // --- 3) Mostrar datos de la cita seleccionada ---
  citaSelect.addEventListener('change', () => {
    const idx = citaSelect.value;
    if (idx === '') {
      detalleDiv.style.display = 'none';
      return;
    }
    const c = citas[idx];
    datosCitaPre.textContent = headersTxt.map(h => `${h}: ${c[h]}`).join('\n');
    detalleDiv.style.display = 'block';
  });

  // --- 4) Envío del formulario de atención y append al Excel ---
  formAtencion.addEventListener('submit', e => {
    e.preventDefault();
    // Validaciones mínimas
    if (!workbook) return alert('Primero selecciona el Excel destino.');
    if (citaSelect.value === '') return alert('Selecciona una cita.');

    // Datos de la cita pre-llenada
    const cita = citas[ citaSelect.value ];

    // Datos que el trabajador acaba de ingresar
    const fd = new FormData(formAtencion);
    const at   = {
      razonServicio:          fd.get('razonServicio'),
      horaAtencion:           fd.get('horaAtencion'),
      rutEspecialista:        fd.get('rutEspecialista'),
      nombreEspecialista:     fd.get('nombreEspecialista'),
      emiteReceta:            fd.get('emiteReceta'),
      emiteDiagnostico:       fd.get('emiteDiagnostico'),
      diagnostico:            fd.get('diagnostico') || '',
      costoServicioCliente:   fd.get('costoServicioCliente'),
      costoPromedioMedicamento: fd.get('costoPromedioMedicamento'),
      insumos:                fd.get('insumos'),
      tipoCosto:              fd.get('tipoCosto'),
      insumosCostoVeterinaria: fd.get('insumosCostoVeterinaria'),
      ingresosVeterinaria:    fd.get('ingresosVeterinaria')
    };

    // Calcular Tiempo de Espera en minutos
    // Convierte fecha y hora agendada + hora atención a Date para diff
    const fechaAgendada = new Date(
      Number(cita.año), Number(cita.mes)-1, Number(cita.dia),
      ...cita.hora.split(':').map(x=>Number(x))
    );
    const horaAt       = fd.get('horaAtencion').split(':').map(x=>Number(x));
    const fechaAt      = new Date(
      fechaAgendada.getFullYear(),
      fechaAgendada.getMonth(),
      fechaAgendada.getDate(),
      horaAt[0], horaAt[1]
    );
    const esperaMin = Math.round( (fechaAt - fechaAgendada) / 60000 );

    // --- 4.1) Leer hoja y datos actuales ---
    const ws   = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    // Asume que la primera fila es cabecera
    // Append fila en el mismo orden que tu estructura:
    const newRow = [
      // ID Mascota y datos de la cita
      cita.idMascota,
      cita.nombreMascota,
      cita.edadMascota,
      cita.sexoMascota,
      cita.tipoAnimal,
      cita.razaMascota,
      cita.rutDueño,
      cita.nombreDueño,
      cita.direccion,
      cita.region,
      cita.servicio,
      cita.subservicio,
      // Datos del trabajador
      at.razonServicio,
      // Fecha original
      cita.dia,
      cita.mes,
      cita.año,
      cita.hora,
      // Hora de atención y espera
      at.horaAtencion,
      esperaMin,
      // Especialista
      at.rutEspecialista,
      at.nombreEspecialista,
      // Receta / diagnóstico
      at.emiteReceta,
      at.emiteDiagnostico,
      at.diagnostico,
      // Costos e insumos
      at.costoServicioCliente,
      at.costoPromedioMedicamento,
      at.insumos,
      at.tipoCosto,
      at.insumosCostoVeterinaria,
      at.ingresosVeterinaria
    ];

    data.push(newRow);

    // --- 4.2) Sobreescribir sheet y descargar Excel ---
    const newWs = XLSX.utils.aoa_to_sheet(data);
    workbook.Sheets[sheetName] = newWs;
    XLSX.writeFile(workbook, 'Trabajo_actualizado.xlsx');

    alert('Atención registrada y Excel descargado.');
    formAtencion.reset();
    detalleDiv.style.display = 'none';
  });

});
