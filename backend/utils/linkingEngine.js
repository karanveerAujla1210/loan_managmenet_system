// linkingEngine.js

const ImportedDisb = require("../models/ImportedDisbursements");
const ImportedPay = require("../models/ImportedPayments");

const Loan = require("../models/Loan");
const Customer = require("../models/Customer");
const Payment = require("../models/Payment");

const loanService = require("../services/loanService");

exports.linkImportedData = async () => {
    const disbList = await ImportedDisb.find({});
    const paymentList = await ImportedPay.find({});

    for (const d of disbList) {
        // 1. Customer create/find
        let customer = await Customer.findOne({ phone: d.mobileNumber });
        if (!customer) {
            customer = await Customer.create({
                firstName: d.customerName.split(" ")[0],
                lastName: d.customerName.split(" ")[1] || "",
                phone: d.mobileNumber
            });
        }

        // 2. Create loan from imported disbursement
        const loan = await loanService.createLoan({
            loanId: d.loanId,
            customerId: customer._id,
            principal: d.loanAmount,
            disbursementDate: d.dateOfDisbursement,
            branch: d.branch
        });

        // 3. Link payments to loan
        const matchedPayments = paymentList.filter(p => p.LoanID === d.loanId);

        for (const p of matchedPayments) {
            await Payment.create({
                externalLoanId: p.LoanID,
                loanId: loan._id,
                customerId: customer._id,
                amount: p.Amount,
                paymentDate: p.PaymentDate,
                method: p.PaymentMode,
                txnRef: p.ReferenceNumber,
                remarks: p.Remarks
            });
        }
    }
};