/**
 * A list of all possible errors
 */
export const CLIENT_ERROR = {
  BAD_LOGIN: 'auth/bad-login',
  PERMISSION_DENIED: 'auth/permission-denied',
  GEKKO_OFFLINE: 'auth/gekko-offline',
  RESOURCE_NOT_FOUND: 'request/bad-request',
  BAD_REQUEST: 'request/bad-request',
  TO_MANY_REQUEST: 'request/tom-many-request',
  NOT_EXECUTED: 'request/not-executed',
  INTERNAL_SERVER_ERROR: 'request/internal-server-error',
  SERVICE_NOT_AVAILABLE: 'request/service-not-available',
  SYSTEM_NOT_INITIALIZED: 'client/client-not-initialized',
  ALREADY_INITIALIZED: 'client/client-already-initialized',
  SYSTEM_NOT_SUPPORTED: 'client/system-not-supported',
  TREND_NOT_SUPPORTED: 'client/trend-not-supported',
  CANNOT_PARSE_STATUS: 'client/cannot-parse-status',
  ITEM_ID_NOT_FOUND: 'client/item-id-not-found',
  UNKNOWN_ERROR: 'client/unknown-error',
};
