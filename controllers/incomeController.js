const Income = require('../models/incomeModel');

const incomeController = {
    async createIncome(req, res) {
        try {
            const { amount, description, category, recurring, recurrenceInterval } = req.body;
            const income = new Income({
                user_id: req.user.id,
                amount,
                description,
                category,
                recurring,
                recurrenceInterval,
                nextRecurrenceDate: recurring ? calculateNextRecurrenceDate(recurrenceInterval) : null
            });
            await income.save();
            res.status(201).json({ message: 'Income created successfully', data: income });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    async getIncomes(req, res) {
        try {
            const incomes = await Income.find({ user_id: req.user.id });
            res.status(200).json({ message: 'All incomes fetched successfully', data: incomes });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateIncome(req, res) {
        try {
            const { id } = req.params;
            const income = await Income.findByIdAndUpdate(id, req.body, { new: true });
            if (!income) {
                return res.status(404).json({ message: 'Income not found' });
            }
            res.status(200).json({ message: 'Income updated successfully', data: income });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteIncome(req, res) {
        try {
            const { id } = req.params;
            const income = await Income.findByIdAndDelete(id);
            if (!income) {
                return res.status(404).json({ message: 'Income not found' });
            }
            res.status(200).json({ message: 'Income deleted successfully' });
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

module.exports = incomeController;
