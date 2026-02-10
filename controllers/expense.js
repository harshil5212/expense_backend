const ExpenseSchema = require("../models/ExpenseModel")
const jwt = require("jsonwebtoken")


exports.addExpense = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: 'No token provided'})
        }

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const userId = decoded._id;

        const {title, amount, category, description, date}  = req.body

        const expense = ExpenseSchema({
            userId,
            title,
            amount,
            category,
            description,
            date
        })

        //validations
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await expense.save()
        res.status(200).json({message: 'Expense Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getExpense = async (req, res) =>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: 'No token provided'})
        }

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const userId = decoded._id;

        const expenses = await ExpenseSchema.find({userId}).sort({createdAt: -1})
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteExpense = async (req, res) =>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: 'No token provided'})
        }

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const userId = decoded._id;

        const {id} = req.params;
        
        const expense = await ExpenseSchema.findById(id);
        if (!expense) {
            return res.status(404).json({message: 'Expense not found'})
        }
        
        if (expense.userId.toString() !== userId) {
            return res.status(403).json({message: 'Unauthorized'})
        }

        await ExpenseSchema.findByIdAndDelete(id)
        res.status(200).json({message: 'Expense Deleted'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}