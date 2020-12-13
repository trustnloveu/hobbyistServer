const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

// logging on file (.log)
const logger = winston.createLogger({
  // default
  level: "info",
  // format
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.align(),
    winston.format.prettyPrint()
  ),
  // meta data
  defaultMeta: { service: "Hobbyist Server" },
  transports: [
    new winston.transports.File({
      filename: "combined.log",
    }),
    new winston.transports.File({
      filename: "logfile.log",
      level: "error",
    }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost/hobbyist",
      options: {
        useUnifiedTopology: true,
      },
    }),
    new winston.transports.File({
      filename: "uncaughtExecptions.log",
      handleExceptions: true,
    }),
  ],
});

// Not in production state > On console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// add transports to winston
winston.add(logger);

// Catch errors from outside Express
process.on("uncaughtException", (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});
