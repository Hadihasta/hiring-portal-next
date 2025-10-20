export function getJobNumber(id: string): number {
  const parts = id.split('_')
  const lastPart = parts[parts.length - 1]
  return parseInt(lastPart, 10) // otomatis hilangkan leading zero
}