const cron = require('node-cron');
const Income = require('../models/incomeModel');
const Expense = require('../models/expenseModel');

const handleRecurrence = async () => {
    const now = new Date();

    // Handle recurring incomes
    const recurringIncomes = await Income.find({ recurring: true, nextRecurrenceDate: { $lte: now } });
    for (const income of recurringIncomes) {
        const newIncome = new Income({
            user_id: income.user_id,
            amount: income.amount,
            description: income.description,
            category: income.category,
            recurring: true,
            recurrenceInterval: income.recurrenceInterval,
            nextRecurrenceDate: calculateNextRecurrenceDate(income.recurrenceInterval)
        });
        await newIncome.save();
        income.nextRecurrenceDate = newIncome.nextRecurrenceDate;
        await income.save();
    }

    // Handle recurring expenses
    const recurringExpenses = await Expense.find({ recurring: true, nextRecurrenceDate: { $lte: now } });
    for (const expense of recurringExpenses) {
        const newExpense = new Expense({
            user_id: expense.user_id,
            amount: expense.amount,
            description: expense.description,
            category: expense.category,
            recurring: true,
            recurrenceInterval: expense.recurrenceInterval,
            nextRecurrenceDate: calculateNextRecurrenceDate(expense.recurrenceInterval)
        });
        await newExpense.save();
        expense.nextRecurrenceDate = newExpense.nextRecurrenceDate;
        await expense.save();
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

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', handleRecurrence);

module.exports = handleRecurrence;
