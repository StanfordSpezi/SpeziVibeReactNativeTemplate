/** Formats a date as a FHIR `date` (YYYY-MM-DD) in local time, so the participant's chosen day is kept. */
export function toFhirDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses a FHIR `date` (YYYY-MM-DD) as a local date. `new Date('YYYY-MM-DD')` would use UTC midnight. */
export function fromFhirDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value);
}
