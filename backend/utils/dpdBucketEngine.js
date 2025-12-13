// dpdBucketEngine.js

exports.computeBucket = function(dpd) {
    if (dpd < 1) return "current";
    if (dpd <= 7) return "1-7";
    if (dpd <= 15) return "8-15";
    if (dpd <= 22) return "16-22";
    if (dpd <= 29) return "23-29";
    if (dpd <= 59) return "30+";
    if (dpd <= 89) return "60+";
    if (dpd <= 119) return "90+";
    return "120+";
};