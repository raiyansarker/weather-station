export function formatChartTime(value: Date | number | string): string {
  const d = value instanceof Date ? value : new Date(value)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function formatChartDayTime(value: Date | number | string): string {
  const d = value instanceof Date ? value : new Date(value)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
