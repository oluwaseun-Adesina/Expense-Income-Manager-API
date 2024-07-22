const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateJWT } = require('../middlewares/auth')

const { categorySchema } = require('../validations/validationSchemas');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};


router.post('/', authenticateJWT, validate(categorySchema), categoryController.createCategory);
router.get('/', authenticateJWT, categoryController.getCategories);
router.put('/:id', authenticateJWT, validate(categorySchema), categoryController.updateCategory);
router.delete('/:id', authenticateJWT, categoryController.deleteCategory);

module.exports = router;
