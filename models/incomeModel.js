const mongoose = require('mongoose')

const incomeSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category:{
        type: String,
        enum: ['food','transportation','housing','utilities','entertainment','healthcare','insurance','savings','debt-repayment','miscellaneous'],
        required: true
    },
    recurring:{
        type: Boolean,
        default: false
    },
    recurrenceInterval:{
        type: String,
        enum: ['daily', 'weekly','monthly','yearly'],
        required: function () { return this.recurring; }
    },
    nextRecurrenceDate:{
        type: Date,
        required: function () { return this.recurring;}
    },

})

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;