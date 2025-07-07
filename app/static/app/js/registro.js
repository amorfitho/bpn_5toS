// ===== SIMPLE RUT FUNCTIONS =====
        
        // Simple RUT validation - just check basic format
        function isValidRUTFormat(rut) {
            // Remove any formatting and convert to uppercase
            const cleanRut = rut.replace(/[.\-\s]/g, '').toUpperCase();
            
            // Check if it has 8-9 characters and ends with number or K
            return /^[0-9]{7,8}[0-9K]$/.test(cleanRut);
        }

        // Clean RUT for storage and comparison
        function cleanRUT(rut) {
            return rut.replace(/[.\-\s]/g, '').toUpperCase();
        }

        // Format RUT as user types (simple version)
        function formatRUTRegister(input) {
            let value = input.value.replace(/[^0-9kK]/g, '').toUpperCase();
            
            // Limit to 9 characters max
            if (value.length > 9) {
                value = value.substring(0, 9);
            }
            
            input.value = value;
            
            // Simple validation
            if (value.length >= 8 && isValidRUTFormat(value)) {
                // Check if RUT already exists
                const existingUser = checkUserExists(value, '');
                if (existingUser) {
                    showRUTError('Este RUT ya está registrado');
                } else {
                    showRUTSuccess();
                }
            } else if (value.length > 0) {
                showRUTError('Ingrese un RUT válido (ej: 12345678K)');
            } else {
                hideRUTMessages();
            }
        }

        function showRUTError(message = 'Ingrese un RUT válido (ej: 12345678K)') {
            const rutInput = document.getElementById('rut');
            const rutError = document.getElementById('rutError');
            const rutSuccess = document.getElementById('rutSuccess');
            
            rutInput.classList.add('error');
            rutInput.classList.remove('success');
            rutError.textContent = message;
            rutError.classList.add('show');
            rutSuccess.classList.remove('show');
        }

        function showRUTSuccess() {
            const rutInput = document.getElementById('rut');
            const rutError = document.getElementById('rutError');
            const rutSuccess = document.getElementById('rutSuccess');
            
            rutInput.classList.remove('error');
            rutInput.classList.add('success');
            rutError.classList.remove('show');
            rutSuccess.classList.add('show');
        }

        function hideRUTMessages() {
            const rutInput = document.getElementById('rut');
            const rutError = document.getElementById('rutError');
            const rutSuccess = document.getElementById('rutSuccess');
            
            rutInput.classList.remove('error', 'success');
            rutError.classList.remove('show');
            rutSuccess.classList.remove('show');
        }

        // User data storage
        function saveUserData(userData) {
            let users = JSON.parse(localStorage.getItem('mascotaFelizUsers') || '[]');
            users.push(userData);
            localStorage.setItem('mascotaFelizUsers', JSON.stringify(users));
        }

        function checkUserExists(rut, email) {
            const users = JSON.parse(localStorage.getItem('mascotaFelizUsers') || '[]');
            const cleanInputRut = cleanRUT(rut);
            
            return users.find(user => {
                const userCleanRut = cleanRUT(user.rut);
                return userCleanRut === cleanInputRut || user.email === email;
            });
        }

        // Email Validation
        function validateEmailRegister(input) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            const emailSuccess = document.getElementById('emailSuccess');
            
            if (input.value) {
                if (emailRegex.test(input.value)) {
                    // Check if email already exists
                    const existingUser = checkUserExists('', input.value);
                    if (existingUser) {
                        emailInput.classList.remove('success');
                        emailInput.classList.add('error');
                        emailSuccess.classList.remove('show');
                        emailError.textContent = 'Este correo ya está registrado';
                        emailError.classList.add('show');
                    } else {
                        emailInput.classList.remove('error');
                        emailInput.classList.add('success');
                        emailError.classList.remove('show');
                        emailSuccess.classList.add('show');
                    }
                } else {
                    emailInput.classList.remove('success');
                    emailInput.classList.add('error');
                    emailSuccess.classList.remove('show');
                    emailError.textContent = 'Por favor, ingresa un correo válido';
                    emailError.classList.add('show');
                }
            } else {
                emailInput.classList.remove('error', 'success');
                emailError.classList.remove('show');
                emailSuccess.classList.remove('show');
            }
        }

        // Password Match Validation
        function validatePasswordMatch() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const confirmPasswordError = document.getElementById('confirmPasswordError');
            const confirmPasswordSuccess = document.getElementById('confirmPasswordSuccess');
            
            if (confirmPassword) {
                if (password === confirmPassword) {
                    confirmPasswordInput.classList.remove('error');
                    confirmPasswordInput.classList.add('success');
                    confirmPasswordError.classList.remove('show');
                    confirmPasswordSuccess.classList.add('show');
                } else {
                    confirmPasswordInput.classList.remove('success');
                    confirmPasswordInput.classList.add('error');
                    confirmPasswordSuccess.classList.remove('show');
                    confirmPasswordError.classList.add('show');
                }
            } else {
                confirmPasswordInput.classList.remove('error', 'success');
                confirmPasswordError.classList.remove('show');
                confirmPasswordSuccess.classList.remove('show');
            }
        }

        // Toggle password visibility
        function togglePasswordRegister(inputId, iconId) {
            const passwordInput = document.getElementById(inputId);
            const eyeIcon = document.getElementById(iconId);
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.className = 'eye-icon eye-closed';
            } else {
                passwordInput.type = 'password';
                eyeIcon.className = 'eye-icon eye-open';
            }
        }

        // Form Submission
        function handleRegister(event) {
            event.preventDefault();
            
            const formData = {
                fullName: document.getElementById('fullName').value,
                rut: document.getElementById('rut').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };
            
            const registerBtn = document.getElementById('registerBtn');
            let isValid = true;
            
            // Reset all error states
            document.querySelectorAll('.form-input').forEach(input => {
                input.classList.remove('error');
            });
            document.querySelectorAll('.error-message').forEach(error => {
                error.classList.remove('show');
            });
            
            // Validate all fields
            if (!formData.fullName.trim()) {
                document.getElementById('fullName').classList.add('error');
                document.getElementById('nameError').classList.add('show');
                isValid = false;
            }
            
            if (!isValidRUTFormat(formData.rut) || checkUserExists(formData.rut, '')) {
                document.getElementById('rut').classList.add('error');
                document.getElementById('rutError').classList.add('show');
                isValid = false;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) || checkUserExists('', formData.email)) {
                document.getElementById('email').classList.add('error');
                document.getElementById('emailError').classList.add('show');
                isValid = false;
            }
            
            if (formData.password.length < 6) {
                document.getElementById('password').classList.add('error');
                document.getElementById('passwordError').classList.add('show');
                isValid = false;
            }
            
            if (formData.password !== formData.confirmPassword) {
                document.getElementById('confirmPassword').classList.add('error');
                document.getElementById('confirmPasswordError').classList.add('show');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                registerBtn.classList.add('loading');
                registerBtn.textContent = 'Creando cuenta...';
                registerBtn.disabled = true;
                
                // Simulate registration process
                setTimeout(() => {
                    // Save user data with clean RUT for consistent storage
                    const userData = {
                        fullName: formData.fullName,
                        rut: cleanRUT(formData.rut), // Store clean RUT
                        email: formData.email,
                        password: formData.password,
                        registrationDate: new Date().toISOString()
                    };
                    
                    saveUserData(userData);
                    
                    // Reset button state
                    registerBtn.classList.remove('loading');
                    registerBtn.textContent = 'Crear Cuenta';
                    registerBtn.disabled = false;
                    
                    // Show success and redirect
                    alert('¡Cuenta creada exitosamente! Serás redirigido al inicio de sesión.');
                    window.location.href = '/login';
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