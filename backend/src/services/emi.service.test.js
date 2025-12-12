const { generateScheduleReducing, calculatePenalty, calculateOutstanding, toFixedNumber } = require('./emi.service');

describe('EMI Service', () => {
  describe('toFixedNumber', () => {
    test('should round correctly', () => {
      expect(toFixedNumber(1.235)).toBe(1.24);
      expect(toFixedNumber(1.234)).toBe(1.23);
      expect(toFixedNumber(0.1 + 0.2)).toBe(0.3);
    });
  });

  describe('generateScheduleReducing', () => {
    test('should generate correct schedule for standard loan', () => {
      const schedule = generateScheduleReducing(100000, 12, 12, new Date('2024-01-01'));
      
      expect(schedule).toHaveLength(12);
      expect(schedule[0].sequence).toBe(1);
      expect(schedule[0].principalDue).toBeGreaterThan(0);
      expect(schedule[0].interestDue).toBeGreaterThan(0);
      expect(schedule[11].remaining).toBe(0);
      
      // Total principal should equal loan amount
      const totalPrincipal = schedule.reduce((sum, inst) => sum + inst.principalDue, 0);
      expect(Math.abs(totalPrincipal - 100000)).toBeLessThan(0.01);
    });

    test('should handle zero interest rate', () => {
      const schedule = generateScheduleReducing(120000, 0, 12, new Date('2024-01-01'));
      
      expect(schedule).toHaveLength(12);
      schedule.forEach(inst => {
        expect(inst.interestDue).toBe(0);
        expect(inst.principalDue).toBe(10000);
        expect(inst.totalDue).toBe(10000);
      });
    });

    test('should handle single month loan', () => {
      const schedule = generateScheduleReducing(50000, 12, 1, new Date('2024-01-01'));
      
      expect(schedule).toHaveLength(1);
      expect(schedule[0].principalDue).toBe(50000);
      expect(schedule[0].interestDue).toBe(500); // 50000 * 0.01
      expect(schedule[0].remaining).toBe(0);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => generateScheduleReducing(0, 12, 12)).toThrow('Principal and term must be positive');
      expect(() => generateScheduleReducing(100000, 12, 0)).toThrow('Principal and term must be positive');
      expect(() => generateScheduleReducing(-100000, 12, 12)).toThrow('Principal and term must be positive');
    });

    test('should generate correct dates', () => {
      const startDate = new Date(2024, 0, 15); // Month is 0-indexed
      const schedule = generateScheduleReducing(100000, 12, 3, startDate);
      
      expect(schedule[0].dueDate).toEqual(new Date(2024, 1, 15));
      expect(schedule[1].dueDate).toEqual(new Date(2024, 2, 15));
      expect(schedule[2].dueDate).toEqual(new Date(2024, 3, 15));
    });
  });

  describe('calculatePenalty', () => {
    test('should calculate penalty correctly', () => {
      const penalty = calculatePenalty(10000, 30, 24);
      const expected = 10000 * (24/365/100) * 30;
      expect(penalty).toBeCloseTo(expected, 2);
    });

    test('should return 0 for no overdue days', () => {
      expect(calculatePenalty(10000, 0, 24)).toBe(0);
      expect(calculatePenalty(10000, -5, 24)).toBe(0);
    });

    test('should use default penalty rate', () => {
      const penalty = calculatePenalty(10000, 30);
      expect(penalty).toBeGreaterThan(0);
    });
  });

  describe('calculateOutstanding', () => {
    test('should calculate outstanding amounts correctly', () => {
      const schedule = [
        {
          principalDue: 1000,
          interestDue: 100,
          penaltyDue: 50,
          paidPrincipal: 500,
          paidInterest: 100,
          paidPenalty: 0
        },
        {
          principalDue: 1000,
          interestDue: 90,
          penaltyDue: 0,
          paidPrincipal: 0,
          paidInterest: 0,
          paidPenalty: 0
        }
      ];

      const outstanding = calculateOutstanding(schedule);
      
      expect(outstanding.outstandingPrincipal).toBe(1500); // 2000 - 500
      expect(outstanding.outstandingInterest).toBe(90); // 190 - 100
      expect(outstanding.outstandingPenalty).toBe(50); // 50 - 0
      expect(outstanding.totalOutstanding).toBe(1640); // 1500 + 90 + 50
    });

    test('should handle missing payment fields', () => {
      const schedule = [
        {
          principalDue: 1000,
          interestDue: 100
        }
      ];

      const outstanding = calculateOutstanding(schedule);
      
      expect(outstanding.outstandingPrincipal).toBe(1000);
      expect(outstanding.outstandingInterest).toBe(100);
      expect(outstanding.outstandingPenalty).toBe(0);
      expect(outstanding.totalOutstanding).toBe(1100);
    });
  });
});