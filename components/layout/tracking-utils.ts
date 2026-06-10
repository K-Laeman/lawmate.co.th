/** Validate a tracking ID against its expected format before interpolating into scripts. */
export function sanitizeId(id: string, pattern: RegExp): string {
  return pattern.test(id) ? id : ''
}
