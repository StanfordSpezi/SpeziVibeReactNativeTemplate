import { fromFhirDate, toFhirDate } from '../../utils/fhirDate';

// A date picker gives the chosen day at local midnight. In a time zone ahead of UTC, that instant is still the
// previous day in UTC, so formatting it via toISOString() saved the wrong day.
// The tests run in Asia/Tokyo (see jest.global-setup.js).
describe('FHIR dates in a time zone ahead of UTC', () => {
  it('runs in UTC+9', () => {
    expect(new Date(2026, 2, 15).getTimezoneOffset()).toBe(-540);
  });

  it('keeps the chosen day', () => {
    const pickedLocalMidnight = new Date(2026, 2, 15);
    expect(pickedLocalMidnight.toISOString().split('T')[0]).toBe('2026-03-14'); // the old behaviour
    expect(toFhirDate(pickedLocalMidnight)).toBe('2026-03-15');
  });

  it('parses a FHIR date as that local day', () => {
    const date = fromFhirDate('2026-03-15');
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([2026, 2, 15, 0]);
    expect(toFhirDate(fromFhirDate('2026-12-31'))).toBe('2026-12-31');
  });
});
