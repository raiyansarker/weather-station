import { useMemo } from 'react'
import { LineChart } from '@mui/x-charts/LineChart'

import type { DeviceBeacon } from '../data/demo'
import { chartColors } from './colors'
import { formatChartTime } from './format'

type Props = {
  beacons: DeviceBeacon[]
  height?: number
}

export function RssiChart({ beacons, height = 220 }: Props) {
  const dataset = useMemo(() => {
    return [...beacons]
      .filter((b) => b.rssiDbm != null)
      .sort((a, b) => a.at.localeCompare(b.at))
      .map((b) => ({
        t: new Date(b.at),
        rssi: b.rssiDbm as number,
        heap: b.freeHeapKb,
      }))
  }, [beacons])

  if (dataset.length === 0) {
    return null
  }

  return (
    <LineChart
      height={height}
      dataset={dataset}
      series={[
        {
          id: 'rssi',
          label: 'RSSI dBm',
          dataKey: 'rssi',
          color: chartColors.ink,
          showMark: true,
          curve: 'monotoneX',
          area: true,
          valueFormatter: (v: number | null) => (v == null ? '—' : `${v} dBm`),
        },
      ]}
      xAxis={[
        {
          dataKey: 't',
          scaleType: 'time',
          valueFormatter: (v: Date) => formatChartTime(v),
          tickNumber: 4,
        },
      ]}
      yAxis={[{ width: 48, tickNumber: 4 }]}
      grid={{ horizontal: true }}
      margin={{ left: 8, right: 12, top: 10, bottom: 8 }}
      sx={{
        [`& .MuiAreaElement-root`]: { fillOpacity: 0.08 },
        [`& .MuiChartsAxis-line`]: { stroke: chartColors.grid },
        [`& .MuiChartsAxis-tick`]: { stroke: chartColors.grid },
        [`& .MuiChartsGrid-line`]: { stroke: chartColors.grid },
      }}
    />
  )
}
