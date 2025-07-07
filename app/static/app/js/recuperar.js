// Check if user exists by RUT
        // Clean RUT (remove dots and dash, uppercase K)
        function cleanRUT(rut) {
            return rut.replace(/[.\-\s]/g, '').toUpperCase();
        }

        // Simple RUT validation - just check basic format
        function isValidRUTFormat(rut) {
            const cleanRut = cleanRUT(rut);
            return /^[0-9]{7,8}[0-9K]$/.test(cleanRut);
        }

        // Format RUT as user types (simple version)
        function formatRUTLogin(input) {
            let value = input.value.replace(/[^0-9kK]/g, '').toUpperCase();
            
            // Limit to 9 characters max
            if (value.length > 9) {
                value = value.substring(0, 9);
            }
            
            input.value = value;
            
            // Clear error states
            const rutInput = document.getElementById('rut');
            const rutError = document.getElementById('rutError');
            rutInput.classList.remove('error');
            rutError.classList.remove('show');
        }

        // Find user by RUT
        function getUserByRUT(rut) {
            const rutClean = cleanRUT(rut);
            const users = JSON.parse(localStorage.getItem('mascotaFelizUsers') || '[]');
            return users.find(user => {
                // Compare clean RUTs
                const userRutClean = cleanRUT(user.rut);
                return userRutClean === rutClean;
            });
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
            // Validate RUT
            if (!rutInput.value || !isValidRUTFormat(rutInput.value)) {
                rutInput.classList.add('error');
                rutError.textContent = 'Por favor, ingresa un RUT válido';
                rutError.classList.add('show');
                isValid = false;
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
            window.location.href = '/login';
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