const crypto = require('crypto');
const moment = require('moment');
const ApiError = require('./ApiError');

// Date utilities
const dateUtils = {
  // Format date to Indian format
  formatIndianDate: (date) => {
    return moment(date).format('DD/MM/YYYY');
  },

  // Format date with time
  formatDateTime: (date) => {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
  },

  // Get start and end of day
  getStartOfDay: (date = new Date()) => {
    return moment(date).startOf('day').toDate();
  },

  getEndOfDay: (date = new Date()) => {
    return moment(date).endOf('day').toDate();
  },

  // Get date range
  getDateRange: (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    const dates = [];

    while (start.isSameOrBefore(end)) {
      dates.push(start.clone().toDate());
      start.add(1, 'day');
    }

    return dates;
  },

  // Calculate age
  calculateAge: (dateOfBirth) => {
    return moment().diff(moment(dateOfBirth), 'years');
  },

  // Add business days (excluding weekends)
  addBusinessDays: (date, days) => {
    const result = moment(date);
    let addedDays = 0;

    while (addedDays < days) {
      result.add(1, 'day');
      if (result.day() !== 0 && result.day() !== 6) { // Not Sunday or Saturday
        addedDays++;
      }
    }

    return result.toDate();
  },

  // Check if date is business day
  isBusinessDay: (date) => {
    const day = moment(date).day();
    return day !== 0 && day !== 6; // Not Sunday or Saturday
  },

  // Get next business day
  getNextBusinessDay: (date = new Date()) => {
    const nextDay = moment(date).add(1, 'day');
    
    while (nextDay.day() === 0 || nextDay.day() === 6) {
      nextDay.add(1, 'day');
    }

    return nextDay.toDate();
  },

  // Calculate DPD (Days Past Due)
  calculateDPD: (dueDate, currentDate = new Date()) => {
    const due = moment(dueDate);
    const current = moment(currentDate);
    
    if (current.isSameOrBefore(due)) {
      return 0;
    }

    return current.diff(due, 'days');
  }
};

// Number utilities
const numberUtils = {
  // Format currency in Indian format
  formatCurrency: (amount, currency = '₹') => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return formatter.format(amount).replace('₹', currency);
  },

  // Format number in Indian format (with commas)
  formatIndianNumber: (number) => {
    return new Intl.NumberFormat('en-IN').format(number);
  },

  // Round to 2 decimal places
  roundToTwo: (number) => {
    return Math.round((number + Number.EPSILON) * 100) / 100;
  },

  // Calculate percentage
  calculatePercentage: (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  },

  // Generate random number
  generateRandomNumber: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Convert words to numbers (for Indian numbering)
  convertWordsToNumber: (words) => {
    const wordToNumber = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'lakh': 100000, 'crore': 10000000
    };

    return wordToNumber[words.toLowerCase()] || 0;
  }
};

// String utilities
const stringUtils = {
  // Generate random string
  generateRandomString: (length = 10) => {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
  },

  // Generate OTP
  generateOTP: (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    
    return otp;
  },

  // Capitalize first letter
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Convert to title case
  toTitleCase: (str) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Mask sensitive data
  maskString: (str, visibleChars = 4, maskChar = '*') => {
    if (str.length <= visibleChars) return str;
    
    const visible = str.slice(-visibleChars);
    const masked = maskChar.repeat(str.length - visibleChars);
    
    return masked + visible;
  },

  // Mask email
  maskEmail: (email) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.slice(-1);
    return `${maskedUsername}@${domain}`;
  },

  // Mask phone number
  maskPhone: (phone) => {
    if (phone.length < 4) return phone;
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
  },

  // Generate slug
  generateSlug: (str) => {
    return str
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  },

  // Extract initials
  getInitials: (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
};

// Validation utilities
const validationUtils = {
  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate Indian phone number
  isValidIndianPhone: (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },

  // Validate PAN number
  isValidPAN: (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  },

  // Validate Aadhaar number
  isValidAadhaar: (aadhaar) => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
  },

  // Validate IFSC code
  isValidIFSC: (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  },

  // Validate GST number
  isValidGST: (gst) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  },

  // Validate pincode
  isValidPincode: (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  }
};

// Loan calculation utilities
const loanUtils = {
  // Calculate EMI using reducing balance method
  calculateEMI: (principal, rate, tenure) => {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    
    return numberUtils.roundToTwo(emi);
  },

  // Calculate flat rate EMI
  calculateFlatRateEMI: (principal, rate, tenure) => {
    const interest = (principal * rate * tenure) / (12 * 100);
    const totalAmount = principal + interest;
    
    return numberUtils.roundToTwo(totalAmount / tenure);
  },

  // Generate amortization schedule
  generateAmortizationSchedule: (principal, rate, tenure, startDate) => {
    const monthlyRate = rate / (12 * 100);
    const emi = loanUtils.calculateEMI(principal, rate, tenure);
    const schedule = [];
    let balance = principal;

    for (let i = 1; i <= tenure; i++) {
      const interestAmount = balance * monthlyRate;
      const principalAmount = emi - interestAmount;
      balance -= principalAmount;

      const dueDate = moment(startDate).add(i, 'months').toDate();

      schedule.push({
        installmentNumber: i,
        dueDate,
        emiAmount: emi,
        principalAmount: numberUtils.roundToTwo(principalAmount),
        interestAmount: numberUtils.roundToTwo(interestAmount),
        outstandingBalance: numberUtils.roundToTwo(Math.max(0, balance))
      });
    }

    return schedule;
  },

  // Calculate processing fee
  calculateProcessingFee: (principal, feeRate = 2) => {
    return numberUtils.roundToTwo((principal * feeRate) / 100);
  },

  // Calculate penalty
  calculatePenalty: (overdueAmount, days, penaltyRate = 2) => {
    const dailyRate = penaltyRate / (365 * 100);
    return numberUtils.roundToTwo(overdueAmount * dailyRate * days);
  },

  // Calculate total repayment amount
  calculateTotalRepayment: (principal, rate, tenure) => {
    const emi = loanUtils.calculateEMI(principal, rate, tenure);
    return numberUtils.roundToTwo(emi * tenure);
  }
};

