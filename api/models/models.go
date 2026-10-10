package models

import "time"

// Device represents an authorized ESP32 station
type Device struct {
	ID             string     `gorm:"primaryKey;type:varchar(50)" json:"id"`
	Name           string     `gorm:"not null" json:"name"`
	CredentialHash string     `gorm:"not null" json:"-"`
	Status         string     `gorm:"not null;default:'active'" json:"status"`
	CreatedAt      time.Time  `gorm:"autoCreateTime" json:"created_at"`
	LastSeenAt     *time.Time `json:"last_seen_at"`
}

// WeatherReading represents a single weather data point returned by the API
type WeatherReading struct {
	RecordedAt          time.Time `gorm:"primaryKey;not null" json:"recorded_at" example:"2026-10-10T10:00:00Z"`
	ID                  string    `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id" example:"123e4567-e89b-12d3-a456-426614174000"`
	DeviceID            string    `gorm:"index;type:varchar(50);not null" json:"device_id" example:"esp32-station-01"`
	TemperatureC        float64   `gorm:"not null" json:"temperature_c" example:"25.5"`
	RelativeHumidityPct float64   `gorm:"not null" json:"relative_humidity_pct" example:"60.0"`
	PressureHpa         float64   `gorm:"not null" json:"pressure_hpa" example:"1012.5"`
	LightLevel          int       `gorm:"not null" json:"light_level" example:"3500"`
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
