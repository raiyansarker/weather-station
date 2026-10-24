import { useMemo } from 'react'
import { LineChart } from '@mui/x-charts/LineChart'

import type { PingSample } from '../data/demo'
import { chartColors, deviceSeriesColor } from './colors'
import { formatChartTime } from './format'

type Props = {
  pings: PingSample[]
  deviceIds: string[]
  deviceLabel: (id: string) => string
  height?: number
}

export function PingLatencyChart({ pings, deviceIds, deviceLabel, height = 240 }: Props) {
  const { times, series } = useMemo(() => {
    const byDevice = new Map<string, Map<number, number | null>>()
    const timeSet = new Set<number>()
    for (const id of deviceIds) byDevice.set(id, new Map())

    for (const p of pings) {
      if (!byDevice.has(p.deviceId)) continue
      const t = Date.parse(p.at)
      timeSet.add(t)
      byDevice.get(p.deviceId)!.set(t, p.ok ? p.latencyMs : null)
    }

    const timesSorted = [...timeSet].sort((a, b) => a - b)
    return {
      times: timesSorted.map((t) => new Date(t)),
      series: deviceIds.map((id) => ({
        id,
        label: deviceLabel(id),
        color: deviceSeriesColor[id] ?? chartColors.slate,
        data: timesSorted.map((t) => byDevice.get(id)!.get(t) ?? null),
      })),
    }
  }, [pings, deviceIds, deviceLabel])

  return (
    <LineChart
      height={height}
      series={series.map((s) => ({
        id: s.id,
        label: s.label,
        data: s.data,
        color: s.color,
        showMark: false,
        curve: 'monotoneX',
        connectNulls: false,
        valueFormatter: (v: number | null) => (v == null ? 'timeout' : `${v} ms`),
      }))}
      xAxis={[
        {
          data: times,
          scaleType: 'time',
          valueFormatter: (v: Date) => formatChartTime(v),
          tickNumber: 5,
        },
      ]}
      yAxis={[{ width: 40, label: 'ms', min: 0, tickNumber: 4 }]}
      grid={{ horizontal: true }}
      margin={{ left: 8, right: 12, top: 16, bottom: 8 }}
      sx={{
        [`& .MuiChartsAxis-line`]: { stroke: chartColors.grid },
        [`& .MuiChartsAxis-tick`]: { stroke: chartColors.grid },
        [`& .MuiChartsGrid-line`]: { stroke: chartColors.grid },
      }}
    />
  )
}
