import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const expenseSchema = new mongoose.Schema({
  activity: String,
  amount: Number,
  category: String,
  date: Date,
});

const categoryBudgetSchema = new mongoose.Schema({
  category: String,
  budget: Number,
});

const Expense = mongoose.model('Expense', expenseSchema);
const CategoryBudget = mongoose.model('CategoryBudget', categoryBudgetSchema);

app.get('/api/expenses', async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(month);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const expenses = await Expense.find({
    date: {
      $gte: startDate,
      $lt: endDate
    }
  });
  res.json(expenses);
});

app.post('/api/expenses', async (req, res) => {
  const newExpense = new Expense(req.body);
  await newExpense.save();
  res.json(newExpense);
});

app.put('/api/expenses/:id', async (req, res) => {
  const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedExpense);
});

app.delete('/api/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Expense deleted' });
});

app.get('/api/categoryBudgets', async (req, res) => {
  const categoryBudgets = await CategoryBudget.find();
  res.json(categoryBudgets);
});

app.post('/api/categoryBudgets', async (req, res) => {
  const newCategoryBudget = new CategoryBudget(req.body);
  await newCategoryBudget.save();
  res.json(newCategoryBudget);
});

app.put('/api/categoryBudgets/:id', async (req, res) => {
  const updatedCategoryBudget = await CategoryBudget.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCategoryBudget);
});

app.delete('/api/categoryBudgets/:id', async (req, res) => {
  await CategoryBudget.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category budget deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));