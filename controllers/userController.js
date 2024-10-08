const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/email');

const userController = {
    async userSignup(req, res) {
        const { firstname, lastname, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const newUser = new User({
                firstname,
                lastname,
                email,
                password
            });

            const otp = newUser.generateOTP();
            await newUser.save();

            // Send OTP via email
            const mailOptions = {
                from: "Oluwaseunadesina8@gmail.com",
                to: email,
                subject: "Verify your Account - OTP",
                text: `Your one-time verification code is ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ message: error.message });
                } else {
                    return res.status(200).json({ message: "OTP sent to email" });
                }
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async postVerify(req, res) {
        const { email, OTP } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.verifyOTP(OTP)) {
                return res.status(401).json({ message: 'Incorrect or expired OTP' });
            }

            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async resendOTP(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const otp = user.generateOTP();
            await user.save();

            // Send OTP via email
            const mailOptions = {
                from: "Oluwaseunadesina8@gmail.com",
                to: email,
                subject: "Verify your Account - OTP",
                text: `Your one-time verification code is ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ message: error.message });
                } else {
                    return res.status(200).json({ message: "OTP sent to email" });
                }
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async userLogin(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            if (!user.verified) {
                return res.status(403).json({ message: 'User not verified' });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getHome(req, res) {
        res.status(200).json({ message: "You have been successfully authenticated" });
    },

    async getLogout(req, res) {
        res.status(200).json({ token: null, message: 'Logged out successfully' });
    },

    async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.generatePasswordReset();
            await user.save();

            const resetUrl = `http://localhost:3000/reset-password/${user.resetPasswordToken}`;

            const mailOptions = {
                from: "Oluwaseunadesina8@gmail.com",
                to: email,
                subject: "Password Reset",
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process: ${resetUrl}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ message: error.message });
                } else {
                    return res.status(200).json({ message: 'Password reset link sent to your email' });
                }
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async resetPassword(req, res) {
        const { token, newPassword } = req.body;

        try {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token' });
            }

            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            res.status(200).json({ message: 'Password has been reset' });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;
