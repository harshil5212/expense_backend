const IncomeSchema= require("../models/IncomeModel")
const jwt = require("jsonwebtoken")


exports.addIncome = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: 'No token provided'})
        }

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const userId = decoded._id;

        const {title, amount, category, description, date}  = req.body

        //Creating an instance of IncomeSchema
        const income = IncomeSchema({
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
        await income.save()
        res.status(200).json({message: 'Income Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getIncomes = async (req, res) =>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: 'No token provided'})
        }

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const userId = decoded._id;

        const incomes = await IncomeSchema.find({userId}).sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteIncome = async (req, res) =>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: 'No token provided'})
        }

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        const userId = decoded._id;

        const {id} = req.params;
        
        const income = await IncomeSchema.findById(id);
        if (!income) {
            return res.status(404).json({message: 'Income not found'})
        }
        
        if (income.userId.toString() !== userId) {
            return res.status(403).json({message: 'Unauthorized'})
        }

        await IncomeSchema.findByIdAndDelete(id)
        res.status(200).json({message: 'Income Deleted'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}