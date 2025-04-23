import { handleEventBridge } from './events/eventbridge';
import { handleApiGateway } from './events/apigateway';
import { handleLambda } from './events/lambda';
import { handleSqs } from './events/sqs';
import { EventType } from './types/event-type.enum';

export type NormalizedEvent = ReturnType<typeof handleEventBridge> | ReturnType<typeof handleApiGateway> | ReturnType<typeof handleLambda>;

export function detectEventType(event: any): EventType {
  if (event.source == 'EVENT_BRIDGE') return EventType.EventBridge;
  if (event.requestContext && event.httpMethod) return EventType.ApiGateway;
  if (event.Records && Array.isArray(event.Records) && event.Records[0]?.eventSource === 'aws:sqs') return EventType.Sqs;
  if (event.awsRequestId) return EventType.Lambda;
  return EventType.Unknown;
}

type ApiGatewayRoutes = Record<string, Record<string, Function>>; // { [method]: { [path]: handler } }
type EventBridgeRoutes = Record<string, Function>; // { [detailType]: handler }
type LambdaRoutes = Record<string, Function>; // { [name]: handler }
type SqsRoutes = Record<string, Function>; // { [name]: handler }

type DispatchRoutes = {
  apigateway?: ApiGatewayRoutes,
  eventbridge?: EventBridgeRoutes,
  lambda?: LambdaRoutes,
  sqs?: SqsRoutes,
};

export async function dispatchEvent(event: any, routes: DispatchRoutes): Promise<any> {
  const type = detectEventType(event);
  let normalized;
  let handlerFn;
  switch(type) {
    case EventType.EventBridge: {
      normalized = handleEventBridge(event);
      const detailType = normalized.detailType;
      handlerFn = routes.eventbridge?.[detailType] || routes.eventbridge?.default;
      break;
    }
    case EventType.ApiGateway: {
      normalized = handleApiGateway(event);
      const method = normalized.method?.toLowerCase();
      const path = normalized.path;
      handlerFn = routes.apigateway?.[method]?.[path] || routes.apigateway?.default?.[path] || routes.apigateway?.[method]?.default || routes.apigateway?.default?.default;
      break;
    }
    case EventType.Lambda: {
      normalized = handleLambda(event);
      handlerFn = routes.lambda?.default;
      break;
    }
    case EventType.Sqs: {
      normalized = handleSqs(event);
      handlerFn = routes.sqs?.default;
      break;
    }
    default:
      throw ({code:"AWS_EVENT_NOT_SUPPORTED", data: "AWS Event not supported."});
  }
  if (!handlerFn) {
    throw ({code:"HANDLER_NOT_FOUND", data: "No handler found for this event."});
  }
  return handlerFn(normalized);

}
