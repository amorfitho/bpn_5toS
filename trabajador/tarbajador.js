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
    if (!workbook) return alert('Primero selecciona el Excel destino.');
    if (citaSelect.value === '') return alert('Selecciona una cita.');

    // Datos de la cita
    const cita = citas[citaSelect.value];

    // Datos ingresados por el trabajador
    const fd = new FormData(formAtencion);
    const at = {
      razonServicio:              fd.get('razonServicio'),
      horaAtencion:               fd.get('horaAtencion'),
      rutEspecialista:            fd.get('rutEspecialista'),
      nombreEspecialista:         fd.get('nombreEspecialista'),
      emiteReceta:                fd.get('emiteReceta'),
      emiteDiagnostico:           fd.get('emiteDiagnostico'),
      diagnostico:                fd.get('diagnostico') || '',
      costoServicioCliente:       parseFloat(fd.get('costoServicioCliente')) || 0,
      costoPromedioMedicamento:   parseFloat(fd.get('costoPromedioMedicamento')) || 0,
      insumosCostoVeterinaria:    parseFloat(fd.get('insumosCostoVeterinaria')) || 0,
      insumos:                    fd.get('insumos'),
      tipoCosto:                  fd.get('tipoCosto')
    };

    // Generar ID aleatorio de 4 dígitos
    const idMascota = Math.floor(1000 + Math.random() * 9000);

    // Calcular Tiempo de Espera en minutos
    const fechaAgendada = new Date(
      Number(cita.año), Number(cita.mes) - 1, Number(cita.dia),
      ...cita.hora.split(':').map(x => Number(x))
    );
    const [hAt, mAt] = at.horaAtencion.split(':').map(x => Number(x));
    const fechaAt    = new Date(
      fechaAgendada.getFullYear(),
      fechaAgendada.getMonth(),
      fechaAgendada.getDate(),
      hAt, mAt
    );
    const esperaMin = Math.round((fechaAt - fechaAgendada) / 60000);

    // Calcular Ingresos veterinaria
    const ingresosVeterinaria = at.costoServicioCliente
      + at.costoPromedioMedicamento
      - at.insumosCostoVeterinaria;

    // --- Leer hoja y datos actuales ---
    const ws   = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    // Construir nueva fila con el orden indicado
    const newRow = [
      idMascota,                        // ID Mascota aleatorio
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
      at.razonServicio,                 // Razón Atención Servicio
      cita.dia,                         // Día
      cita.mes,                         // Mes
      cita.año,                         // Año
      cita.hora,                        // Hora agendada
      at.horaAtencion,                  // Hora atención
      esperaMin,                        // Tiempo de Espera (minutos)
      at.rutEspecialista,               // RUT especialista
      at.nombreEspecialista,            // Nombre especialista
      at.emiteReceta,                   // ¿Se emite receta?
      at.emiteDiagnostico,              // ¿Se emite diagnóstico?
      at.diagnostico,                   // Diagnóstico
      at.costoServicioCliente,          // Costo Servicio (cliente)
      at.costoPromedioMedicamento,      // Costo Promedio Medicamento(s)
      at.insumos,                       // Insumos
      at.tipoCosto,                     // Tipo de costo
      at.insumosCostoVeterinaria,       // Insumos(costo promedio veterinaria)
      ingresosVeterinaria               // Ingresos veterinaria (calculado)
    ];

    data.push(newRow);

    // --- Sobreescribir sheet y descargar Excel actualizado ---
    workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);
    XLSX.writeFile(workbook, 'Trabajo_actualizado.xlsx');

    alert('Atención registrada y Excel descargado.');
    formAtencion.reset();
    detalleDiv.style.display = 'none';
  });

});