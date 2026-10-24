import { useMemo } from 'react'
import { LineChart } from '@mui/x-charts/LineChart'

import type { WeatherReading } from '../data/demo'
import { deviceSeriesColor, chartColors } from './colors'
import { formatChartDayTime, formatChartTime } from './format'

type Props = {
  readings: WeatherReading[]
  deviceIds: string[]
  deviceLabel: (id: string) => string
  height?: number
  temperatureUnit?: 'c' | 'f'
}

function toDisplayTemp(c: number, unit: 'c' | 'f'): number {
  return unit === 'f' ? (c * 9) / 5 + 32 : c
}

export function TemperatureChart({
  readings,
  deviceIds,
  deviceLabel,
  height = 260,
  temperatureUnit = 'c',
}: Props) {
  const { times, series } = useMemo(() => {
    const byDevice = new Map<string, Map<number, number>>()
    const timeSet = new Set<number>()

    for (const id of deviceIds) byDevice.set(id, new Map())

    for (const r of readings) {
      if (!byDevice.has(r.deviceId)) continue
      const t = Date.parse(r.recordedAt)
      timeSet.add(t)
      byDevice.get(r.deviceId)!.set(t, toDisplayTemp(r.temperatureC, temperatureUnit))
    }

    const timesSorted = [...timeSet].sort((a, b) => a - b)
    const seriesData = deviceIds.map((id) => {
      const map = byDevice.get(id)!
      return {
        id,
        label: deviceLabel(id),
        color: deviceSeriesColor[id] ?? chartColors.slate,
        data: timesSorted.map((t) => map.get(t) ?? null),
      }
    })

    return { times: timesSorted.map((t) => new Date(t)), series: seriesData }
  }, [readings, deviceIds, deviceLabel, temperatureUnit])

  const unit = temperatureUnit === 'f' ? '°F' : '°C'

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
        valueFormatter: (v: number | null) => (v == null ? '—' : `${v.toFixed(1)} ${unit}`),
      }))}
      xAxis={[
        {
          data: times,
          scaleType: 'time',
          valueFormatter: (v: Date) => formatChartTime(v),
          tickNumber: 6,
        },
      ]}
      yAxis={[
        {
          width: 44,
          label: unit,
          tickNumber: 5,
        },
      ]}
      grid={{ horizontal: true }}
      margin={{ left: 8, right: 12, top: 16, bottom: 8 }}
      slotProps={{
        legend: { direction: 'horizontal', position: { vertical: 'top', horizontal: 'end' } },
      }}
      sx={{
        [`& .MuiChartsAxis-line`]: { stroke: chartColors.grid },
        [`& .MuiChartsAxis-tick`]: { stroke: chartColors.grid },
        [`& .MuiChartsGrid-line`]: { stroke: chartColors.grid },
      }}
      localeText={{
        loading: 'Loading…',
      }}
    />
  )
}

export function SingleDeviceClimateChart({
  readings,
  height = 240,
  temperatureUnit = 'c',
}: {
  readings: WeatherReading[]
  height?: number
  temperatureUnit?: 'c' | 'f'
}) {
  const dataset = useMemo(() => {
    return [...readings]
      .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))
      .map((r) => ({
        t: new Date(r.recordedAt),
        temp: toDisplayTemp(r.temperatureC, temperatureUnit),
        rh: r.relativeHumidityPct,
      }))
  }, [readings, temperatureUnit])

  const unit = temperatureUnit === 'f' ? '°F' : '°C'

  return (
    <LineChart
      height={height}
      dataset={dataset}
      series={[
        {
          id: 'temp',
          label: `Temp ${unit}`,
          dataKey: 'temp',
          color: chartColors.ink,
          showMark: false,
          curve: 'monotoneX',
          yAxisId: 'temp',
        },
        {
          id: 'rh',
          label: 'Humidity %',
          dataKey: 'rh',
          color: chartColors.teal,
          showMark: false,
          curve: 'monotoneX',
          yAxisId: 'rh',
        },
      ]}
      xAxis={[
        {
          dataKey: 't',
          scaleType: 'time',
          valueFormatter: (v: Date) => formatChartDayTime(v),
          tickNumber: 5,
        },
      ]}
      yAxis={[
        { id: 'temp', width: 40, tickNumber: 4 },
        { id: 'rh', width: 40, position: 'right', tickNumber: 4, min: 0, max: 100 },
      ]}
      grid={{ horizontal: true }}
      margin={{ left: 8, right: 8, top: 16, bottom: 8 }}
      sx={{
        [`& .MuiChartsAxis-line`]: { stroke: chartColors.grid },
        [`& .MuiChartsAxis-tick`]: { stroke: chartColors.grid },
        [`& .MuiChartsGrid-line`]: { stroke: chartColors.grid },
      }}
    />
  )
}
