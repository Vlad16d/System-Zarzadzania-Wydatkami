const express = require('express');
const router = express.Router();
const db = require('../db');

// registration
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Proszę wprowadzić prawidłowy email" });
    }

    if (!password || password.length < 3) {
        return res.status(400).json({ error: "Hasło za krótkie" });
    }

    db.get(
        `SELECT * FROM Users WHERE email = ?`,
        [email],
        (err, existingUser) => {
            if (err) return res.status(500).json({ error: err.message });

            if (existingUser) {
                return res.status(400).json({ error: "Użytkownik już istnieje" });
            }

            db.run(
                `INSERT INTO Users (email, password) VALUES (?, ?)`,
                [email, password],
                function (err) {
                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ userId: this.lastID });
                }
            );
        }
    );
    console.log("REGISTER OK:", email);
});

// login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(
        `SELECT * FROM Users WHERE email = ? AND password = ?`,
        [email, password],
        (err, user) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!user) {
                return res.status(401).json({ error: "Nieprawidłowe dane" });
            }

            res.json({ userId: user.id });
        }
    );
});

module.exports = router;