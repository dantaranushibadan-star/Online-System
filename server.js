const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // This serves the admin.html

// Your existing key database and functions...
let keysDB = {};
let keyStats = {
    total_generated: 0,
    active_keys: 0,
    revoked_keys: 0
};

function generateKey(type, days = null) {
    const prefix = "VERDANT-KEY";
    let keyType, expirationDays;
    
    switch(type) {
        case 'hour': keyType = '1HOUR'; expirationDays = 1/24; break;
        case 'day': keyType = '1DAY'; expirationDays = 1; break;
        case 'week': keyType = '7DAYS'; expirationDays = 7; break;
        case 'month': keyType = '30DAYS'; expirationDays = 30; break;
        case 'permanent': keyType = 'LIFETIME'; expirationDays = 36500; break;
        case 'custom': keyType = `${days}DAYS`; expirationDays = days; break;
        default: keyType = '1DAY'; expirationDays = 1;
    }
    
    const uniqueId = uuidv4().substr(0, 8).toUpperCase();
    const key = `${prefix}-${keyType}-${uniqueId}`;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    
    return {
        key: key,
        type: type,
        keyType: keyType,
        expiration_date: expirationDate.toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        isActive: true,
        used: false,
        used_by: null,
        used_at: null,
        days: expirationDays
    };
}

// API endpoints (keep all your existing endpoints)
app.post('/api/validate', (req, res) => {
    // Your existing validate code
});

app.post('/api/admin/generate', (req, res) => {
    // Your existing generate code
});

app.post('/api/admin/revoke', (req, res) => {
    // Your existing revoke code
});

app.get('/api/admin/keys', (req, res) => {
    // Your existing get keys code
});

app.delete('/api/admin/keys/:key', (req, res) => {
    // Your existing delete code
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔑 Admin: http://localhost:${PORT}/admin`);
});