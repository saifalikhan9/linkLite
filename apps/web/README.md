# LinkLite Frontend Authentication & State Management

This document explains the authentication and client-side state flow implemented in the LinkLite frontend.

## Stack

- Next.js
- TypeScript
- Axios
- Zustand
- JWT access tokens
- JWT refresh tokens
- HttpOnly cookies

---

## 1. Authentication Architecture

LinkLite uses two tokens.

### Access token

The access token is used to access protected API endpoints.

```text
Frontend
   |
   | Authorization: Bearer <accessToken>
   v
Express API
```

The access token is stored only in the Zustand store, so it exists in memory.

It is not stored in localStorage, sessionStorage, or a regular cookie.

### Refresh token

The refresh token is used to obtain a new access token.

It is stored:

1. In an HttpOnly cookie in the browser.
2. In the backend database.

JavaScript cannot directly read the HttpOnly cookie.

---

## 2. Why Two Tokens?

The access token is short-lived and is used frequently.

The refresh token is longer-lived and is used to create new access tokens.

```text
Access Token
    |
    └── Short-lived
        Used for protected API requests

Refresh Token
    |
    └── Long-lived
        Used to obtain new access tokens
```

If an access token expires, the user can receive a new one without logging in again, as long as the refresh token is valid.

---

## 3. Frontend Folder Responsibilities

```text
src/
├── components/
├── lib/
│   └── axios.ts
├── services/
│   └── auth.service.ts
├── store/
│   └── auth.store.ts
├── providers/
│   └── auth-provider.tsx
└── types/
```

### `lib/`

Infrastructure and configuration.

Example:

```text
lib/axios.ts
```

Contains Axios instances and interceptors.

### `services/`

Contains functions that communicate with the backend.

Example:

```text
services/auth.service.ts
```

The service layer does not contain UI logic.

### `store/`

Contains Zustand state.

Example:

```text
store/auth.store.ts
```

### `providers/`

Contains application-wide providers.

Example:

```text
providers/auth-provider.tsx
```

The AuthProvider restores the authentication session when the application starts.

### `types/`

Contains TypeScript request/response contracts.

---

## 4. Axios Setup

The frontend creates Axios instances with the backend base URL.

Example:

```ts
export const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
```

`withCredentials: true` is important because authentication uses an HttpOnly refresh-token cookie.

It allows the browser to send the cookie with requests when the backend CORS configuration permits credentials.

---

## 5. Public and Protected Requests

Public authentication requests include:

```text
POST /auth/register
POST /auth/login
POST /auth/refreshToken
POST /auth/logout
```

Protected requests include:

```text
GET /urls
POST /urls
PATCH /urls/:id
DELETE /urls/:id
```

Protected requests use:

```http
Authorization: Bearer <accessToken>
```

The authenticated Axios instance can use a request interceptor to add this header automatically.

---

## 6. Axios Request Interceptor

The request interceptor reads the current access token from Zustand:

```ts
const token = useAuthStore.getState().accessToken;
```

If a token exists:

```ts
config.headers.Authorization = `Bearer ${token}`;
```

Inside React components, Zustand is accessed with:

```ts
useAuthStore((state) => state.accessToken);
```

This subscribes the component to state changes.

Outside React, such as in Axios configuration, use:

```ts
useAuthStore.getState().accessToken;
```

This simply reads the current value.

---

## 7. Auth Service

The authentication service contains API calls.

Example:

```ts
export const signup = async (data: SignupPayload) => {
  const res = await publicApi.post<AuthResponse>(
    "/auth/register",
    data,
  );

  return res.data;
};
```

Login:

```ts
export const login = async (data: LoginPayload) => {
  const res = await publicApi.post<AuthResponse>(
    "/auth/login",
    data,
  );

  return res.data;
};
```

Refresh:

```ts
export const refreshAccessToken = async () => {
  const res = await publicApi.post("/auth/refreshToken");

  return res.data;
};
```

Logout:

```ts
export const logout = async () => {
  const res = await publicApi.post("/auth/logout");

  return res.data;
};
```

The service layer does not show toasts or perform redirects.

