/**
 * A list of all possible errors.
 *  @group Client
 */
export enum CLIENT_ERROR_MESSAGES {
  /** Status code 403 */
  BAD_LOGIN = 'auth/bad-login',
  /** Status code 405 */
  PERMISSION_DENIED = 'auth/permission-denied',
  /** Status code 410 */
  GEKKO_OFFLINE = 'auth/gekko-offline',
  /** Status code 404 */
  RESOURCE_NOT_FOUND = 'request/resource-not-found',
  /** Status code 400 */
  BAD_REQUEST = 'request/bad-request',
  /** Status code 429 */
  TO_MANY_REQUEST = 'request/tom-many-request',
  /** Status code 444 */
  NOT_EXECUTED = 'request/not-executed',
  /** Status code 470 */
  SERVICE_NOT_REGISTERED_OR_EXPIRED = 'request/service-not-registered-or-expired',
  /** Status code 500 */
  INTERNAL_SERVER_ERROR = 'request/internal-server-error',
  /** Status code 503 */
  SERVICE_NOT_AVAILABLE = 'request/service-not-available',
  SYSTEM_NOT_INITIALIZED = 'client/client-not-initialized',
  ALREADY_INITIALIZED = 'client/client-already-initialized',
  SYSTEM_NOT_SUPPORTED = 'client/system-not-supported',
  TREND_NOT_SUPPORTED = 'client/trend-not-supported',
  CANNOT_PARSE_STATUS = 'client/cannot-parse-status',
  ITEM_ID_NOT_FOUND = 'client/item-id-not-found',
  UNKNOWN_ERROR = 'client/unknown-error',
}

/**
 * The client error class.
 *  @group Client
 */
export class ClientError extends Error {
  /**
   * The client error constructor.
   * @param message - The error message.
   */
  public constructor(message: CLIENT_ERROR_MESSAGES) {
    super(message);
  }
}
