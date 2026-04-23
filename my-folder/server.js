const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
    user: 'VitalAdmin',
    password: 'Sam@2005',
    server: '127.0.0.1', // Use the IP address
    database: 'VitalCareDB',
    port: 1433, // Specify the port directly
    options: {
        encrypt: false,
        trustServerCertificate: true,
        // If you use 'port: 1433', you usually don't need 'instanceName'
    }
};
// --- REGISTER ROUTE ---
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone, DOB, blood_type, allergies } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('u', sql.NVarChar, username)
            .input('e', sql.NVarChar, email)
            .input('p', sql.NVarChar, hashedPassword)
            .input('ph', sql.NVarChar, phone)
            .input('d', sql.Date, DOB)
            .input('b', sql.NVarChar, blood_type)
            .input('a', sql.NVarChar, allergies)
            .query(`INSERT INTO Users (Username, Email, Password, Phone, DOB, BloodType, Allergies) 
                    VALUES (@u, @e, @p, @ph, @d, @b, @a)`);

        res.status(201).json({ message: "User Registered Successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database Error: " + err.message });
    }
});

// --- LOGIN ROUTE ---
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @email');

        const user = result.recordset[0];
        if (!user) return res.status(404).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) return res.status(401).json({ message: "Invalid Password" });

        // Inside app.post('/login'...)
res.json({ 
    message: `Welcome back, ${user.Username}!`, 
    user: { 
        username: user.Username, 
        email: user.Email,
        bloodType: user.BloodType,
        allergies: user.Allergies,
        dob: user.DOB
    } 
});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// This handles the "Cannot GET /" issue
app.get('/', (req, res) => {
    res.send('✅ The Vital Care API is officially online and waiting for requests!');
});
app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));