const fs = require('fs');
const path = require('path');

// Read the main JSON file
const mainJsonPath = './mongo_6_tables_filled.json';
const data = JSON.parse(fs.readFileSync(mainJsonPath, 'utf8'));

// Add users data
const users = [
    {"_id":"675a1b2c3d4e5f6789012345","name":"Karanveer Singh","email":"karanveer@loancrm.com","password":"$2b$10$mbl123hashedpassword","role":"head","isActive":true,"createdAt":"2024-01-01T00:00:00.000Z","updatedAt":"2024-01-01T00:00:00.000Z"},
    {"_id":"675a1b2c3d4e5f6789012346","name":"Arvind","email":"arvind@loancrm.com","password":"$2b$10$mbl123hashedpassword","role":"head","isActive":true,"createdAt":"2024-01-01T00:00:00.000Z","updatedAt":"2024-01-01T00:00:00.000Z"},
    {"_id":"675a1b2c3d4e5f6789012347","name":"Admin","email":"admin@loancrm.com","password":"$2b$10$mbl123hashedpassword","role":"head","isActive":true,"createdAt":"2024-01-01T00:00:00.000Z","updatedAt":"2024-01-01T00:00:00.000Z"},
    {"_id":"675a1b2c3d4e5f6789012348","name":"Manish","email":"manish@loancrm.com","password":"$2b$10$mbl123hashedpassword","role":"head","isActive":true,"createdAt":"2024-01-01T00:00:00.000Z","updatedAt":"2024-01-01T00:00:00.000Z"}
];

// Extract collections
const collections = {
    users: users,
    customers: data.customers || [],
    loans: data.loans || [],
    payments: data.payments || [],
    disbursements: data.disbursements || [],
    documents: data.documents || []
};

// Create separate JSON files for each collection
Object.keys(collections).forEach(collectionName => {
    const fileName = `${collectionName}.json`;
    const filePath = path.join(__dirname, fileName);
    
    // Write each document on a separate line (JSONL format for mongoimport)
    const jsonlContent = collections[collectionName]
        .map(doc => JSON.stringify(doc))
        .join('\n');
    
    fs.writeFileSync(filePath, jsonlContent);
    console.log(`Created ${fileName} with ${collections[collectionName].length} documents`);
});

// Generate import commands
const importCommands = Object.keys(collections)
    .filter(name => collections[name].length > 0)
    .map(name => `mongoimport --db loancrm --collection ${name} --file ${name}.json`)
    .join('\n');

// Create import script
const importScript = `@echo off
echo Starting MongoDB import...

${importCommands}

echo Import completed!
pause
`;

fs.writeFileSync('import-data.bat', importScript);
console.log('\nImport commands created in import-data.bat');

// Also create a shell script for Unix systems
const shellScript = `#!/bin/bash
echo "Starting MongoDB import..."

${importCommands}

echo "Import completed!"
`;

fs.writeFileSync('import-data.sh', shellScript);
console.log('Import commands created in import-data.sh');

console.log('\nTo import the data:');
console.log('1. Make sure MongoDB is running');
console.log('2. Run: import-data.bat (Windows) or ./import-data.sh (Unix/Linux/Mac)');
console.log('\nOr run individual commands:');
console.log(importCommands);
console.log('\nUsers created with Head role:');
console.log('- Karanveer Singh (karanveer@loancrm.com)');
console.log('- Arvind (arvind@loancrm.com)');
console.log('- Admin (admin@loancrm.com)');
console.log('- Manish (manish@loancrm.com)');
console.log('Password for all: mbl123');