---

## 8. Authentication Types

The frontend defines the data it sends and expects.

Example:

```ts
export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  data: {
    id: string;
    email: string;
    accessToken: string;
  };
};
```

The refresh token is not expected in the JSON response because it is stored in the HttpOnly cookie.

---

## 9. Login Flow

```text
Login Form
    |
    | email + password
    v
login()
    |
    v
POST /auth/login
    |
    v
Express Backend
```

After successful credential verification, the backend:

```text
Creates access token
        |
Creates refresh token
        |
Stores refresh token
in database
        |
Sets refresh token
as HttpOnly cookie
        |
Returns access token
```

The frontend stores the returned access token in Zustand:

```ts
useAuthStore.getState().setAccessToken(
  data.data.accessToken
);
```

Then the user can be redirected to the dashboard.

---

## 10. Zustand Authentication Store

The store contains client-side authentication state.

Conceptually:

```ts
type AuthState = {
  accessToken: string | null;
  isInitializing: boolean;

  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setInitializing: (value: boolean) => void;
};
```

Initial state:

```text
accessToken = null
isInitializing = true
```

After successful login:

```text
accessToken = <JWT>
```

After logout:

```text
accessToken = null
```

The access token is intentionally not persisted to localStorage.

---

## 11. Why Zustand Is Used

Zustand allows different components to react to authentication changes.

For example, the Navbar subscribes to:

```ts
const accessToken = useAuthStore(
  (state) => state.accessToken
);
```

When the access token changes:

```text
Zustand state changes
        |
        v
Navbar is notified
        |
        v
Navbar re-renders
```

Authenticated UI:

```text
Dashboard | Logout
```

Unauthenticated UI:

```text
Login | Signup
```

---

## 12. Session Restoration After Browser Refresh

The access token is stored only in memory.

Before refresh:

```text
Zustand
accessToken = JWT

Cookie
refreshToken = JWT
```

After a full browser refresh:

```text
Zustand
accessToken = null

Cookie
refreshToken = JWT
```

The refresh token survives because it is stored in a cookie.

The AuthProvider restores the access token.

---

## 13. AuthProvider

The AuthProvider is a client component placed around the application in the root layout.

Conceptually:

```text
RootLayout
    |
    v
AuthProvider
    |
    └── children
         |
         ├── Landing
         ├── Login
         ├── Signup
         └── Dashboard
```

When the application starts, the AuthProvider calls:

```text
POST /auth/refreshToken
```

The browser automatically sends the HttpOnly refresh-token cookie.

If the refresh token is valid, the backend returns a new access token.

The provider stores it:

```ts
setAccessToken(data.data.accessToken);
```

---

## 14. Authentication Initialization

There is a difference between:

```text
Unauthenticated
```

and:

```text
Authentication has not been checked yet
```

Therefore the store has:

```ts
isInitializing
```

Initially:

```text
isInitializing = true
```

The application does not yet know whether the user is authenticated.

The refresh request runs.

If it succeeds:

```text
accessToken = new token
```

If it fails:

```text
accessToken = null
```

Then, regardless of the result:

```text
isInitializing = false
```

This prevents the UI from briefly showing Login/Signup while the session is being restored.

---

## 15. Authentication State Flow

```text
Browser Refresh
      |
      v
Zustand recreated
      |
      v
accessToken = null
      |
      v
AuthProvider starts
      |
      v
POST /auth/refreshToken
      |
      v
Browser sends HttpOnly refresh cookie
      |
      v
Backend verifies refresh token
      |
      +-------------------+
      |                   |
    Valid               Invalid
      |                   |
      v                   v
New access token       No session
      |                   |
      v                   |
Zustand updated           |
      |                   |
      +---------+---------+
                |
                v
     isInitializing = false
                |
                v
          Application
```

---

## 16. Navbar Authentication Flow

The Navbar subscribes to Zustand:

```ts
const accessToken = useAuthStore(
  (state) => state.accessToken
);
```

Then:

```ts
const isAuthenticated = !!accessToken;
```

The Navbar has three logical states:

