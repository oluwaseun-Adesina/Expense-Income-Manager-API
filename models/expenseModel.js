const { required } = require('joi');
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount:{
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    data: {
        type: Date,
        default: Date.now
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    recurring: {
        type: Boolean,
        default: false
    },
    recurringInterval: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: function() {return this.recurring}
    },
    nextRecurrenceDate:{
        type: Date,
        required: function() {return this.recurring}
    }
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense