// User authentication functions
        function getUserByRUT(rut) {
            const users = JSON.parse(localStorage.getItem('mascotaFelizUsers') || '[]');
            return users.find(user => user.rut === rut);
        }

        function validateLogin(rut, password) {
            const user = getUserByRUT(rut);
            return user && user.password === password;
        }

        // Enhanced RUT Formatting and Validation (same as register)
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
            
            // Clear error state when user types
            const rutInput = document.getElementById('rut');
            const rutError = document.getElementById('rutError');
            rutInput.classList.remove('error');
            rutError.classList.remove('show');
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

        // Password Toggle
        function togglePassword() {
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

        // Form Submission
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
            if (!rutInput.value || !validateRUT(rutInput.value)) {
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
                
                // Simulate login process
                setTimeout(() => {
                    // Check credentials against stored users
                    if (validateLogin(rutInput.value, passwordInput.value)) {
                        // Successful login
                        const user = getUserByRUT(rutInput.value);
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        
                        alert(`¡Bienvenido/a ${user.fullName}!`);
                        window.location.href = '/';
                    } else {
                        // Failed login
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
                }, 2000);
            }
        }

        // Back Button
        function goBack() {
            window.location.href = '/';
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