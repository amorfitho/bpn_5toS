document.addEventListener("DOMContentLoaded", function () {
    const rutInput = document.querySelector("input[name='rut_dueño']");
    const celularInput = document.querySelector("input[name='celular_duenio']");
    const form = document.querySelector(".agendar-form");

    function validarRut(rutCompleto) {
        rutCompleto = rutCompleto.replace(/\./g, "").replace(/-/g, "").toUpperCase();
        if (!/^\d{7,8}[0-9K]$/.test(rutCompleto)) return false;

        let rut = rutCompleto.slice(0, -1);
        let dv = rutCompleto.slice(-1);

        let suma = 0;
        let multiplo = 2;

        for (let i = rut.length - 1; i >= 0; i--) {
            suma += parseInt(rut.charAt(i)) * multiplo;
            multiplo = multiplo < 7 ? multiplo + 1 : 2;
        }

        let dvEsperado = 11 - (suma % 11);
        dvEsperado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

        return dv === dvEsperado;
    }

    function validarCelular(valor) {
        return /^[9]\d{8}$/.test(valor);
    }

    form.addEventListener("submit", function (e) {
        let errores = [];

        // Validar RUT
        if (rutInput && !validarRut(rutInput.value)) {
            errores.push("El RUT ingresado no es válido.");
            rutInput.classList.add("error");
        } else {
            rutInput.classList.remove("error");
        }

        // Validar celular
        if (celularInput && !validarCelular(celularInput.value)) {
            errores.push("El número de celular debe comenzar con 9 y tener 9 dígitos.");
            celularInput.classList.add("error");
        } else {
            celularInput.classList.remove("error");
        }

        if (errores.length > 0) {
            e.preventDefault();
            alert(errores.join("\n"));
        }
    });
    
});
            // Back Button
        function goBack() {
            window.location.href = '/';
        }