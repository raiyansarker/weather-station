-- name: GetDeviceByID :one
SELECT * FROM devices WHERE id = $1 LIMIT 1;

-- name: UpdateDeviceLastSeen :exec
UPDATE devices SET last_seen_at = NOW() WHERE id = $1;

-- name: InsertWeatherReading :one
INSERT INTO weather_readings (
    recorded_at, device_id, temperature_c, relative_humidity_pct, pressure_hpa, light_level
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: GetLiveWeather :one
SELECT * FROM weather_readings 
ORDER BY recorded_at DESC 
LIMIT 1;

-- name: GetWeatherHistory :many
SELECT * FROM weather_readings 
WHERE recorded_at >= $1 AND recorded_at < $2 
ORDER BY recorded_at ASC;
