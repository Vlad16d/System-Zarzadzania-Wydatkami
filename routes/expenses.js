const express = require('express');
const router = express.Router();
const db = require('../db');

// add wydatek
router.post('/', (req, res) => {
    const { amount, date, category_id, description, user_id } = req.body;

    if (!amount || !date || !user_id) {
        return res.status(400).json({ error: 'Не хватает данных' });
    }

    db.run(
        `INSERT INTO Expenses (amount, date, category_id, description, user_id)
         VALUES (?, ?, ?, ?, ?)`,
        [amount, date, category_id || null, description || '', user_id],
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Ошибка при добавлении' });
            }

            res.json({
                message: 'Расход добавлен',
                id: this.lastID
            });
        }
    );
});


// get wszystkie wydatki
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        `SELECT * FROM Expenses WHERE user_id = ? ORDER BY date DESC`,
        [userId],
        (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Ошибка при получении' });
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
                return res.status(500).json({ error: 'Ошибка при удалении' });
            }

            res.json({ message: 'Удалено' });
        }
    );
});


// refresh   wydatki
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
                return res.status(500).json({ error: 'Ошибка при обновлении' });
            }

            res.json({ message: 'Обновлено' });
        }
    );
});

module.exports = router;