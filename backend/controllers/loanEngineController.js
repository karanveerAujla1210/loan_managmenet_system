const { createLoan, linkImportedData } = require('../services/loanService');
const { allocatePayment } = require('../utils/paymentAllocator');
const { updateAllDPD } = require('../cron/dpdUpdater');
const Schedule = require('../models/Schedule');
const Payment = require('../models/Payment');

// Create new loan with schedule generation
exports.createLoanWithSchedule = async (req, res) => {
    try {
        const loan = await createLoan(req.body);
        res.status(201).json({
            success: true,
            data: loan,
            message: 'Loan created with schedule successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Process payment allocation
exports.processPayment = async (req, res) => {
    try {
        const { loanId, amount, paymentDate } = req.body;
        
        const schedules = await Schedule.find({ loanId }).sort({ installmentNumber: 1 });
        const payment = { amount, paymentDate };
        
        const { allocation, schedule } = allocatePayment(payment, schedules);
        
        // Save payment record
        const paymentRecord = await Payment.create({
            loanId,
            amount,
            paymentDate,
            allocation
        });
        
        // Update schedules
        for (let i = 0; i < schedule.length; i++) {
            await Schedule.updateOne(
                { _id: schedules[i]._id },
                {
                    paidAmount: schedule[i].paidAmount,
                    remainingAmount: schedule[i].remainingAmount,
                    penalty: schedule[i].penalty,
                    status: schedule[i].status
                }
            );
        }
        
        res.json({
            success: true,
            data: { payment: paymentRecord, allocation },
            message: 'Payment processed successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Link imported Excel data
exports.linkExcelData = async (req, res) => {
    try {
        await linkImportedData();
        res.json({
            success: true,
            message: 'Excel data linked successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update DPD for all loans
exports.updateDPD = async (req, res) => {
    try {
        await updateAllDPD();
        res.json({
            success: true,
            message: 'DPD updated for all loans'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};