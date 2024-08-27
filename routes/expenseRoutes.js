const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticateJWT } = require('../middlewares/auth')

const { expenseSchema } = require('../validations/validationSchemas');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

router.post('/', authenticateJWT, validate(expenseSchema), expenseController.createExpense);
router.get('/', authenticateJWT, expenseController.getExpenses);
router.get('/:id', authenticateJWT, expenseController.getSingleExpense);
router.put('/:id', authenticateJWT, validate(expenseSchema), expenseController.updateExpense);
router.delete('/:id', authenticateJWT, expenseController.deleteExpense);

module.exports = router;
