// scheduleGenerator.js

exports.generateLoanSchedule = function(principal, disbursementDate) {
    const pfAmount = principal * 0.10;
    const gstAmount = pfAmount * 0.18;
    const totalPF = pfAmount + gstAmount;

    const netDisbursement = principal - totalPF;

    // FLAT INTEREST FOR 100 DAYS (20%)
    const interestAmount = principal * 0.20;
    const totalRepayable = principal + interestAmount;

    const installments = 14; // 7-day frequency
    const weeklyEmi = Math.round(totalRepayable / installments);

    let schedule = [];
    let dueDate = new Date(disbursementDate);

    for (let i = 1; i <= installments; i++) {
        dueDate = new Date(dueDate.getTime() + 7 * 86400000);

        schedule.push({
            installmentNumber: i,
            dueDate,
            amount: weeklyEmi,
            principal: null,
            interest: null,
            remainingAmount: weeklyEmi,
            paidAmount: 0,
            penalty: 0,
            status: "pending"
        });
    }

    return {
        pfAmount,
        gstAmount,
        totalPF,
        netDisbursement,
        interestAmount,
        totalRepayable,
        weeklyEmi,
        schedule
    };
};