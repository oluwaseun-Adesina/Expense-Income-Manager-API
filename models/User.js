const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    otp: {
        type: String,
        required: false
    },
    otpExpires: {
        type: Date,
        required: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Add more roles as needed
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving the user model
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare the entered password with the hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate and set OTP
userSchema.methods.generateOTP = function() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    this.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(enteredOTP) {
    if (this.otp !== enteredOTP) {
        return false;
    }
    if (Date.now() > this.otpExpires) {
        return false;
    }
    this.verified = true;
    this.otp = undefined;
    this.otpExpires = undefined;
    return true;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
