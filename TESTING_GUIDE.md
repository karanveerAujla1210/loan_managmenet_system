# Testing Guide - Step by Step

Complete testing guide to verify all fixes are working.

---

## 🧪 TEST 1: SIDEBAR NAVIGATION

### Objective
Verify all sidebar links route correctly without login redirects.

### Steps

1. **Login to System**
   - Go to http://localhost:3000/login
   - Enter credentials
   - Click Login
   - Should see Dashboard

2. **Test Dashboard**
   - Click "Dashboard" in sidebar
   - ✓ Should load dashboard page
   - ✓ Should NOT redirect to login

3. **Test Credit Management**
   - Click "Credit Management" in sidebar
   - ✓ Should load page with import section
   - ✓ Should NOT redirect to login
   - ✓ Should see "Import Disbursements" section

4. **Test Disbursed Loans**
   - Click "Disbursed Loans" in sidebar
   - ✓ Should load loans page
   - ✓ Should NOT redirect to login

5. **Test Overdue Management**
   - Click "Overdue Management" in sidebar
   - ✓ Should load page with import section
   - ✓ Should NOT redirect to login
   - ✓ Should see "Import Overdue Data" section

6. **Test Legal Cases**
   - Click "Legal Cases" in sidebar
   - ✓ Should load page with import section
   - ✓ Should NOT redirect to login
   - ✓ Should see "Import Legal Cases" section

7. **Test Payment Processing**
   - Click "Payment Processing" in sidebar
   - ✓ Should load page with import section
   - ✓ Should NOT redirect to login
   - ✓ Should see payment table with Edit buttons

8. **Test Bank Reconciliation**
   - Click "Bank Reconciliation" in sidebar
   - ✓ Should load page with upload section
   - ✓ Should NOT redirect to login
   - ✓ Should see "Upload Bank Statement" section

9. **Test Customers**
   - Click "Customers" in sidebar
   - ✓ Should load customers page
   - ✓ Should NOT redirect to login

10. **Test Reports & Analytics**
    - Click "Reports & Analytics" in sidebar
    - ✓ Should load page with data
    - ✓ Should NOT redirect to login
    - ✓ Should see metrics cards

11. **Test Settings**
    - Click "Settings" in sidebar
    - ✓ Should load settings page
    - ✓ Should NOT redirect to login
    - ✓ Should see configuration options

### Expected Result
✅ All 10 pages load without login redirect

---

## 🧪 TEST 2: PAYMENT PROCESSING - EDITABLE DATA

### Objective
Verify payment records are editable inline.

### Steps

1. **Navigate to Payment Processing**
   - Click "Payment Processing" in sidebar
   - Wait for page to load
   - Should see table with payment records

2. **Locate Edit Button**
   - Look at first payment row
   - Should see "Edit" button (pencil icon)
   - ✓ Button should be visible

3. **Click Edit Button**
   - Click Edit button on first payment
   - ✓ Row should become editable
   - ✓ Fields should show input boxes
   - ✓ Should see Save and Cancel buttons

4. **Edit Payment Amount**
   - Click amount field
   - Clear current value
   - Type new amount: 7500
   - ✓ Field should update

5. **Edit Payment Date**
   - Click date field
   - Select new date
   - ✓ Date should update

6. **Edit Payment Mode**
   - Click mode dropdown
   - Select "cheque"
   - ✓ Mode should change

7. **Edit UTR**
   - Click UTR field
   - Type new UTR: UTR999999
   - ✓ UTR should update

8. **Save Changes**
   - Click Save button (checkmark icon)
   - Wait for response
   - ✓ Should see success toast message
   - ✓ Row should return to normal view
   - ✓ Changes should be saved

9. **Verify Changes Saved**
   - Refresh page (F5)
   - Navigate back to Payment Processing
   - ✓ Changes should persist
   - ✓ New values should display

10. **Test Cancel**
    - Click Edit on another payment
    - Make changes
    - Click Cancel (X icon)
    - ✓ Changes should revert
    - ✓ Row should return to normal view

### Expected Result
✅ All edits work correctly and save to backend

---

## 🧪 TEST 3: IMPORT FUNCTIONALITY

### Objective
Verify import works on all pages.

### Test 3A: Credit Management Import

1. **Navigate to Credit Management**
   - Click "Credit Management" in sidebar
   - Should see import section

2. **Download Template**
   - Click "Download Template" button
   - ✓ CSV file should download
   - ✓ File name: credit-template.csv

3. **Prepare Test Data**
   - Open downloaded CSV in Excel
   - Add test row:
     ```
     LOAN999,CUST999,50000,2024-01-20,TestBranch
     ```
   - Save as CSV

4. **Upload File**
   - Click upload area
   - Select prepared CSV file
   - ✓ Should see success message
   - ✓ Should show "Disbursements imported successfully"

### Test 3B: Payment Processing Import

1. **Navigate to Payment Processing**
   - Click "Payment Processing" in sidebar

2. **Download Template**
   - Click "Download Template" button
   - ✓ CSV file should download

3. **Prepare Test Data**
   - Open CSV in Excel
   - Add test row:
     ```
     LOAN999,5000,2024-01-20,online,UTR999999
     ```
   - Save as CSV

4. **Upload File**
   - Click upload area
   - Select prepared CSV file
   - ✓ Should see success message
   - ✓ New payment should appear in table

### Test 3C: Overdue Management Import

1. **Navigate to Overdue Management**
   - Click "Overdue Management" in sidebar

2. **Download Template**
   - Click "Download Template" button
   - ✓ CSV file should download

