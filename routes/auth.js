const express = require('express');
const router = express.Router();
const db = require('../db');

// регистрация
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Введите корректный email" });
    }

    if (!password || password.length < 3) {
        return res.status(400).json({ error: "Пароль слишком короткий" });
    }

});

// логин
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(
        `SELECT * FROM Users WHERE email = ? AND password = ?`,
        [email, password],
        (err, user) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!user) {
                return res.status(401).json({ error: "Неверные данные" });
            }

            res.json({ userId: user.id });
        }
    );
});

module.exports = router;