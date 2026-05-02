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
                // refresh
                db.run(
                    `UPDATE Budgets SET limit_amount = ? WHERE user_id = ? AND month = ?`,
                    [limit_amount, user_id, month],
                    () => res.json({ message: 'Budget aktualizowany' })
                );
            } else {
                // create
                db.run(
                    `INSERT INTO Budgets (user_id, month, limit_amount) VALUES (?, ?, ?)`,
                    [user_id, month, limit_amount],
                    () => res.json({ message: 'Budget stworzony' })
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
        `SELECT limit_amount FROM Budgets 
         WHERE user_id = ? AND month = ?`,
        [userId, month],
        (err, budgetRow) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!budgetRow) {
                return res.json({ remaining: null });
            }

            // wydatki
            db.get(
                `SELECT SUM(amount) as total 
                FROM Expenses 
                WHERE user_id = ? AND date LIKE ? || '%'`,
                [userId, month],
                (err, expenseRow) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const total = expenseRow.total || 0;
                    const remaining = budgetRow.limit_amount - total;

                    res.json({
                        remaining,
                        exceeded: remaining < 0
                    });
                }
            );
        }
    );
});


module.exports = router;