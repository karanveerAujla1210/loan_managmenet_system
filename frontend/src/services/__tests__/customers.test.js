import { describe, it, expect } from 'vitest';
import { getCustomers } from '../customers';

describe('customers service (mock)', () => {
  it('returns paginated results with default limit', async () => {
    const res = await getCustomers();
    expect(res).toHaveProperty('success', true);
    expect(res).toHaveProperty('data');
    expect(Array.isArray(res.data)).toBe(true);
    expect(res).toHaveProperty('pagination');
    expect(res.pagination).toHaveProperty('total');
    expect(res.pagination).toHaveProperty('page');
  });

  it('applies search filter', async () => {
    const res = await getCustomers({ search: 'NITIN' });
    expect(res.success).toBe(true);
    expect(res.data.every(c => c.name.toLowerCase().includes('nitin'.toLowerCase()) || c.email?.toLowerCase().includes('nitin'.toLowerCase()))).toBe(true);
  });

  it('paginates with limit and page', async () => {
    const res = await getCustomers({ page: 1, limit: 2 });
    expect(res.success).toBe(true);
    expect(res.pagination.limit).toBe(2);
    expect(res.data.length).toBeLessThanOrEqual(2);
  });
});
