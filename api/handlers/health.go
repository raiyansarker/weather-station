package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// HealthCheck godoc
// @Summary Health check
// @Description Check the health status of the API
// @Tags health
// @Produce json
// @Success 200 {object} map[string]string "API is healthy"
// @Router /health [get]
func HealthCheck(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "ok",
	})
}
