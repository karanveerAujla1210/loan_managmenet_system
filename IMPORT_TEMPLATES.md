# Import Templates - CSV Format

Use these templates to import data into the system. Download templates from each page or copy the format below.

---

## 1. DISBURSEMENTS IMPORT

**File:** `disbursements.csv`
**Page:** Credit Management
**Endpoint:** `POST /api/v1/admin/import-disbursements`

### Headers
```
loanId,customerId,principal,disbursementDate,branch
```

### Sample Data
```
LOAN001,CUST001,50000,2024-01-01,Mumbai
LOAN002,CUST002,75000,2024-01-02,Delhi
LOAN003,CUST003,100000,2024-01-03,Bangalore
LOAN004,CUST004,60000,2024-01-04,Chennai
LOAN005,CUST005,80000,2024-01-05,Hyderabad
```

### Field Details
- **loanId:** Unique loan identifier (string)
- **customerId:** Customer ID (string)
- **principal:** Loan amount in rupees (number)
- **disbursementDate:** Date in YYYY-MM-DD format
- **branch:** Branch name (string)

---

## 2. PAYMENTS IMPORT

**File:** `payments.csv`
**Page:** Payment Processing
**Endpoint:** `POST /api/v1/admin/import-payments`

### Headers
```
loanId,amount,paymentDate,mode,utr
```

### Sample Data
```
LOAN001,5000,2024-01-15,online,UTR123456789
LOAN002,7500,2024-01-16,cheque,CHQ987654321
LOAN003,10000,2024-01-17,cash,CASH001
LOAN004,6000,2024-01-18,upi,UPI123456
LOAN005,8000,2024-01-19,online,UTR987654321
```

### Field Details
- **loanId:** Loan ID (string)
- **amount:** Payment amount in rupees (number)
- **paymentDate:** Date in YYYY-MM-DD format
- **mode:** Payment method - cash, cheque, online, upi (string)
- **utr:** UTR/Reference number (string, optional)

---

## 3. OVERDUE DATA IMPORT

**File:** `overdue.csv`
**Page:** Overdue Management
**Endpoint:** `POST /api/v1/admin/import-overdue`

### Headers
```
loanId,dueDate,amount,status
```

### Sample Data
```
LOAN001,2024-01-10,5000,OVERDUE
LOAN002,2024-01-11,7500,OVERDUE
LOAN003,2024-01-12,10000,OVERDUE
LOAN004,2024-01-13,6000,PENDING
LOAN005,2024-01-14,8000,OVERDUE
```

### Field Details
- **loanId:** Loan ID (string)
- **dueDate:** Due date in YYYY-MM-DD format
- **amount:** Due amount in rupees (number)
- **status:** OVERDUE or PENDING (string)

---

## 4. LEGAL CASES IMPORT

**File:** `legal_cases.csv`
**Page:** Legal Cases
**Endpoint:** `POST /api/v1/admin/import-legal-cases`

### Headers
```
loanId,dpdAtEntry,status,remarks
```

### Sample Data
```
LOAN001,90,FILED,Notice sent to customer
LOAN002,95,FILED,Summons issued
LOAN003,100,FILED,Court hearing scheduled
LOAN004,92,PENDING,Documentation in progress
LOAN005,98,RESOLVED,Settlement reached
```

### Field Details
- **loanId:** Loan ID (string)
- **dpdAtEntry:** Days Past Due when case filed (number)
- **status:** FILED, PENDING, or RESOLVED (string)
- **remarks:** Additional notes (string, optional)

---

## 5. BANK RECONCILIATION IMPORT

**File:** `bank_statement.csv`
**Page:** Bank Reconciliation
**Endpoint:** `POST /api/v1/admin/reconciliation/upload`

### Headers
```
transactionDate,amount,utr,narration
```

### Sample Data
```
2024-01-15,5000,UTR123456789,Loan Payment - LOAN001
2024-01-16,7500,UTR987654321,Loan Payment - LOAN002
2024-01-17,10000,UTR456789123,Loan Payment - LOAN003
2024-01-18,6000,UTR789123456,Loan Payment - LOAN004
2024-01-19,8000,UTR321456789,Loan Payment - LOAN005
```

### Field Details
- **transactionDate:** Date in YYYY-MM-DD format
- **amount:** Transaction amount in rupees (number)
- **utr:** UTR/Reference number (string)
- **narration:** Transaction description (string)

---

## 📋 IMPORT GUIDELINES

### General Rules
1. **Headers must match exactly** - Case sensitive
2. **No extra columns** - Only include specified headers
3. **No empty rows** - Remove blank lines
4. **Date format** - Always use YYYY-MM-DD
5. **Numbers** - No currency symbols or commas
6. **Strings** - No quotes unless needed

### Valid Examples
```
✓ 2024-01-15 (correct date)
✓ 5000 (correct number)
✓ online (correct mode)
✓ LOAN001 (correct ID)

✗ 15-01-2024 (wrong date format)
✗ 5,000 (wrong number format)
✗ Online (wrong case)
✗ "LOAN001" (unnecessary quotes)
```

### File Format
- **Format:** CSV (Comma Separated Values)
- **Encoding:** UTF-8
- **Line Ending:** LF (Unix style)
- **Size Limit:** 10MB

### Error Handling
If import fails:
1. Check headers match exactly
2. Verify date format (YYYY-MM-DD)
3. Remove any special characters
4. Ensure no empty rows
5. Check file encoding (UTF-8)

---

## 🔄 IMPORT WORKFLOW

### Step 1: Download Template
- Go to page (e.g., Payment Processing)
- Click "Download Template"
- Opens CSV file

### Step 2: Fill Data
- Open in Excel or text editor
- Add your data rows
- Keep headers unchanged
- Save as CSV

### Step 3: Upload
- Go to import section
- Click upload area or select file
- Choose your CSV file
- Wait for success message

### Step 4: Verify
- Check success notification
- Verify data in table
- Confirm counts match

---

## 💡 TIPS

1. **Test with small file first** - Upload 5 rows to test
2. **Use Excel for editing** - Easier than text editor
3. **Save as CSV** - Not XLSX or other formats
4. **Check for duplicates** - System may reject duplicates
5. **Keep backup** - Save original file before uploading

---

## ❌ COMMON ERRORS

### Error: "Invalid date format"
- **Cause:** Date not in YYYY-MM-DD format
- **Fix:** Use 2024-01-15 not 15-01-2024

### Error: "Missing required field"
- **Cause:** Header name doesn't match
- **Fix:** Check spelling and case

### Error: "Invalid number"
- **Cause:** Number has comma or symbol
- **Fix:** Use 5000 not 5,000 or ₹5000

### Error: "File too large"
- **Cause:** File exceeds 10MB
- **Fix:** Split into smaller files

### Error: "Invalid payment mode"
- **Cause:** Mode not in allowed list
- **Fix:** Use cash, cheque, online, or upi

---

## 📞 SUPPORT

For import issues:
1. Check this guide
2. Verify file format
3. Check error message
4. Contact admin

---

## 📊 BATCH IMPORT LIMITS

- **Disbursements:** Up to 1000 per file
- **Payments:** Up to 5000 per file
- **Legal Cases:** Up to 500 per file
- **Bank Statements:** Up to 10000 per file

For larger batches, split into multiple files.
