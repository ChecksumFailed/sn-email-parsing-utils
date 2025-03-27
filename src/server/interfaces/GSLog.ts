
export interface GSLog {
    constructor(traceProperty: string, caller: string);
    setLevel(level: string): void;
    getLevel(): string;
    debugOn(): boolean;
    atLevel(minLogLevel: string): boolean;
    setLog4J(): GSLog;
    disableDatabaseLogs(): GSLog;
    includeTimestamp(): void;

    logDebug(message: string): void;
    logInfo(message: string): void;
    logNotice(message: string): void;
    logWarning(message: string): void;
    logErr(message: string): void;
    logError(message: string): void;
    logCrit(message: string): void;
    logAlert(message: string): void;
    logEmerg(message: string): void;

    trace(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;

    log(level: string, message: string): void;
}
