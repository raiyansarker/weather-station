import Chip from '@mui/material/Chip'

import type { LogLevel } from '../data/logs'

const colors: Record<LogLevel, 'default' | 'info' | 'warning' | 'error'> = {
  debug: 'default',
  info: 'info',
  warn: 'warning',
  error: 'error',
}

export function LogLevelChip({ level }: { level: LogLevel }) {
  return (
    <Chip
      size="small"
      label={level}
      color={colors[level]}
      variant={level === 'debug' ? 'outlined' : 'filled'}
      sx={{
        height: 22,
        fontFamily: 'ui-monospace, monospace',
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
      }}
    />
  )
}
