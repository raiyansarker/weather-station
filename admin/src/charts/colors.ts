/** Quiet palette aligned with the Shopify-style admin chrome. */
export const chartColors = {
  ink: '#1a1a1a',
  teal: '#008060',
  slate: '#6d7175',
  amber: '#b98900',
  rust: '#c05746',
  mist: '#8c9196',
  grid: '#e3e3e3',
} as const

export const deviceSeriesColor: Record<string, string> = {
  'esp32-roof-01': chartColors.ink,
  'esp32-garden-02': chartColors.teal,
  'esp32-shed-03': chartColors.amber,
  'esp32-balcony-04': chartColors.rust,
}
