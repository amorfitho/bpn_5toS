// ===== SIMPLE LOGIN FUNCTIONS =====
        
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

        // Validate login credentials
        function validateLogin(rut, password) {
            const user = getUserByRUT(rut);
            return user && user.password === password;
        }

        // Toggle password visibility
        function togglePasswordLogin() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.className = 'eye-icon eye-closed';
            } else {
                passwordInput.type = 'password';
                eyeIcon.className = 'eye-icon eye-open';
            }
        }

        // Handle login form submission
        function handleLogin(event) {
            event.preventDefault();
            
            const rutInput = document.getElementById('rut');
            const passwordInput = document.getElementById('password');
            const rutError = document.getElementById('rutError');
            const passwordError = document.getElementById('passwordError');
            const loginBtn = document.getElementById('loginBtn');
            
            let isValid = true;
            
            // Reset error states
            rutInput.classList.remove('error');
            passwordInput.classList.remove('error');
            rutError.classList.remove('show');
            passwordError.classList.remove('show');
            
            // Validate RUT
            if (!rutInput.value || !isValidRUTFormat(rutInput.value)) {
                rutInput.classList.add('error');
                rutError.textContent = 'Por favor, ingresa un RUT válido';
                rutError.classList.add('show');
                isValid = false;
            }
            
            // Validate Password
            if (!passwordInput.value || passwordInput.value.length < 1) {
                passwordInput.classList.add('error');
                passwordError.classList.add('show');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                loginBtn.classList.add('loading');
                loginBtn.textContent = 'Ingresando...';
                loginBtn.disabled = true;
                
                // Simulate login process
                setTimeout(() => {
                    if (validateLogin(rutInput.value, passwordInput.value)) {
                        const user = getUserByRUT(rutInput.value);
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        
                        alert(`¡Bienvenido/a ${user.fullName}!`);
                        window.location.href = '/';
                    } else {
                        rutInput.classList.add('error');
                        passwordInput.classList.add('error');
                        rutError.textContent = 'RUT o contraseña incorrectos';
                        rutError.classList.add('show');
                        passwordError.textContent = 'RUT o contraseña incorrectos';
                        passwordError.classList.add('show');
                    }
                    
                    // Reset button state
                    loginBtn.classList.remove('loading');
                    loginBtn.textContent = 'Ingresar';
                    loginBtn.disabled = false;
                }, 2000);
            }
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