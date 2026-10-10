package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/raiyan/weather-station/api/database"
	"github.com/raiyan/weather-station/api/models"
)

// UploadTelemetry godoc
// @Summary Upload weather readings
// @Description Upload a single weather reading from an authorized ESP32
// @Tags telemetry
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param reading body models.TelemetryRequest true "Weather reading data"
// @Success 201 {object} map[string]interface{} "Reading accepted"
// @Failure 400 {object} models.ErrorResponse "Invalid request"
// @Failure 401 {object} models.ErrorResponse "Missing or invalid credentials"
// @Failure 413 {object} models.ErrorResponse "Payload too large"
// @Failure 422 {object} models.ErrorResponse "Invalid sensor data"
// @Router /api/v1/telemetry [post]
func UploadTelemetry(c *fiber.Ctx) error {
	var reading models.TelemetryRequest

	if err := c.BodyParser(&reading); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: "Invalid request body",
			Code:  fiber.StatusBadRequest,
		})
	}

	// TODO: Validate device ID and authentication header
	// TODO: Validate reading data (timestamps, ranges)
	
	// Hardcoding device ID for now since auth isn't fully implemented
	deviceID := "esp32-station-01"

	inserted, err := database.DBQueries.InsertWeatherReading(c.Context(), database.InsertWeatherReadingParams{
		RecordedAt:          pgtype.Timestamptz{Time: reading.RecordedAt, Valid: true},
		DeviceID:            deviceID,
		TemperatureC:        reading.TemperatureC,
		RelativeHumidityPct: reading.RelativeHumidityPct,
		PressureHpa:         reading.PressureHpa,
		LightLevel:          int32(reading.LightLevel),
	})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: "Failed to save reading to database",
			Code:  fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Reading accepted successfully",
		"recorded_at": inserted.RecordedAt.Time,
	})
}
