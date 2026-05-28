import "dotenv/config";
import { Client, GatewayIntentBits, AuditLogEvent } from "discord.js";
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const exporter = new OTLPLogExporter({
  url: process.env.OTLP_ENDPOINT ?? "http://localhost:4318/v1/logs",
});

const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.SERVICE_NAME ?? "discord",
  }),
  processors: [new SimpleLogRecordProcessor(exporter)],
});

const logger = loggerProvider.getLogger("discord");
const client = new Client({ intents: [GatewayIntentBits.GuildModeration] });

client.on("guildAuditLogEntryCreate", async (entry, guild) => {
  const executor = await client.users.fetch(entry.executorId).catch(() => null);

  const log = {
    severityText: "INFO",
    body: `AUDIT_LOG_ENTRY: ${AuditLogEvent[entry.action]}`,
    attributes: {
      "discord.guild.id": guild.id,
      "discord.guild.name": guild.name,
      "discord.audit.action": entry.action,
      "discord.audit.action_name": AuditLogEvent[entry.action],
      "discord.audit.target_id": entry.targetId ?? "",
      "discord.audit.executor_id": entry.executorId ?? "",
      "discord.audit.executor_username": executor?.username ?? "",
      "discord.audit.reason": entry.reason ?? "",
      "discord.audit.entry_id": entry.id,
    },
  };

  console.log(log);
  logger.emit(log);
});

client.login(process.env.DISCORD_TOKEN);

console.log("Started Discord OTel Bridge");
