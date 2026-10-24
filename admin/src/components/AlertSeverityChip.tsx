import Chip from '@mui/material/Chip'
import type { AlertSeverity } from '../data/demo'

const colors: Record<AlertSeverity, 'info' | 'warning' | 'error'> = {
  info: 'info',
  warning: 'warning',
  critical: 'error',
}

export function AlertSeverityChip({ severity }: { severity: AlertSeverity }) {
  return (
    <Chip
      size="small"
      label={severity}
      color={colors[severity]}
      sx={{ textTransform: 'capitalize' }}
    />
  )
}
