#!/usr/bin/env node

// Daily DPD Update Script
// Run with: node scripts/runDPDCron.js

const mongoose = require('mongoose');
const { updateAllDPD } = require('../cron/dpdUpdater');

async function runDPDUpdate() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-management');
        console.log('Connected to MongoDB');
        
        // Run DPD update
        console.log('Starting DPD update...');
        await updateAllDPD();
        console.log('DPD update completed successfully');
        
        process.exit(0);
    } catch (error) {
        console.error('DPD update failed:', error);
        process.exit(1);
    }
}

runDPDUpdate();