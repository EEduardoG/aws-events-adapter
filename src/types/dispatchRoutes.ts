export type ApiGatewayRoutes = Record<string, Record<string, Function>>; // { [method]: { [path]: handler } }
export type EventBridgeRoutes = Record<string, Record<string, Function>>; // { [method]: { [path]: handler } }
export type LambdaRoutes = Record<string, Function>; // { [name]: handler }
export type SqsRoutes = Record<string, Function>; // { [name]: handler }


export type DispatchRoutes = {
  apigateway?: ApiGatewayRoutes,
  eventbridge?: EventBridgeRoutes,
  lambda?: LambdaRoutes,
  sqs?: SqsRoutes,
};
