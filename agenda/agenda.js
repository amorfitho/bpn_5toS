document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointmentForm');
  const STORAGE_KEY = 'appointmentsCsv';

  // 1) Inicializar CSV en localStorage (header) si no existe
  if (!localStorage.getItem(STORAGE_KEY)) {
    const header = [
      'rutDueño',
      'nombreDueño',
      'nombreMascota',
      'edadMascota',
      'sexoMascota',
      'tipoAnimal',
      'razaMascota',
      'direccion',
      'region',
      'servicio',
      'subservicio',
      'dia',
      'mes',
      'año',
      'hora',
      'timestamp'
    ].join(';');
    localStorage.setItem(STORAGE_KEY, header + '\n');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    // 2) Leer CSV actual
    let csv = localStorage.getItem(STORAGE_KEY);

    // 3) Recoger datos del formulario en array
    const fd = new FormData(form);
    const row = [
      fd.get('rutDueño'),
      fd.get('nombreDueño'),
      fd.get('nombreMascota'),
      fd.get('edadMascota'),
      fd.get('sexoMascota'),
      fd.get('tipoAnimal'),
      fd.get('razaMascota'),
      fd.get('direccion'),
      fd.get('region'),
      fd.get('servicio'),
      fd.get('subservicio'),
      fd.get('dia'),
      fd.get('mes'),
      fd.get('año'),
      fd.get('hora'),
      new Date().toISOString()
    ].join(';');

    // 4) Append al CSV y guardar en localStorage
    csv += row + '\n';
    localStorage.setItem(STORAGE_KEY, csv);

    // 5) Descargar BD.txt
    const blob = new Blob([csv], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'BD.txt';
    a.click();
    URL.revokeObjectURL(url);

    form.reset();
  });
});