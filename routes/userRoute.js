const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { signupSchema, verifySchema, loginSchema, resendOTPSchema } = require('../validations/validationSchemas');
const {authenticateJWT, authorizeRole} = require('../middlewares/auth');

// Middleware for validating request bodies using Joi schemas
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

router.post('/signup', validate(signupSchema), userController.userSignup);
router.post('/verify', validate(verifySchema), userController.postVerify);
router.post('/resend-otp', validate(resendOTPSchema), userController.resendOTP);
router.post('/login', validate(loginSchema), userController.userLogin);
router.get('/home', authenticateJWT, userController.getHome);
router.post('/logout', authenticateJWT, userController.getLogout);

// Example of a protected route that only admins can access
router.get('/admin', authenticateJWT, authorizeRole(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin' });
});
module.exports = router;
