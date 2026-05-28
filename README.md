# Discord OTel Bridge

Forwards Discord server audit log events to an [OpenTelemetry](https://opentelemetry.io/) collector via OTLP HTTP.

## Installation

1. Pull this repo locally.

```
git clone git@github.com:PineconeLP/discord-otel-bridge.git
```

2. Install packages.

```
npm install
```

## Configuration

Define a `.env` file in the project root.

```env
# Discord bot token.
DISCORD_TOKEN=your_discord_bot_token

# OTLP HTTP endpoint to send logs to.
OTLP_ENDPOINT=http://your-collector:4318/v1/logs

# Service name reported in OTel logs (optional, defaults to "discord").
SERVICE_NAME=discord
```

> Get a bot token from the [Discord Developer Portal](https://discord.com/developers/applications).
> 
> The bot requires the **View Audit Log** permission and must be added to your server.

## Usage

Start listener in terminal:

```bash
npm start
```

Alternatively, build and run with Docker Compose by adding this to your `compose.yml`:

```yaml
services:
  discord-bridge:
    build: ./discord-otel-bridge
    env_file: ./discord-otel-bridge/.env
```

## Contributing

Open an issue or pull request if you have any feature ideas or bug fixes!
