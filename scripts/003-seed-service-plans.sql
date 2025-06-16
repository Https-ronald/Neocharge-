-- Insert sample service plans for testing
INSERT INTO service_plans (plan_id, provider_id, name, description, amount, type, validity) VALUES
-- MTN Data Plans
('mtn_1gb_30d', 'mtn', '1GB Monthly', '1GB data valid for 30 days', 1000.00, 'data', '30 days'),
('mtn_2gb_30d', 'mtn', '2GB Monthly', '2GB data valid for 30 days', 2000.00, 'data', '30 days'),
('mtn_5gb_30d', 'mtn', '5GB Monthly', '5GB data valid for 30 days', 2500.00, 'data', '30 days'),
('mtn_10gb_30d', 'mtn', '10GB Monthly', '10GB data valid for 30 days', 5000.00, 'data', '30 days'),

-- Airtel Data Plans
('airtel_1gb_30d', 'airtel', '1GB Monthly', '1GB data valid for 30 days', 1000.00, 'data', '30 days'),
('airtel_2gb_30d', 'airtel', '2GB Monthly', '2GB data valid for 30 days', 2000.00, 'data', '30 days'),
('airtel_5gb_30d', 'airtel', '5GB Monthly', '5GB data valid for 30 days', 2500.00, 'data', '30 days'),

-- DSTV Plans
('dstv_compact', 'dstv', 'DStv Compact', 'DStv Compact monthly subscription', 9000.00, 'tv', '30 days'),
('dstv_premium', 'dstv', 'DStv Premium', 'DStv Premium monthly subscription', 21000.00, 'tv', '30 days'),
('dstv_family', 'dstv', 'DStv Family', 'DStv Family monthly subscription', 4000.00, 'tv', '30 days'),

-- GOtv Plans
('gotv_max', 'gotv', 'GOtv Max', 'GOtv Max monthly subscription', 4150.00, 'tv', '30 days'),
('gotv_jolli', 'gotv', 'GOtv Jolli', 'GOtv Jolli monthly subscription', 2800.00, 'tv', '30 days')

ON CONFLICT (plan_id) DO NOTHING;
