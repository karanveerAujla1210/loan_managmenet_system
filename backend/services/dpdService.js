const Loan = require('../models/Loan');
const Schedule = require('../models/Schedule');
const Collections = require('../models/Collections');

async function updateDPD() {
  const loans = await Loan.find({ status: "active" });

  for (const loan of loans) {
    const nextDue = await Schedule.findOne({
      loanId: loan._id,
      status: { $ne: "paid" }
    }).sort({ installmentNumber: 1 });

    if (!nextDue) continue;

    const today = new Date();
    const dpd = Math.max(0, Math.floor((today - nextDue.dueDate) / 86400000));

    let bucket = "current";

    if (dpd >= 1 && dpd <= 7) bucket = "1-7";
    else if (dpd <= 15) bucket = "8-15";
    else if (dpd <= 22) bucket = "16-22";
    else if (dpd <= 29) bucket = "23-29";
    else if (dpd <= 59) bucket = "30+";
    else if (dpd <= 89) bucket = "60+";
    else if (dpd <= 119) bucket = "90+";
    else bucket = "120+";

    await Loan.updateOne({ _id: loan._id }, { dpd, bucket });

    // Update collections record
    await Collections.findOneAndUpdate(
      { loanId: loan._id },
      {
        loanId: loan._id,
        customerId: loan.customerId,
        dpd,
        bucket
      },
      { upsert: true }
    );

    // Mark overdue installments
    if (dpd > 0) {
      await Schedule.updateMany(
        {
          loanId: loan._id,
          dueDate: { $lt: today },
          status: { $in: ["pending", "partial"] }
        },
        { status: "overdue" }
      );
    }
  }

  console.log(`DPD update completed for ${loans.length} loans`);
}

module.exports = { updateDPD };