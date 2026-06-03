const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJsYWxhdGVuZHUyMDA0Ymlzd2FsQGdtYWlsLmNvbSIsImV4cCI6MTc4MDQ4MDcxMywiaWF0IjoxNzgwNDc5ODEzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZWYwZGVjZTMtYjc4Ny00YzIxLWI2OGMtNDM5MmU1YWVlYTAxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibGFsYXRlbmR1IGJpc3dhbCIsInN1YiI6ImMxNGMyMzQyLTcwNzktNGUzZi04YmViLWE5MjBmNmU3ZDY4MCJ9LCJlbWFpbCI6ImxhbGF0ZW5kdTIwMDRiaXN3YWxAZ21haWwuY29tIiwibmFtZSI6ImxhbGF0ZW5kdSBiaXN3YWwiLCJyb2xsTm8iOiIyMzM4NzQxIiwiYWNjZXNzQ29kZSI6Im53d3NLeCIsImNsaWVudElEIjoiYzE0YzIzNDItNzA3OS00ZTNmLThiZWItYTkyMGY2ZTdkNjgwIiwiY2xpZW50U2VjcmV0IjoiamJTaHR4QWVOTkRwc3RYVyJ9._8p1nCizdBabEF7B1JL5wi5-aCIFxvE897T8SD1hQbQ";
type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
  | "cache" | "controller" | "cron_job" | "db" | "domain"
  | "handler" | "repository" | "route" | "service"
  | "api" | "component" | "hook" | "page" | "state" | "style"
  | "auth" | "config" | "middleware" | "utils";

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  try {
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          stack,
          level,
          package: pkg,
          message,
        }),
      }
    );
    const data = await response.json();
    console.log("Log sent:", data);
  } catch (error) {
    console.error("Logging failed:", error);
  }
}
