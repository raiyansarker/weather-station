import Chip from '@mui/material/Chip'
import type { BeaconStatus } from '../data/demo'

const labels: Record<BeaconStatus, string> = {
  ok: 'OK',
  weak: 'Weak',
  missed: 'Missed',
}

const colors: Record<BeaconStatus, 'success' | 'warning' | 'error'> = {
  ok: 'success',
  weak: 'warning',
  missed: 'error',
}

export function BeaconStatusChip({ status }: { status: BeaconStatus }) {
  return <Chip size="small" label={labels[status]} color={colors[status]} />
}
