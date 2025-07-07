// Check if user exists by RUT
        function getUserByRUT(rut) {
            const users = JSON.parse(localStorage.getItem('mascotaFelizUsers') || '[]');
            return users.find(user => user.rut === rut);
        }

        // Enhanced RUT Formatting and Validation (same as register and login)
        function formatRUT(input) {
            // Remove all non-alphanumeric characters except K
            let value = input.value.replace(/[^0-9kK]/g, '');
            
            if (value.length > 1) {
                let rut = value.slice(0, -1);
                let dv = value.slice(-1);
                
                // Add dots to RUT (only if more than 3 digits)
                if (rut.length > 3) {
                    rut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                }
                
                input.value = rut + '-' + dv;
            } else {
                input.value = value;
            }
            
            // Real-time validation
            const rutInput = document.getElementById('rut');
            const rutError = document.getElementById('rutError');
            const rutSuccess = document.getElementById('rutSuccess');
            
            if (input.value.length >= 9) { // Minimum: 1.234.567-8
                if (validateRUT(input.value)) {
                    // Check if RUT exists in registered users
                    const user = getUserByRUT(input.value);
                    if (user) {
                        rutInput.classList.remove('error');
                        rutInput.classList.add('success');
                        rutError.classList.remove('show');
                        rutSuccess.classList.add('show');
                    } else {
                        rutInput.classList.remove('success');
                        rutInput.classList.add('error');
                        rutSuccess.classList.remove('show');
                        rutError.textContent = 'Este RUT no está registrado';
                        rutError.classList.add('show');
                    }
                } else {
                    rutInput.classList.remove('success');
                    rutInput.classList.add('error');
                    rutSuccess.classList.remove('show');
                    rutError.textContent = 'RUT inválido. Verifica el dígito verificador';
                    rutError.classList.add('show');
                }
            } else if (input.value.length > 0) {
                // Show neutral state while typing
                rutInput.classList.remove('error', 'success');
                rutError.classList.remove('show');
                rutSuccess.classList.remove('show');
            } else {
                // Empty field
                rutInput.classList.remove('error', 'success');
                rutError.classList.remove('show');
                rutSuccess.classList.remove('show');
            }
        }

        function validateRUT(rut) {
            // Remove all formatting
            const cleanRUT = rut.replace(/[.-\s]/g, '');
            
            // Check minimum length (7 digits + 1 verification digit)
            if (cleanRUT.length < 8 || cleanRUT.length > 9) {
                return false;
            }
            
            // Separate RUT number from verification digit
            const rutNumbers = cleanRUT.slice(0, -1);
            const dv = cleanRUT.slice(-1).toLowerCase();
            
            // Validate that RUT numbers are actually numbers
            if (!/^\d+$/.test(rutNumbers)) {
                return false;
            }
            
            // Calculate verification digit using Chilean algorithm
            let sum = 0;
            let multiplier = 2;
            
            // Calculate from right to left
            for (let i = rutNumbers.length - 1; i >= 0; i--) {
                sum += parseInt(rutNumbers[i]) * multiplier;
                multiplier = multiplier === 7 ? 2 : multiplier + 1;
            }
            
            const remainder = sum % 11;
            const calculatedDV = remainder < 2 ? remainder.toString() : 'k';
            
            return dv === calculatedDV;
        }

        // Form Submission
        function handleRecovery(event) {
            event.preventDefault();
            
            const rutInput = document.getElementById('rut');
            const rutError = document.getElementById('rutError');
            const rutSuccess = document.getElementById('rutSuccess');
            const recoveryBtn = document.getElementById('recoveryBtn');
            
            let isValid = true;
            
            // Reset error states
            rutInput.classList.remove('error');
            rutError.classList.remove('show');
            
            // Validate RUT and check if user exists
            if (!rutInput.value || !validateRUT(rutInput.value)) {
                rutInput.classList.add('error');
                rutError.textContent = 'Por favor, ingresa un RUT válido';
                rutError.classList.add('show');
                rutSuccess.classList.remove('show');
                isValid = false;
            } else {
                const user = getUserByRUT(rutInput.value);
                if (!user) {
                    rutInput.classList.add('error');
                    rutError.textContent = 'Este RUT no está registrado. ¿Deseas crear una cuenta?';
                    rutError.classList.add('show');
                    rutSuccess.classList.remove('show');
                    isValid = false;
                }
            }
            
            if (isValid) {
                // Show loading state
                recoveryBtn.classList.add('loading');
                recoveryBtn.textContent = 'Enviando...';
                recoveryBtn.disabled = true;
                
                // Simulate email sending process
                setTimeout(() => {
                    const user = getUserByRUT(rutInput.value);
                    console.log('Password recovery email sent to:', user.email, 'for RUT:', rutInput.value);
                    
                    // Show success state
                    showSuccess();
                }, 2000);
            }
        }

        // Show success state
        function showSuccess() {
            const formState = document.getElementById('formState');
            const successState = document.getElementById('successState');
            
            formState.style.display = 'none';
            successState.classList.add('show');
        }

        // Show form state (for retry)
        function showForm() {
            const formState = document.getElementById('formState');
            const successState = document.getElementById('successState');
            const recoveryBtn = document.getElementById('recoveryBtn');
            
            successState.classList.remove('show');
            successState.style.display = 'none';
            formState.style.display = 'block';
            
            // Reset button state
            recoveryBtn.classList.remove('loading');
            recoveryBtn.textContent = 'Enviar Enlace de Recuperación';
            recoveryBtn.disabled = false;
            
            // Clear form
            document.getElementById('rut').value = '';
            document.getElementById('rut').classList.remove('error', 'success');
            document.getElementById('rutError').classList.remove('show');
            document.getElementById('rutSuccess').classList.remove('show');
        }

        // Back Button
        function goBack() {
            window.location.href = '';
        }

        // Add smooth focus transitions
        document.addEventListener('DOMContentLoaded', function() {
            const inputs = document.querySelectorAll('.form-input');
            
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.style.transform = 'translateY(-2px)';
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.style.transform = 'translateY(0)';
                });
            });
        });