// File utilities
const fileUtils = {
  // Get file extension
  getFileExtension: (filename) => {
    return filename.split('.').pop().toLowerCase();
  },

  // Check if file type is allowed
  isAllowedFileType: (filename, allowedTypes = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']) => {
    const extension = fileUtils.getFileExtension(filename);
    return allowedTypes.includes(extension);
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Generate unique filename
  generateUniqueFilename: (originalName) => {
    const extension = fileUtils.getFileExtension(originalName);
    const timestamp = Date.now();
    const random = stringUtils.generateRandomString(8);
    
    return `${timestamp}_${random}.${extension}`;
  }
};

// Array utilities
const arrayUtils = {
  // Remove duplicates
  removeDuplicates: (array, key = null) => {
    if (key) {
      return array.filter((item, index, self) => 
        index === self.findIndex(t => t[key] === item[key])
      );
    }
    return [...new Set(array)];
  },

  // Group array by key
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Sort array by multiple keys
  sortBy: (array, keys) => {
    return array.sort((a, b) => {
      for (const key of keys) {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
      }
      return 0;
    });
  },

  // Paginate array
  paginate: (array, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: array.slice(startIndex, endIndex),
      total: array.length,
      page,
      limit,
      totalPages: Math.ceil(array.length / limit)
    };
  }
};

// Encryption utilities
const encryptionUtils = {
  // Hash password
  hashPassword: async (password) => {
    const bcrypt = require('bcryptjs');
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
  },

  // Compare password
  comparePassword: async (password, hashedPassword) => {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(password, hashedPassword);
  },

  // Encrypt data
  encrypt: (text, key = process.env.ENCRYPTION_KEY) => {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  },

  // Decrypt data
  decrypt: (encryptedText, key = process.env.ENCRYPTION_KEY) => {
    const algorithm = 'aes-256-cbc';
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = textParts.join(':');
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  },

  // Generate hash
  generateHash: (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
};

// Business utilities
const businessUtils = {
  // Generate loan ID
  generateLoanId: (prefix = 'LN') => {
    const timestamp = Date.now().toString().slice(-8);
    const random = stringUtils.generateRandomString(4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  },

  // Generate customer ID
  generateCustomerId: (prefix = 'CUST') => {
    const timestamp = Date.now().toString().slice(-6);
    const random = stringUtils.generateRandomString(4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  },

  // Generate payment reference
  generatePaymentReference: (prefix = 'PAY') => {
    const timestamp = Date.now().toString();
    const random = stringUtils.generateRandomString(6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  },

  // Calculate credit score (basic implementation)
  calculateCreditScore: (factors) => {
    let score = 300; // Base score
    
    // Payment history (35% weightage)
    if (factors.paymentHistory >= 90) score += 245;
    else if (factors.paymentHistory >= 80) score += 210;
    else if (factors.paymentHistory >= 70) score += 175;
    else score += 140;
    
    // Credit utilization (30% weightage)
    if (factors.creditUtilization <= 30) score += 210;
    else if (factors.creditUtilization <= 50) score += 180;
    else if (factors.creditUtilization <= 70) score += 150;
    else score += 120;
    
    // Length of credit history (15% weightage)
    if (factors.creditHistoryLength >= 5) score += 105;
    else if (factors.creditHistoryLength >= 3) score += 90;
    else if (factors.creditHistoryLength >= 1) score += 75;
    else score += 60;
    
    // Types of credit (10% weightage)
    score += Math.min(factors.creditTypes * 10, 70);
    
    // New credit (10% weightage)
    if (factors.newCreditInquiries <= 2) score += 70;
    else if (factors.newCreditInquiries <= 5) score += 50;
    else score += 30;
    
    return Math.min(900, Math.max(300, score));
  },

  // Determine loan bucket based on DPD
  determineLoanBucket: (dpd) => {
    if (dpd === 0) return 'current';
    if (dpd <= 30) return 'bucket-1';
    if (dpd <= 60) return 'bucket-2';
    if (dpd <= 90) return 'bucket-3';
    if (dpd <= 120) return 'bucket-4';
    if (dpd <= 180) return 'bucket-5';
    return 'npa';
  }
};

module.exports = {
  dateUtils,
  numberUtils,
  stringUtils,
  validationUtils,
  loanUtils,
  fileUtils,
  arrayUtils,
  encryptionUtils,
  businessUtils
};