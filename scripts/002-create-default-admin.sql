-- Create a default admin user (password: admin123)
-- Note: In production, change this password immediately
INSERT INTO admins (username, email, password_hash, name, role) 
VALUES (
  'admin',
  'admin@neocharge.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
  'System Administrator',
  'admin'
) ON CONFLICT (username) DO NOTHING;
