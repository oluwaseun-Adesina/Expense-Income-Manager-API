const Expense = require('../models/expenseModel');
const Income = require('../models/incomeModel');
const mongoose = require('mongoose')

const incomeController = {
    async createIncome(req, res) {
        try {
            const { amount, description, category, recurring, recurrenceInterval } = req.body;
            const income = new Income({
                user_id: req.user.id,
                amount,
                description,
                category: category.toLowerCase(),
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
            // const incomes = await Income.find({ user_id: req.user.id });
            const incomes = await Income.aggregate([
                {
                    $match: { user_id: new mongoose.Types.ObjectId(req.user.id) }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" },
                        totalCount: { $sum: 1 },
                        expenses: {
                            $push: {
                                _id: "$_id",
                                title: "$title",
                                description: "$description",
                                category: "$category",  // Get only the category name
                                amount: "$amount",
                                date: "$date"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        totalAmount: 1,
                        totalCount: 1,
                        expenses: 1
                    }
                },
                {
                    $sort: { "date": -1 }
                },

            ])
            if (!incomes.length) {
                return res.status(200).json({ message: 'You have no recorded expenses', data: { totalAmount: 0, totalCount: 0, expenses: [] } });
            }
            const result = incomes.length ? incomes[0] : { totalAmount: 0, totalCount: 0, incomes: [] };
            res.status(200).json({ message: 'All expenses fetched successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateIncome(req, res) {
        try {
            const { id } = req.params;

            const { amount, description, category, recurring, recurrenceInterval } = req.body;

            const income = await Income.findById(id);

            if (!income) {
                return res.status(404).json({ message: 'Income not found' })
            }

            if (Expense.user_id.toString() !== req.user.id.toString()) {
                return res.status(403).json({ message: 'Unauthorized: You cannot update this expense' })
            }

            income.amount = amount || income.amount;
            income.description = description || income.description;
            income.category = category ? category.toLowerCase() : income.category;
            income.recurring = recurring !== undefined ? recurring : income.recurring;

            await income.save()

            res.status(200).json({ message: 'Income updated successfully', data: income });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteIncome(req, res) {
        try {
            const { id } = req.params;

            const { amount, description, category, recurring, recurrenceInterval } = req.body;

            const income = await Income.findById(id);

            if (!income) {
                return res.status(404).json({ message: 'Income not found' })
            }

            if (Expense.user_id.toString() !== req.user.id.toString()) {
                return res.status(403).json({ message: 'Unauthorized: You cannot update this expense' })
            }

            await income.remove()

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
