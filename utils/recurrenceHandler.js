const cron = require('node-cron');
const Income = require('../models/incomeModel');
const Expense = require('../models/expenseModel');
const transporter = require('../config/email');

const sendReminderEmail = (userEmail, itemType, description, dueDate) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: `${itemType} Reminder`,
      text: `This is a reminder that your ${itemType.toLowerCase()} (${description}) is due on ${dueDate.toDateString()}.`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  };
  
  const handleRecurrence = async () => {
    const now = new Date();
    const interval = [5, 3, 1]
  
    // Send reminders for incomes
    const upcomingIncomes = await Income.find({ recurring: true, nextRecurrenceDate: { $gt: now } });
    for (const income of upcomingIncomes) {
      const daysUntilDue = Math.ceil((income.nextRecurrenceDate - now) / (1000 * 60 * 60 * 24));
      if (interval.includes(daysUntilDue)) {
        sendReminderEmail(income.userEmail, 'Income', income.description, income.nextRecurrenceDate);
      }
    }
  
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
  
    // Send reminders for expenses
    const upcomingExpenses = await Expense.find({ recurring: true, nextRecurrenceDate: { $gt: now } });
    for (const expense of upcomingExpenses) {
      const daysUntilDue = Math.ceil((expense.nextRecurrenceDate - now) / (1000 * 60 * 60 * 24));
      if (interval.includes(daysUntilDue)) {
        sendReminderEmail(expense.userEmail, 'Expense', expense.description, expense.nextRecurrenceDate);
      }
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