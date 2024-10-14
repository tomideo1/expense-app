import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  secret: String
});

const expenseSchema = new mongoose.Schema({
  activity: String,
  amount: Number,
  category: String,
  created_at: Date,
  updated_at: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add this line
});



const categoryBudgetSchema = new mongoose.Schema({
  category: String,
  budget: Number,
  created_at: Date,
  updated_at: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add this line

});

const User = mongoose.model('User', userSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const CategoryBudget = mongoose.model('CategoryBudget', categoryBudgetSchema);

const initUsers = async () => {
  try {
    const userData = {
      email: 'ayotomideaina@gmail.com',
      secret: 'DvB1KHcmzJFj1fc'
    };

    // Using findOneAndUpdate with upsert option
    const user = await User.findOneAndUpdate(
      { email: userData.email },
      userData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log('User created or updated:', user);
  } catch (error) {
    console.error('Error initializing user:', error);
  }
};

initUsers();

app.get('/api/users', async (req, res) => {
  const { email, secret } = req.query;

  // Strip spaces from email input
  let emailValue = email.replace(/\s+/g, '');
  let secretValue = secret.replace(/\s+/g, '');

  const user = await User.findOne({
    email: emailValue,
    secret: secretValue
  });

  res.json(user);
});

app.get('/api/expenses', async (req, res) => {
  const { month, userId } = req.query;
  const startDate = new Date(`${month}-01T00:00:00Z`);
  const endDate = new Date(month);
  endDate.setMonth(endDate.getMonth() + 1);

  const expenses = await Expense.find({
    userId: userId,
    created_at: {
      $gte: startDate,
      $lt: endDate
    },
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
  const { month, userId } = req.query;
  const startDate = new Date(`${month}-01T00:00:00Z`);
  const endDate = new Date(month);
  endDate.setMonth(endDate.getMonth() + 1);

  const categoryBudgets = await CategoryBudget.find({
    userId: userId,
    created_at: {
      $gte: startDate,
      $lt: endDate
    }
  });
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));