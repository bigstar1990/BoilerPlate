export function getNestedValue(obj: any, key: string): any {
  const value = key.split('.').reduce((acc, curr) => acc && acc[curr], obj)
  return value !== undefined ? value : ''
}
