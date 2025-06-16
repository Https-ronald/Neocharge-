export default function AdminLoginPage() {
  return (
    <html>
      <head>
        <title>Admin Login - NeoCharge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "Arial, sans-serif" }}>
        <div id="admin-login-container">
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                padding: "32px",
              }}
            >
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#3b82f6",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    color: "white",
                    fontSize: "24px",
                  }}
                >
                  🛡️
                </div>
                <h1
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "8px",
                    margin: 0,
                  }}
                >
                  Admin Login
                </h1>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  Enter your admin credentials to access the dashboard
                </p>
              </div>

              {/* Quick Fill */}
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #dbeafe",
                  borderRadius: "6px",
                  padding: "16px",
                  marginBottom: "24px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1d4ed8",
                    marginBottom: "8px",
                    margin: 0,
                  }}
                >
                  Test Credentials:
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#3730a3",
                    marginBottom: "12px",
                    margin: "8px 0 12px 0",
                  }}
                >
                  Username: admin | Password: admin123
                </p>
                <button
                  type="button"
                  onclick="fillCredentials()"
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "white",
                    border: "1px solid #3b82f6",
                    borderRadius: "6px",
                    color: "#3b82f6",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Quick Fill Test Credentials
                </button>
              </div>

              {/* Error/Success Messages */}
              <div
                id="error-message"
                style={{
                  display: "none",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                  padding: "12px",
                  marginBottom: "16px",
                  color: "#dc2626",
                  fontSize: "14px",
                }}
              ></div>

              <div
                id="success-message"
                style={{
                  display: "none",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "6px",
                  padding: "12px",
                  marginBottom: "16px",
                  color: "#16a34a",
                  fontSize: "14px",
                }}
              ></div>

              {/* Form */}
              <form onsubmit="handleLogin(event)" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter admin username"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter admin password"
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "40px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onclick="togglePassword()"
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      👁️
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="login-button"
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  🛡️ Sign in to Admin Panel
                </button>
              </form>

              {/* Footer */}
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "8px",
                    margin: 0,
                  }}
                >
                  🔒 This area is restricted to authorized personnel only.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          {`
            function fillCredentials() {
              document.getElementById('username').value = 'admin';
              document.getElementById('password').value = 'admin123';
              hideMessages();
            }

            function togglePassword() {
              const passwordInput = document.getElementById('password');
              const button = event.target;
              if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                button.textContent = '🙈';
              } else {
                passwordInput.type = 'password';
                button.textContent = '👁️';
              }
            }

            function showError(message) {
              const errorDiv = document.getElementById('error-message');
              errorDiv.textContent = message;
              errorDiv.style.display = 'block';
              document.getElementById('success-message').style.display = 'none';
            }

            function showSuccess(message) {
              const successDiv = document.getElementById('success-message');
              successDiv.textContent = '✅ ' + message;
              successDiv.style.display = 'block';
              document.getElementById('error-message').style.display = 'none';
            }

            function hideMessages() {
              document.getElementById('error-message').style.display = 'none';
              document.getElementById('success-message').style.display = 'none';
            }

            async function handleLogin(event) {
              event.preventDefault();
              
              const button = document.getElementById('login-button');
              const username = document.getElementById('username').value.trim();
              const password = document.getElementById('password').value.trim();

              if (!username) {
                showError('Username is required');
                return;
              }

              if (!password) {
                showError('Password is required');
                return;
              }

              button.textContent = '⏳ Signing in...';
              button.disabled = true;
              hideMessages();

              try {
                const response = await fetch('/api/auth/admin/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                  showSuccess('Login successful! Redirecting...');
                  setTimeout(() => {
                    window.location.href = '/admin/dashboard';
                  }, 1000);
                } else {
                  showError(data.error || 'Login failed. Please check your credentials.');
                }
              } catch (error) {
                console.error('Login error:', error);
                showError('Network error. Please try again.');
              } finally {
                button.textContent = '🛡️ Sign in to Admin Panel';
                button.disabled = false;
              }
            }

            // Auto-fill on page load for testing
            window.onload = function() {
              console.log('Admin login page loaded successfully');
            };
          `}
        </script>
      </body>
    </html>
  )
}
