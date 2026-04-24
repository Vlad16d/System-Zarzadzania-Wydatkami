const express = require('express');
const router = express.Router();
const db = require('../db');


// budget
router.post('/', (req, res) => {
    const { user_id, month, limit_amount } = req.body;

    db.get(
        `SELECT * FROM Budgets WHERE user_id = ? AND month = ?`,
        [user_id, month],
        (err, row) => {
            if (row) {
                // ОБНОВЛЯЕМ
                db.run(
                    `UPDATE Budgets SET limit_amount = ? WHERE user_id = ? AND month = ?`,
                    [limit_amount, user_id, month],
                    () => res.json({ message: 'Бюджет обновлён' })
                );
            } else {
                // СОЗДАЁМ
                db.run(
                    `INSERT INTO Budgets (user_id, month, limit_amount) VALUES (?, ?, ?)`,
                    [user_id, month, limit_amount],
                    () => res.json({ message: 'Бюджет создан' })
                );
            }
        }
    );
});


// status budgetu
router.get('/:userId/:month', (req, res) => {
    const { userId, month } = req.params;

    // limit
    db.get(
        `SELECT limit_amount FROM Budgets WHERE user_id = ? AND month = ?`,
        [userId, month],
        (err, budget) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!budget) {
                return res.json({ message: 'Бюджет не установлен' });
            }

            // przeliczamy wydatki
            db.get(
                `SELECT SUM(amount) as total 
                 FROM Expenses 
                 WHERE user_id = ? AND substr(date, 1, 7) = ?`,
                [userId, month],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const total = result.total || 0;
                    const remaining = budget.limit_amount - total;

                    res.json({
                        limit: budget.limit_amount,
                        spent: total,
                        remaining: remaining,
                        exceeded: remaining < 0
                    });
                }
            );
        }
    );
});


module.exports = router;