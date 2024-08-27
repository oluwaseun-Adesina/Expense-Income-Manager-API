const Expense = require('../models/expenseModel');
const mongoose = require('mongoose')

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
            // const expenses = await Expense.find({ user_id: req.user.id });
            const expenses = await Expense.aggregate([
                {
                    $match: { user_id: new mongoose.Types.ObjectId(req.user.id) }
                }, 
                {
                    $lookup: {
                      from: "categories",
                      localField: "category",
                      foreignField: "_id",
                      as: "Category",
                    },
                },
                {
                    $unwind: "$Category"
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" },
                        totalCount: { $sum: 1 },
                        expenses: { $push: {
                            _id: "$_id",
                            title: "$title",
                            description: "$description",
                            category: "$Category.name",  // Get only the category name
                            amount: "$amount",
                            date: "$date"
                        }}
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
            if (!expenses) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            const result = expenses.length ? expenses[0] : { totalAmount: 0, totalCount: 0, expenses: [] };
            res.status(200).json({ message: 'All expenses fetched successfully', data: result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getSingleExpense(req, res){
        try {
            const expense_id = req.params.id
            const expense = await Expense.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(expense_id) }
                }, 
                {
                    $lookup: {
                      from: "categories",
                      localField: "category",
                      foreignField: "_id",
                      as: "Category",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        category: "$Category.name",  // Get only the category name
                        amount: 1,
                        date: 1
                    }
                },
            ])

            if (!expense.length) {
                return res.status(404).json({ message: 'Expense not found' });
            }

            res.status(200).json({ message: 'All expenses fetched successfully', data: expense });
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
