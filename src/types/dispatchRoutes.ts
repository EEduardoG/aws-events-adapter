// { [method]: { [path]: handler } } for API Gateway
export type ApiGatewayRoutes = HttpRouter;

// { [operationName]: handler } for EventBridge, where operationName is the field inside event.detail.operationName
export type EventBridgeRoutes = Record<string, Function>;

// { [name]: handler } for Lambda and SQS
export type LambdaRoutes = Record<string, Function>;
export type SqsRoutes = Record<string, Function>;

export type DispatchRoutes = {
  apigateway?: ApiGatewayRoutes,
  eventbridge?: EventBridgeRoutes,
  lambda?: LambdaRoutes,
  sqs?: SqsRoutes,
};

// HTTP methods supported
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';

// Types for defining route configuration
export type RouteConfig = {
  handler: Function;
  auth?: {
    type: 'none' | 'jwt' | 'apikey' | 'cognito' | 'lambda';
    authorizer?: string; // Authorizer name
    
    // Scopes validated dynamically against the database
    scopes?: string[]; // ['read:users', 'write:reports', 'admin:system']
    
    // Cache configuration to optimize queries
    cachePermissions?: boolean; // Default: true
    cacheTTL?: number; // Seconds, default: 300 (5 min)
  };
  cors?: boolean | {
    origins: string[] | '*'; // Allow all origins
    methods?: string[]; // ['GET', 'POST', 'PUT', 'DELETE']
    headers?: string[]; // Allowed headers
    credentials?: boolean; // Allow cookies/auth headers
    maxAge?: number; // Preflight cache in seconds
    exposedHeaders?: string[]; // Headers exposed to client
  };
  rateLimit?: {
    burstLimit: number;
    rateLimit: number;
  };
};

// Type for the complete HTTP router structure
export type HttpRouter = {
  [K in HttpMethod]?: {
    [path: string]: RouteConfig;
  };
};