3. **Prepare Test Data**
   - Open CSV in Excel
   - Add test row:
     ```
     LOAN999,2024-01-10,5000,OVERDUE
     ```
   - Save as CSV

4. **Upload File**
   - Click upload area
   - Select prepared CSV file
   - ✓ Should see success message

### Test 3D: Legal Cases Import

1. **Navigate to Legal Cases**
   - Click "Legal Cases" in sidebar

2. **Download Template**
   - Click "Download Template" button
   - ✓ CSV file should download

3. **Prepare Test Data**
   - Open CSV in Excel
   - Add test row:
     ```
     LOAN999,90,FILED,Test case
     ```
     - Save as CSV

4. **Upload File**
   - Click upload area
   - Select prepared CSV file
   - ✓ Should see success message

### Test 3E: Bank Reconciliation Import

1. **Navigate to Bank Reconciliation**
   - Click "Bank Reconciliation" in sidebar

2. **Download Template**
   - Click "Download Template" button
   - ✓ CSV file should download

3. **Prepare Test Data**
   - Open CSV in Excel
   - Add test row:
     ```
     2024-01-20,5000,UTR999999,Test payment
     ```
   - Save as CSV

4. **Upload File**
   - Click upload area
   - Select prepared CSV file
   - ✓ Should see success message

### Expected Result
✅ All imports work and data appears in system

---

## 🧪 TEST 4: REPORTS & ANALYTICS

### Objective
Verify reports display data correctly.

### Steps

1. **Navigate to Reports & Analytics**
   - Click "Reports & Analytics" in sidebar
   - Wait for page to load

2. **Check Portfolio Snapshot**
   - Should see 4 metric cards
   - ✓ Total Loans card
   - ✓ Total Principal card
   - ✓ Outstanding card
   - ✓ Collection Efficiency card

3. **Verify Metrics Display**
   - Each card should show:
     - ✓ Title
     - ✓ Large number
     - ✓ Subtitle
   - Numbers should be > 0 (if data exists)

4. **Check Collection Efficiency Section**
   - Should see 3 boxes:
     - ✓ Due Amount
     - ✓ Collected Amount
     - ✓ Efficiency Rate

5. **Check Legal Exposure Section**
   - Should see 2 boxes:
     - ✓ Total Cases
     - ✓ Outstanding Amount

6. **Check Bucket-wise Exposure Table**
   - Should see table with columns:
     - ✓ Bucket
     - ✓ Loan Count
     - ✓ Outstanding Amount
     - ✓ % of Portfolio

7. **Test Export Report**
   - Click "Export Report" button
   - ✓ CSV file should download
   - ✓ File name: mis-report-YYYY-MM-DD.csv

### Expected Result
✅ All reports display with data and export works

---

## 🧪 TEST 5: SETTINGS PAGE

### Objective
Verify settings page loads and saves.

### Steps

1. **Navigate to Settings**
   - Click "Settings" in sidebar
   - Should see configuration form

2. **Verify Fields Display**
   - ✓ System Name field
   - ✓ Loan Tenure field
   - ✓ Interest Rate field
   - ✓ Processing Fee field
   - ✓ GST Rate field
   - ✓ Late Payment Penalty field
   - ✓ Repayment Frequency field
   - ✓ Legal Escalation DPD field

3. **Verify Checkboxes**
   - ✓ Email Notifications checkbox
   - ✓ SMS Notifications checkbox
   - ✓ Auto Legal Escalation checkbox

4. **Modify Settings**
   - Change System Name to "Test CRM"
   - Change Interest Rate to 25
   - Toggle Email Notifications

5. **Save Settings**
   - Click "Save Settings" button
   - ✓ Should see success message
   - ✓ Button should show "Saving..." briefly

### Expected Result
✅ Settings page works and saves correctly

---

## 🧪 TEST 6: ERROR HANDLING

### Objective
Verify error handling works correctly.

### Steps

1. **Test Invalid File Upload**
   - Go to any import page
   - Try uploading non-CSV file (e.g., .txt)
   - ✓ Should show error message

2. **Test Empty File**
   - Create empty CSV file
   - Try uploading
   - ✓ Should show error message

3. **Test Missing Headers**
   - Create CSV without headers
   - Try uploading
   - ✓ Should show error message

4. **Test Invalid Data**
   - Create CSV with invalid data (e.g., text in number field)
   - Try uploading
   - ✓ Should show error message

### Expected Result
✅ All errors handled gracefully with messages

---

## 📊 FINAL VERIFICATION

### Checklist

- [ ] All 10 sidebar links work
- [ ] No login redirects
- [ ] Payment editing works
- [ ] All imports work
- [ ] Reports display data
- [ ] Export works
- [ ] Settings save
- [ ] Error handling works
- [ ] Toast notifications appear
- [ ] No console errors

### Browser Console
- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] ✓ Should be no red errors
- [ ] ✓ Only warnings acceptable

### Network Tab
- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Perform actions
- [ ] ✓ All API calls should return 200/201
- [ ] ✓ No 404 or 500 errors

---

## 🎯 SUCCESS CRITERIA

All tests pass when:
- ✅ All navigation works
- ✅ No login redirects
- ✅ Data is editable
- ✅ Imports work
- ✅ Reports display
- ✅ No errors in console
- ✅ All API calls succeed

---

## 📝 NOTES

- Test with real data if possible
- Test with different user roles
- Test on different browsers
- Test on mobile if applicable
- Document any issues found

---

## 🚀 NEXT STEPS

If all tests pass:
1. Deploy to staging
2. Run full regression testing
3. Get stakeholder approval
4. Deploy to production

If tests fail:
1. Document issue
2. Check error message
3. Review code
4. Fix and retest
