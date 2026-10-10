package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	_ "github.com/raiyan/weather-station/api/docs" // Import swagger docs
	"github.com/raiyan/weather-station/api/handlers"
	"github.com/raiyan/weather-station/api/database"
)

// @title Weather Station API
// @version 1.0
// @description API for ESP32 Weather Station telemetry and retrieval.
// @host localhost:8000
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func main() {
	// Initialize database connection
	database.ConnectDB()

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
				"code":  code,
			})
		},
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())

	// Health endpoint at root
	app.Get("/health", handlers.HealthCheck)

	// Serve the OpenAPI JSON file
	app.Static("/swagger.json", "./docs/swagger.json")

	// Serve Stoplight Elements UI on the home page
	app.Get("/", func(c *fiber.Ctx) error {
		c.Set("Content-Type", "text/html; charset=utf-8")
		return c.SendString(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Weather Station API Docs</title>
    <!-- Stoplight Elements Web Component -->
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
    <style>
      body {
        height: 100vh;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <elements-api
      apiDescriptionUrl="/swagger.json"
      router="hash"
      layout="sidebar"
    />
  </body>
</html>`)
	})

	app.Get("/docs", func(c *fiber.Ctx) error {
		return c.Redirect("/")
	})

	// API Group
	v1 := app.Group("/api/v1")

	// Routes
	v1.Post("/telemetry", handlers.UploadTelemetry)
	v1.Get("/weather/live", handlers.GetLiveWeather)
	v1.Get("/weather/history", handlers.GetWeatherHistory)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
