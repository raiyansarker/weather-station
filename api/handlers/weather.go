package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
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
	// TODO: Fetch from database
	// Mock response
	now := time.Now()
	
	// Example mock returning something
	res := models.WeatherReading{
		ID:                  "mock-id",
		DeviceID:            "esp32-station-01",
		RecordedAt:          now.Add(-15 * time.Second),
		TemperatureC:        28.5,
		RelativeHumidityPct: 65.2,
		PressureHpa:         1013.2,
		LightLevel:          1024,
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
	from := c.Query("from")
	to := c.Query("to")

	if from == "" || to == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
			Error: "Must provide both 'from' and 'to' timestamp parameters",
			Code:  fiber.StatusBadRequest,
		})
	}

	// TODO: Validate timestamps, fetch from database

	// Mock response
	res := []models.WeatherReading{}

	return c.JSON(res)
}
