// { [method]: { [path]: handler } } for API Gateway
export type ApiGatewayRoutes = Record<string, Record<string, Function>>;

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

