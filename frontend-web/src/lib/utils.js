import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function calculateEMI(principal, rate, tenure) {
  const monthlyRate = rate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

export function calculateLoanSchedule(principal, rate, tenure) {
  const monthlyRate = rate / 12 / 100;
  const emi = calculateEMI(principal, rate, tenure);
  const schedule = [];
  let balance = principal;
  
  for (let month = 1; month <= tenure; month++) {
    const interest = balance * monthlyRate;
    const principalPayment = emi - interest;
    balance -= principalPayment;
    
    schedule.push({
      month,
      emi,
      interest: Math.round(interest),
      principal: Math.round(principalPayment),
      balance: Math.round(balance),
    });
  }
  
  return schedule;
}
