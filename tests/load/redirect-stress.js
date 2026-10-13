import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

/**
 * LinkLite Redirect Progressive Stress Test
 *
 * Endpoint: GET /r/:shortCode
 * Staged ramping profile:
 *  - 30 seconds ramp-up to 5 VUs
 *  - 1 minute ramp-up to 10 VUs
 *  - 1 minute ramp-up to 25 VUs
 *  - 1 minute ramp-up to 50 VUs (peak load)
 *  - 30 seconds ramp-down to 0 VUs
 *
 * Automatic redirects are disabled (redirects: 0) to measure LinkLite server performance
 * rather than third-party target URLs.
 */

// -----------------------------------------------------------------------------
// 1. Environment Configuration & Validation
// -----------------------------------------------------------------------------
const rawBaseUrl = __ENV.BASE_URL !== undefined ? __ENV.BASE_URL : 'http://localhost:4000';
const rawShortCode = __ENV.SHORT_CODE !== undefined ? __ENV.SHORT_CODE : '9wuSux';
const rawRedirectPath = __ENV.REDIRECT_PATH !== undefined ? __ENV.REDIRECT_PATH : '/r/{shortCode}';

const BASE_URL = rawBaseUrl.trim();
const SHORT_CODE = rawShortCode.trim();
const REDIRECT_PATH = rawRedirectPath.trim();
const SLEEP_DURATION = parseFloat(__ENV.SLEEP_DURATION !== undefined ? __ENV.SLEEP_DURATION : '0.05');

function validateConfiguration(baseUrl, shortCode, redirectPath) {
  const errors = [];

  if (!baseUrl) {
    errors.push('BASE_URL is required and cannot be empty.');
  } else if (!/^https?:\/\//i.test(baseUrl)) {
    errors.push(`BASE_URL must begin with http:// or https:// (received: "${baseUrl}").`);
  }

  if (!shortCode) {
    errors.push('SHORT_CODE is required and cannot be empty.');
  }

  if (!redirectPath) {
    errors.push('REDIRECT_PATH is required and cannot be empty.');
  } else if (!redirectPath.includes('{shortCode}')) {
    errors.push(`REDIRECT_PATH must contain the "{shortCode}" placeholder (received: "${redirectPath}").`);
  }

  if (errors.length > 0) {
    throw new Error(
      `[Configuration Error] Invalid k6 test parameters:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    );
  }
}

validateConfiguration(BASE_URL, SHORT_CODE, REDIRECT_PATH);

// Construct target URL safely
const cleanBaseUrl = BASE_URL.replace(/\/+$/, '');
const encodedShortCode = encodeURIComponent(SHORT_CODE);
const resolvedPath = REDIRECT_PATH.replace('{shortCode}', encodedShortCode);
const normalizedPath = resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`;
const TARGET_URL = `${cleanBaseUrl}${normalizedPath}`;

// -----------------------------------------------------------------------------
// 2. Custom Metrics
// -----------------------------------------------------------------------------
const failedChecksRate = new Rate('failed_validation_rate');
const failedChecksCount = new Counter('failed_validation_total');

// -----------------------------------------------------------------------------
// 3. Test Options & Progressive Stages
// -----------------------------------------------------------------------------
export const options = {
  stages: [
    { duration: '30s', target: 5 },  // Ramp up to 5 virtual users over 30s
    { duration: '1m', target: 10 },  // Ramp up to 10 virtual users over 1m
    { duration: '1m', target: 25 },  // Ramp up to 25 virtual users over 1m
    { duration: '1m', target: 50 },  // Ramp up to 50 virtual users over 1m (capped maximum)
    { duration: '30s', target: 0 },  // Ramp down gracefully to 0 virtual users over 30s
  ],
  thresholds: {
    // HTTP failure rate below 1%
    http_req_failed: ['rate<0.01'],
    // p95 response time below 300 ms, p99 below 1000 ms
    http_req_duration: ['p(95)<300', 'p(99)<1000'],
    // Check success rate above 99%
    checks: ['rate>0.99'],
  },
  cloud: {
    name: 'LinkLite - Redirect Progressive Stress Test',
    projectID: __ENV.K6_PROJECT_ID ? parseInt(__ENV.K6_PROJECT_ID, 10) : undefined,
  },
  ext: {
    loadimpact: {
      name: 'LinkLite - Redirect Progressive Stress Test',
      projectID: __ENV.K6_PROJECT_ID ? parseInt(__ENV.K6_PROJECT_ID, 10) : undefined,
    },
  },
};

// -----------------------------------------------------------------------------
// 4. Default VU Execution
// -----------------------------------------------------------------------------
export default function () {
  const params = {
    // Disable automatic redirects to test LinkLite's redirect response only
    redirects: 0,
    tags: {
      name: 'RedirectEndpoint',
      route: '/r/:shortCode',
    },
  };

  const response = http.get(TARGET_URL, params);

  // Inspect actual Express redirect behavior (res.redirect returns 302 Found)
  const isExpectedStatus = response.status === 302;
  const locationHeader = response.headers['Location'] || response.headers['location'];
  const hasValidLocation = Boolean(locationHeader && locationHeader.trim().length > 0);

  const checkPassed = check(response, {
    'status is 302 redirect': () => isExpectedStatus,
    'location header is present': () => hasValidLocation,
  });

  failedChecksRate.add(!checkPassed);
  if (!checkPassed) {
    failedChecksCount.add(1);
  }

  if (SLEEP_DURATION > 0) {
    sleep(SLEEP_DURATION);
  }
}