```text
Initializing
    |
    └── Show loading/skeleton

Authenticated
    |
    └── Dashboard | Logout

Unauthenticated
    |
    └── Login | Signup
```

---

## 17. Logout Flow

Logout does not need the access token.

The important token for logout is the refresh-token session.

The frontend calls:

```text
POST /auth/logout
```

The browser sends the refresh-token cookie.

The backend:

```text
Find refresh token
       |
       v
Invalidate/remove refresh token
       |
       v
Clear refresh-token cookie
       |
       v
Return success
```

The frontend then:

```ts
clearAccessToken();
```

and redirects to the home page.

Complete flow:

```text
Click Logout
     |
     v
POST /auth/logout
     |
     v
Backend invalidates refresh token
     |
     v
Cookie cleared
     |
     v
clearAccessToken()
     |
     v
Zustand accessToken = null
     |
     v
Navbar re-renders
     |
     v
Login | Signup
```

If the logout request fails, the frontend can still clear the local access token so the browser no longer considers the user authenticated.

---

## 18. Error Handling

The service layer does not handle UI errors.

Example:

```ts
export const login = async (data: LoginPayload) => {
  const res = await publicApi.post("/auth/login", data);

  return res.data;
};
```

If Axios receives a 4xx/5xx response, the promise rejects.

The component catches the error:

```ts
try {
  const data = await login({
    email,
    password,
  });
} catch (error) {
  // Handle UI error
}
```

Axios's type guard can be used:

```ts
if (axios.isAxiosError<ApiErrorResponse>(error)) {
  const message =
    error.response?.data?.message ??
    "Something went wrong";

  toast.error(message);
}
```

Responsibilities are separated:

```text
Service
   |
   └── API communication

Component
   |
   └── User-facing errors

Axios interceptor
   |
   └── Global HTTP behavior
```

The service should not contain UI operations such as:

```text
toast.success()
toast.error()
router.push()
```

---

## 19. Why the Refresh Token Is Not Stored in Zustand

The refresh token is intentionally kept out of JavaScript-accessible state.

Instead:

```text
Refresh Token
      |
      v
HttpOnly Cookie
```

JavaScript cannot directly read the token.

The browser automatically sends it to the backend for the refresh endpoint.

The frontend therefore only needs to manage the access token.

---

## 20. Complete Architecture

```text
                         Browser
                            |
              +-------------+-------------+
              |                           |
              v                           v
       Zustand Store              HttpOnly Cookie
              |                           |
              |                           |
        Access Token               Refresh Token
              |                           |
              v                           v
       Axios Interceptor          Browser manages it
              |                           |
              +-------------+-------------+
                            |
                            v
                       Express API
                            |
                            v
                         Database
```

---

## 21. Responsibility Summary

| Part | Responsibility |
|---|---|
| Auth form | Collect user credentials |
| Auth service | Make authentication API requests |
| Axios | HTTP communication |
| Axios request interceptor | Attach access token to protected requests |
| Zustand | Store access token/client authentication state |
| AuthProvider | Restore session after application startup |
| HttpOnly cookie | Store refresh token |
| Express backend | Verify credentials/tokens |
| Database | Store refresh-token/session information |
| Navbar | Display UI based on authentication state |

---

## 22. Final Mental Model

### Access token

```text
Access Token
    |
    v
Short-lived
    |
    v
Zustand memory
    |
    v
Authorization: Bearer <token>
    |
    v
Protected API
```

### Refresh token

```text
Refresh Token
    |
    v
Long-lived
    |
    v
HttpOnly Cookie
    |
    v
Backend validation
    |
    v
New Access Token
```

### Complete session lifecycle

```text
Login
  |
  +--> Access Token -> Zustand
  |
  +--> Refresh Token -> HttpOnly Cookie + Database
  |
  v
Protected API requests -> Access Token
  |
  v
Access Token expires
  |
  v
Refresh Token -> New Access Token
  |
  v
Zustand updated
  |
  v
Continue using application
```

This architecture keeps the access token short-lived and the refresh token inaccessible to client-side JavaScript while still allowing the user to remain logged in across browser refreshes.
