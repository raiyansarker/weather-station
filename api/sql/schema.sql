CREATE TABLE devices (
    id VARCHAR(50) PRIMARY KEY,
    name TEXT NOT NULL,
    credential_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ
);

CREATE TABLE weather_readings (
    recorded_at TIMESTAMPTZ NOT NULL,
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) NOT NULL REFERENCES devices(id),
    temperature_c DOUBLE PRECISION NOT NULL,
    relative_humidity_pct DOUBLE PRECISION NOT NULL,
    pressure_hpa DOUBLE PRECISION NOT NULL,
    light_level INTEGER NOT NULL,
    PRIMARY KEY (recorded_at, id)
);
