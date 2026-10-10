package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DBQueries *Queries
var Pool *pgxpool.Pool

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Default connection string if not provided
		dsn = "postgres://postgres:postgres@localhost:5432/weather_station?sslmode=disable"
	}

	pool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connection successfully opened")

	// Execute migrations directly (in a real app, use golang-migrate or similar)
	schema := `
	CREATE TABLE IF NOT EXISTS devices (
		id VARCHAR(50) PRIMARY KEY,
		name TEXT NOT NULL,
		credential_hash TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'active',
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		last_seen_at TIMESTAMPTZ
	);

	CREATE TABLE IF NOT EXISTS weather_readings (
		recorded_at TIMESTAMPTZ NOT NULL,
		id UUID NOT NULL DEFAULT gen_random_uuid(),
		device_id VARCHAR(50) NOT NULL REFERENCES devices(id),
		temperature_c DOUBLE PRECISION NOT NULL,
		relative_humidity_pct DOUBLE PRECISION NOT NULL,
		pressure_hpa DOUBLE PRECISION NOT NULL,
		light_level INTEGER NOT NULL,
		PRIMARY KEY (recorded_at, id)
	);

	DO $$
	BEGIN
		IF NOT EXISTS (SELECT 1 FROM timescaledb_information.hypertables WHERE hypertable_name = 'weather_readings') THEN
			PERFORM create_hypertable('weather_readings', 'recorded_at', if_not_exists => TRUE);
		END IF;
	END $$;
	`
	_, err = pool.Exec(context.Background(), schema)
	if err != nil {
		log.Fatalf("Failed to migrate database schemas: %v", err)
	}
	log.Println("Database schemas and hypertable migrated successfully")

	Pool = pool
	DBQueries = New(pool)
}
