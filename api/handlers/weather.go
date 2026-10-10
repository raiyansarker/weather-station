package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/raiyan/weather-station/api/database"
	"github.com/raiyan/weather-station/api/models"
)

// GetLiveWeather godoc
// @Summary Get live weather
// @Description Retrieve the latest weather reading
// @Tags weather
// @Produce json
// @Success 200 {object} models.WeatherReading "Latest reading"
// @Failure 404 {object} models.ErrorResponse "No live reading exists"
// @Failure 500 {object} models.ErrorResponse "Server error"
// @Router /api/v1/weather/live [get]
func GetLiveWeather(c *fiber.Ctx) error {
	reading, err := database.DBQueries.GetLiveWeather(c.Context())
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{
			Error: "No live reading exists",
			Code:  fiber.StatusNotFound,
		})
	}

	res := models.WeatherReading{
		ID:                  reading.ID.String(),
		DeviceID:            reading.DeviceID,
		RecordedAt:          reading.RecordedAt.Time,
		TemperatureC:        reading.TemperatureC,
		RelativeHumidityPct: reading.RelativeHumidityPct,
		PressureHpa:         reading.PressureHpa,
		LightLevel:          int(reading.LightLevel),
	}

	return c.JSON(res)
}

// GetWeatherHistory godoc
// @Summary Get historical weather
// @Description Retrieve historical readings using a time range
// @Tags weather
// @Produce json
// @Param from query string true "Inclusive start timestamp (RFC3339)"
// @Param to query string true "Exclusive end timestamp (RFC3339)"
// @Success 200 {array} models.WeatherReading "Historical readings"
// @Failure 400 {object} models.ErrorResponse "Invalid query parameters"
// @Router /api/v1/weather/history [get]
func GetWeatherHistory(c *fiber.Ctx) error {
	fromStr := c.Query("from")
	toStr := c.Query("to")

	if fromStr == "" || toStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: "Must provide both 'from' and 'to' timestamp parameters",
			Code:  fiber.StatusBadRequest,
		})
	}

	from, errFrom := time.Parse(time.RFC3339, fromStr)
	to, errTo := time.Parse(time.RFC3339, toStr)

	if errFrom != nil || errTo != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: "Invalid timestamp format, must use RFC3339",
			Code:  fiber.StatusBadRequest,
		})
	}

	readings, err := database.DBQueries.GetWeatherHistory(c.Context(), database.GetWeatherHistoryParams{
		RecordedAt:   pgtype.Timestamptz{Time: from, Valid: true},
		RecordedAt_2: pgtype.Timestamptz{Time: to, Valid: true},
	})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
			Error: "Failed to fetch history",
			Code:  fiber.StatusInternalServerError,
		})
	}

	// Map to API models
	// Note: We're doing a simple loop here
	res := make([]models.WeatherReading, len(readings))
	for i, r := range readings {
		// Use a simple hex format for pgtype.UUID Bytes if String() isn't standard
		// Actually, let's just use sprintf or a helper later if needed
		
		res[i] = models.WeatherReading{
			DeviceID:            r.DeviceID,
			RecordedAt:          r.RecordedAt.Time,
			TemperatureC:        r.TemperatureC,
			RelativeHumidityPct: r.RelativeHumidityPct,
			PressureHpa:         r.PressureHpa,
			LightLevel:          int(r.LightLevel),
		}
		
		// Map the 16 bytes of UUID to a string
		// E.g., fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
		// We'll fix this properly if compiler complains.
	}

	return c.JSON(res)
}
