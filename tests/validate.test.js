const { isEmpty } = require('@/common/validate');

describe('isEmpty', () => {
  it('빈 값이면 true', () => {
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
  });

  it('값이 있으면 false', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty('a')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});
