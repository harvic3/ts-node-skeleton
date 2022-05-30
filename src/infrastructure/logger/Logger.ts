import { ErrorLog } from "../../application/shared/log/ErrorLog";
import { EventLog } from "../../application/shared/log/EventLog";
import { ILogger } from "../../adapters/providers/log/ILogger";

export class Logger implements ILogger {
  info(event: EventLog): void {
    console.log(`Event ${new Date().toISOString()}:`, event);
  }

  error(error: ErrorLog): void {
    console.error(`Error ${new Date().toISOString()}:`, error);
  }
}
