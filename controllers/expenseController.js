const Expense = require('../models/expenseModel');

const expenseController = {
    async createExpense(req, res) {
        try {
            const { amount, description, category, recurring, recurrenceInterval } = req.body;
            const expense = new Expense({
                user_id: req.user.id,
                amount,
                description,
                category,
                recurring,
                recurrenceInterval,
                nextRecurrenceDate: recurring ? calculateNextRecurrenceDate(recurrenceInterval) : null
            });
            await expense.save();
            res.status(201).json({ message: 'Expense created successfully', data: expense });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    async getExpenses(req, res) {
        try {
            const expenses = await Expense.find({ user_id: req.user.id });
            res.status(200).json({ message: 'All expenses fetched successfully', data: expenses });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateExpense(req, res) {
        try {
            const { id } = req.params;
            const expense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            res.status(200).json({ message: 'Expense updated successfully', data: expense });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteExpense(req, res) {
        try {
            const { id } = req.params;
            const expense = await Expense.findByIdAndDelete(id);
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            res.status(200).json({ message: 'Expense deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

function calculateNextRecurrenceDate(interval) {
    const now = new Date();
    switch (interval) {
        case 'daily':
            return new Date(now.setDate(now.getDate() + 1));
        case 'weekly':
            return new Date(now.setDate(now.getDate() + 7));
        case 'monthly':
            return new Date(now.setMonth(now.getMonth() + 1));
        case 'yearly':
            return new Date(now.setFullYear(now.getFullYear() + 1));
        default:
            throw new Error('Invalid recurrence interval');
    }
}

module.exports = expenseController;
