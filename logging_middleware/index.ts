const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJsYWxhdGVuZHUyMDA0Ymlzd2FsQGdtYWlsLmNvbSIsImV4cCI6MTc4MDQ3NjgwMSwiaWF0IjoxNzgwNDc1OTAxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNWNjNmRkNGQtZDVhYS00MDAwLTgxMTQtZjA2ODNiMTRiZWUwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibGFsYXRlbmR1IGJpc3dhbCIsInN1YiI6ImMxNGMyMzQyLTcwNzktNGUzZi04YmViLWE5MjBmNmU3ZDY4MCJ9LCJlbWFpbCI6ImxhbGF0ZW5kdTIwMDRiaXN3YWxAZ21haWwuY29tIiwibmFtZSI6ImxhbGF0ZW5kdSBiaXN3YWwiLCJyb2xsTm8iOiIyMzM4NzQxIiwiYWNjZXNzQ29kZSI6Im53d3NLeCIsImNsaWVudElEIjoiYzE0YzIzNDItNzA3OS00ZTNmLThiZWItYTkyMGY2ZTdkNjgwIiwiY2xpZW50U2VjcmV0IjoiamJTaHR4QWVOTkRwc3RYVyJ9.5lqS3IkiEsy1qhuLcD9cH1C_xcz2JZlpy1a_QzS6p7M"; // your full token from image 5

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
