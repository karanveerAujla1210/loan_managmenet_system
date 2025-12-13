// cron/dpdUpdater.js

const Loan = require("../models/Loan");
const Schedule = require("../models/Schedule");
const { computeBucket } = require("../utils/dpdBucketEngine");

exports.updateAllDPD = async () => {
    const loans = await Loan.find({ status: "active" });

    for (const loan of loans) {
        const inst = await Schedule.findOne({
            loanId: loan._id,
            status: { $ne: "paid" }
        }).sort({ installmentNumber: 1 });

        if (!inst) continue;

        const today = new Date();
        const dpd = Math.max(
            0,
            Math.floor((today - inst.dueDate) / 86400000) // days diff
        );

        const bucket = computeBucket(dpd);

        await Loan.updateOne(
            { _id: loan._id },
            { dpd, bucket }
        );
    }
};