package models

import "time"

// WeatherReading represents a single weather data point returned by the API
type WeatherReading struct {
	ID                  string    `json:"id" example:"123e4567-e89b-12d3-a456-426614174000"`
	DeviceID            string    `json:"device_id" example:"esp32-station-01"`
	RecordedAt          time.Time `json:"recorded_at" example:"2026-10-10T10:00:00Z"`
	TemperatureC        float64   `json:"temperature_c" example:"25.5"`
	RelativeHumidityPct float64   `json:"relative_humidity_pct" example:"60.0"`
	PressureHpa         float64   `json:"pressure_hpa" example:"1012.5"`
	LightLevel          int       `json:"light_level" example:"3500"`
}

// TelemetryRequest represents the data sent by the ESP32 every minute
type TelemetryRequest struct {
	RecordedAt          time.Time `json:"recorded_at" example:"2026-10-10T10:00:00Z"`
	TemperatureC        float64   `json:"temperature_c" example:"25.5"`
	RelativeHumidityPct float64   `json:"relative_humidity_pct" example:"60.0"`
	PressureHpa         float64   `json:"pressure_hpa" example:"1012.5"`
	LightLevel          int       `json:"light_level" example:"3500"`
}

// ErrorResponse represents a standard error response
type ErrorResponse struct {
	Error string `json:"error" example:"Invalid request"`
	Code  int    `json:"code" example:"400"`
}
