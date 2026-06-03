const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJsYWxhdGVuZHUyMDA0Ymlzd2FsQGdtYWlsLmNvbSIsImV4cCI6MTc4MDQ4MDcxMywiaWF0IjoxNzgwNDc5ODEzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZWYwZGVjZTMtYjc4Ny00YzIxLWI2OGMtNDM5MmU1YWVlYTAxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibGFsYXRlbmR1IGJpc3dhbCIsInN1YiI6ImMxNGMyMzQyLTcwNzktNGUzZi04YmViLWE5MjBmNmU3ZDY4MCJ9LCJlbWFpbCI6ImxhbGF0ZW5kdTIwMDRiaXN3YWxAZ21haWwuY29tIiwibmFtZSI6ImxhbGF0ZW5kdSBiaXN3YWwiLCJyb2xsTm8iOiIyMzM4NzQxIiwiYWNjZXNzQ29kZSI6Im53d3NLeCIsImNsaWVudElEIjoiYzE0YzIzNDItNzA3OS00ZTNmLThiZWItYTkyMGY2ZTdkNjgwIiwiY2xpZW50U2VjcmV0IjoiamJTaHR4QWVOTkRwc3RYVyJ9._8p1nCizdBabEF7B1JL5wi5-aCIFxvE897T8SD1hQbQ";

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${BEARER_TOKEN}`,
};

interface Depot {
  ID: number;
  MechanicHours: number;
}

interface Vehicle {
  TaskID: string;
  Duration: number;
  Impact: number;
}

async function Log(stack: string, level: string, pkg: string, message: string) {
  const res = await fetch("http://4.224.186.213/evaluation-service/logs", {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ stack, level, package: pkg, message }),
  });
  const data = await res.json();
  console.log("Log sent:", data);
}

async function getDepots(): Promise<Depot[]> {
  await Log("backend", "info", "service", "Fetching depots from API");
  const res = await fetch("http://4.224.186.213/evaluation-service/depots", {
    headers: HEADERS,
  });
  const data = await res.json();
  await Log("backend", "info", "service", "Depots fetched successfully");
  return data.depots;
}

async function getVehicles(): Promise<Vehicle[]> {
  await Log("backend", "info", "service", "Fetching vehicles from API");
  const res = await fetch("http://4.224.186.213/evaluation-service/vehicles", {
    headers: HEADERS,
  });
  const data = await res.json();
  await Log("backend", "info", "service", "Vehicles fetched successfully");
  return data.vehicles;
}

function knapsack(vehicles: Vehicle[], budget: number): {
  selected: Vehicle[];
  totalImpact: number;
  totalDuration: number;
} {
  const n = vehicles.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(budget + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const vehicle = vehicles[i - 1];
    for (let w = 0; w <= budget; w++) {
      dp[i][w] = dp[i - 1][w];
      if (vehicle.Duration <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i - 1][w - vehicle.Duration] + vehicle.Impact
        );
      }
    }
  }

  const selected: Vehicle[] = [];
  let w = budget;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(vehicles[i - 1]);
      w -= vehicles[i - 1].Duration;
    }
  }

  return {
    selected,
    totalImpact: dp[n][budget],
    totalDuration: selected.reduce((sum, v) => sum + v.Duration, 0),
  };
}

async function main() {
  try {
    await Log("backend", "info", "service", "Scheduler started");

    const depots = await getDepots();
    const vehicles = await getVehicles();

    await Log("backend", "info", "service", "Processing depots and vehicles");

    for (const depot of depots) {
      await Log("backend", "info", "service", `Knapsack: Depot ${depot.ID}`);

      const result = knapsack(vehicles, depot.MechanicHours);

      console.log(`\n========== Depot ${depot.ID} ==========`);
      console.log(`Budget: ${depot.MechanicHours} mechanic-hours`);
      console.log(`Selected ${result.selected.length} vehicles`);
      console.log(`Total Duration Used: ${result.totalDuration} hours`);
      console.log(`Total Impact Score: ${result.totalImpact}`);
      console.log("Selected Vehicles:");
      result.selected.forEach((v) => {
        console.log(`  - TaskID: ${v.TaskID} | Duration: ${v.Duration}h | Impact: ${v.Impact}`);
      });

      await Log("backend", "info", "service", `Depot ${depot.ID} impact: ${result.totalImpact}`);
    }

    await Log("backend", "info", "service", "Scheduler completed");

  } catch (error: any) {
    await Log("backend", "fatal", "service", "Scheduler failed");
    console.error("Error:", error);
  }
}

main();