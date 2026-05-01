const express = require('express');
const router = express.Router();
const db = require('../db');

// add wydatek
router.post('/', (req, res) => {

    const { amount, date, description, category_id, user_id } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Nieprawidłowa suma" });
    }

    if (!date) {
        return res.status(400).json({ error: "Data obowiązkowa" });
    }

    if (!description || !description.trim()) {
        return res.status(400).json({ error: "Opis obowiązkowy" });
    }

    db.run(
        `INSERT INTO Expenses (amount, date, description, category_id, user_id)
         VALUES (?, ?, ?, ?, ?)`,
        [amount, date, description, category_id, user_id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ id: this.lastID });
        }
    );
});

// get wszystkie wydatki
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        `SELECT 
            Expenses.*, 
            Categories.name as category_name
        FROM Expenses
        LEFT JOIN Categories 
        ON Expenses.category_id = Categories.id
        WHERE Expenses.user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Błąd otrzymania' });
            }

            res.json(rows);
        }
    );
});


// delete wydatek
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run(
        `DELETE FROM Expenses WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Błąd usunięcia' });
            }

            res.json({ message: 'Usunięto wydatek' });
        }
    );
});


// refres  wydatki
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { amount, date, category_id, description } = req.body;

    db.run(
        `UPDATE Expenses 
         SET amount = ?, date = ?, category_id = ?, description = ?
         WHERE id = ?`,
        [amount, date, category_id || null, description || '', id],
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Błąd aktualizacj' });
            }

            res.json({ message: 'Aktualizowano wydatki' });
        }
    );
});

module.exports = router;