// paymentAllocator.js

exports.allocatePayment = function(payment, schedule) {
    let remaining = payment.amount;
    const penaltyCharge = 250;

    // Find next unpaid installment
    const inst = schedule.find(i => i.status !== "paid");
    if (!inst) return { allocation: {}, schedule };

    const isLate = new Date(payment.paymentDate) > inst.dueDate;
    const penalty = isLate ? penaltyCharge : 0;

    let allocation = {
        principal: 0,
        interest: 0,
        penalty,
        excess: 0
    };

    let totalDue = inst.remainingAmount + penalty;

    if (remaining >= totalDue) {
        // FULL PAYMENT
        inst.paidAmount = inst.amount;
        inst.remainingAmount = 0;
        inst.status = "paid";
        remaining -= totalDue;

        allocation.excess = remaining > 0 ? remaining : 0;

    } else {
        // PARTIAL PAYMENT
        inst.paidAmount = remaining;
        inst.remainingAmount = totalDue - remaining;
        inst.status = "partial";
        remaining = 0;
    }

    return { allocation, schedule };
};