# LinkLite k6 Load & Stress Testing Suite

This directory contains standalone [k6](https://k6.io/) performance and stress testing scripts for the LinkLite URL redirection endpoint (`GET /r/:shortCode`).

---

## Architecture & Implementation Notes

- **Target Route**: `GET /r/:shortCode` (mounted under `/r` in Express application).
- **Controller & Service**: Handled by `redirectUrlController` (`apps/api/src/controllers/url.controller.ts`) which resolves the short code via Prisma (`prisma.url.findUnique`) and issues `res.redirect(originalUrl)`.
- **Expected HTTP Status**: `302 Found` (the default HTTP redirect status used by Express `res.redirect`).
- **Location Header**: The controller returns a standard HTTP `Location` response header containing the target destination URL.
- **Redirect Following Disabled**: The k6 tests configure `redirects: 0` on every request. This ensures tests measure LinkLite server and database latency directly rather than external destination sites.
- **Caching Note**: As no Redis cache is currently implemented, each redirect executes a database query against PostgreSQL. Pacing (`SLEEP_DURATION=0.05s`) is included to prevent connection pool starvation during local testing.

---

## 1. Installing and Verifying k6 on Windows

### Installation Options

You can install k6 using any of the following methods on Windows:

#### Option A: Windows Package Manager (`winget`)
```powershell
winget install Grafana.k6
```

#### Option B: Chocolatey
```powershell
choco install k6
```

#### Option C: Scoop
```powershell
scoop install k6
```

#### Option D: Manual Binary Download
1. Download the latest Windows release (`k6-v*-windows-amd64.zip`) from the [k6 GitHub Releases page](https://github.com/grafana/k6/releases).
2. Extract `k6.exe` into a directory on your machine (e.g., `C:\Program Files\k6\` or `C:\Users\<User>\bin\`).
3. Add that directory to your Windows user `PATH` environment variable.

### Verification

Open a new terminal (PowerShell, Command Prompt, or Git Bash) and run:

```bash
k6.exe version
```

You should see output similar to:
```text
k6.exe v2.2.0 (commit/..., windows/amd64)
```

---

## 2. Setting Environment Variables (Git Bash)

The scripts read test targets from environment variables with safe defaults. In Git Bash, set the required variables using `export`:

```bash
export BASE_URL="http://localhost:4000"
export SHORT_CODE="9wuSux"
export REDIRECT_PATH="/r/{shortCode}"
```

*(Optional)* Configure pacing sleep (defaults to `0.05` seconds / 50ms):
```bash
export SLEEP_DURATION="0.05"
```

> **Note for PowerShell Users:**
> You can set environment variables in PowerShell with:
> ```powershell
> $env:BASE_URL = "http://localhost:4000"
> $env:SHORT_CODE = "9wuSux"
> $env:REDIRECT_PATH = "/r/{shortCode}"
> ```
> Or pass them directly using k6 `-e` flags (e.g., `k6 run -e SHORT_CODE=9wuSux tests/load/redirect.js`).

---

## 3. Running the Smoke / Baseline Test Locally

`redirect.js` serves as a baseline smoke test to verify endpoint functionality, latency, and threshold compliance.

### Default Run (1 VU for 10 seconds)

```bash
k6.exe run --vus 1 --duration 10s tests/load/redirect.js
```

### Overriding Options via CLI

k6 command-line flags override the default `vus` and `duration` options defined inside the script:

```bash
# 5 virtual users for 30 seconds
k6.exe run --vus 5 --duration 30s tests/load/redirect.js
```

---

## 4. Streaming Results to Grafana Cloud (Local Execution)

Both scripts are configured for seamless Grafana Cloud integration.

### Step 1: Authenticate with Grafana Cloud

Login with your Grafana Cloud token via the k6 CLI:

```bash
k6.exe cloud login
```
*(Follow the interactive prompt to paste your Grafana Cloud API token or URL).*

### Step 2: Run with Local Execution

Execute the test locally while streaming real-time metrics and visualization to Grafana Cloud:

```bash
k6.exe cloud run --local-execution tests/load/redirect.js
```

Alternatively, you can use the standard `-o cloud` output flag:

```bash
k6.exe run -o cloud tests/load/redirect.js
```

You will receive a live URL in your terminal linking directly to your test dashboard in Grafana Cloud.

---

## 5. Running the Progressive Stress Test

`redirect-stress.js` performs progressive staged ramping up to a capped maximum of 50 virtual users to identify throughput bottlenecks and latency degradation under load.

### Staged Ramp-up Schedule

| Stage | Duration | Target Virtual Users (VUs) | Description |
|---|---|---|---|
| 1 | 30 seconds | 5 VUs | Initial warmup ramp |
| 2 | 1 minute | 10 VUs | Low-to-moderate concurrency |
| 3 | 1 minute | 25 VUs | Medium concurrency |
| 4 | 1 minute | 50 VUs | Peak stress load (capped at 50 VUs) |
| 5 | 30 seconds | 0 VUs | Graceful cooldown ramp-down |

### Run Locally

```bash
k6.exe run tests/load/redirect-stress.js
```

### Stream Stress Test to Grafana Cloud

```bash
k6.exe cloud run --local-execution tests/load/redirect-stress.js
```

---

## 6. Interpreting k6 Test Metrics

When a test finishes, k6 prints a summary table and evaluates thresholds:

### Key Metrics Reference

| Metric | Threshold | What It Measures & How to Interpret It |
|---|---|---|
| **`http_req_duration p(95)`** | `< 300 ms` | **95th Percentile Response Time**: 95% of redirect requests finished faster than this value. Represents the typical user experience under load. |
| **`http_req_duration p(99)`** | `< 1000 ms` | **99th Percentile (Tail) Latency**: Catches extreme outliers, slow database queries, or connection pool contention during peak concurrency. |
| **`http_reqs`** | N/A | **Request Throughput**: The total number of HTTP requests and average requests per second (`req/s`) handled by LinkLite. |
| **`http_req_failed`** | `< 1.00%` | **HTTP Failure Rate**: Percentage of HTTP requests that returned error status codes (4xx/5xx). Must remain below 1%. |
| **`checks`** | `> 99.00%` | **Validation Success Rate**: Measures validation checks (`status is 302 redirect` and non-empty `Location` header). Any unexpected status or missing redirect destination fails this check. |
| **`failed_validation_rate`** | N/A | **Custom Metric**: Dedicated rate tracker for check failures to easily chart in Grafana Cloud. |

### Sample Output Breakdown

```text
  █ THRESHOLDS 

    checks
    ✓ 'rate>0.99' rate=100.00%

    http_req_duration
    ✓ 'p(95)<300' p(95)=3.31ms
    ✓ 'p(99)<1000' p(99)=4.10ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%

  █ TOTAL RESULTS 

    checks_total.......: 378     37.75/s
    checks_succeeded...: 100.00% 378 out of 378
    checks_failed......: 0.00%   0 out of 378

    ✓ status is 302 redirect
    ✓ location header is present

    HTTP
    http_req_duration..............: avg=2.37ms med=2.29ms p(90)=3.14ms p(95)=3.31ms 
    http_req_failed................: 0.00%
    http_reqs......................: 189   18.88/s
```

- **Green checkmarks (`✓`)** signify all performance requirements and SLAs were satisfied.
- **Red crosses (`✗`)** indicate a threshold failure (e.g., p95 exceeded 300 ms or check success fell below 99%), signaling server saturation, database connection pool exhaustion, or downstream latency issues.
