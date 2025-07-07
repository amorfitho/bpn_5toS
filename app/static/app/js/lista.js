// Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effects to table rows
            const tableRows = document.querySelectorAll('tbody tr');
            tableRows.forEach(row => {
                row.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(2px)';
                });
                row.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0)';
                });
            });
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');

    botonesEliminar.forEach(button => {
        button.addEventListener('click', function() {
            const agendaId = this.dataset.id;
            if (confirm('¿Estás seguro que deseas eliminar esta agenda?')) {
                fetch(`/eliminar_agenda/${agendaId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Accept': 'application/json',
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.closest('tr').remove();  // Elimina la fila de la tabla
                    } else {
                        alert('Error al eliminar: ' + (data.error || 'Desconocido'));
                    }
                })
                .catch(error => {
                    alert('Error en la solicitud: ' + error);
                });
            }
        });
    });

    // Función para obtener el token CSRF desde las cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
