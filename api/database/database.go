package database

import (
	"log"
	"os"

	"github.com/raiyan/weather-station/api/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Default connection string if not provided
		dsn = "host=localhost user=postgres password=postgres dbname=weather_station port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connection successfully opened")

	// Auto Migrate the schemas
	err = db.AutoMigrate(&models.Device{}, &models.WeatherReading{})
	if err != nil {
		log.Fatalf("Failed to migrate database schemas: %v", err)
	}

	// Create TimescaleDB Hypertable for weather_readings if it doesn't exist
	var exists bool
	db.Raw(`SELECT EXISTS (
		SELECT 1 FROM timescaledb_information.hypertables 
		WHERE hypertable_name = 'weather_readings'
	)`).Scan(&exists)

	if !exists {
		log.Println("Creating TimescaleDB hypertable for weather_readings...")
		// Assuming timescaledb extension is already installed in the database:
		// CREATE EXTENSION IF NOT EXISTS timescaledb;
		err = db.Exec("SELECT create_hypertable('weather_readings', 'recorded_at', if_not_exists => TRUE);").Error
		if err != nil {
			log.Fatalf("Failed to create hypertable: %v", err)
		}
		log.Println("Hypertable created successfully")
	}

	DB = db
}
