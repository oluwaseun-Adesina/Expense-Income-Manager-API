const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { authenticateJWT } = require('../middlewares/auth');

const { incomeSchema } = require('../validations/validationSchemas');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

router.post('/', authenticateJWT, validate(incomeSchema), incomeController.createIncome);
router.get('/', authenticateJWT, incomeController.getIncomes);
router.get('/:id', authenticateJWT, incomeController.getSingleIncome);
router.patch('/:id', authenticateJWT, validate(incomeSchema), incomeController.updateIncome);
router.delete('/:id', authenticateJWT, incomeController.deleteIncome);

module.exports = router;
