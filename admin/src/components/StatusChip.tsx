import Chip from '@mui/material/Chip'
import type { DeviceStatus } from '../data/demo'

const labels: Record<DeviceStatus, string> = {
  online: 'Online',
  degraded: 'Degraded',
  offline: 'Offline',
}

const colors: Record<DeviceStatus, 'success' | 'warning' | 'default'> = {
  online: 'success',
  degraded: 'warning',
  offline: 'default',
}

export function StatusChip({ status }: { status: DeviceStatus }) {
  return (
    <Chip
      size="small"
      label={labels[status]}
      color={colors[status]}
      variant={status === 'offline' ? 'outlined' : 'filled'}
    />
  )
}
