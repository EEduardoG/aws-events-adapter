import { RequestService, ResponseService } from 'serverless-request-manager';
import { EventType } from './types/event-type.enum';

export function detectEventType(event: any): EventType {
  if (event.source == 'EVENT_BRIDGE') return EventType.EventBridge;
  if (event.requestContext && event.httpMethod) return EventType.ApiGateway;
  if (event.Records && Array.isArray(event.Records) && event.Records[0]?.eventSource === 'aws:sqs') return EventType.Sqs;
  if (event.awsRequestId) return EventType.Lambda;
  return EventType.Unknown;
}

type ApiGatewayRoutes = Record<string, Record<string, Function>>; // { [method]: { [path]: handler } }
type EventBridgeRoutes = Record<string, Record<string, Function>>; // { [method]: { [path]: handler } }
type LambdaRoutes = Record<string, Function>; // { [name]: handler }
type SqsRoutes = Record<string, Function>; // { [name]: handler }

type DispatchRoutes = {
  apigateway?: ApiGatewayRoutes,
  eventbridge?: EventBridgeRoutes,
  lambda?: LambdaRoutes,
  sqs?: SqsRoutes,
};

const responseService = new ResponseService()

export async function dispatchEvent(event: any, routes: DispatchRoutes): Promise<any> {

  const type = detectEventType(event);
  const normalized = new RequestService().setEvent(event, type) 
  let handlerFn;

  switch(type) {
    case EventType.EventBridge: {
      const method = normalized.eventRaw.method?.toLowerCase();
      const path = normalized.eventRaw.path;
      handlerFn = (method && path)
        ? routes.eventbridge?.[method]?.[path]
          || routes.eventbridge?.default?.[path]
          || routes.eventbridge?.[method]?.default
          || routes.eventbridge?.default?.default
        : undefined;
      break;
    }
    case EventType.ApiGateway: {
      const method = normalized.eventRaw.httpMethod?.toLowerCase();
      const path = normalized.eventRaw.path;
      handlerFn = routes.apigateway?.[method]?.[path] || routes.apigateway?.default?.[path] || routes.apigateway?.[method]?.default || routes.apigateway?.default?.default;
      break;
    }
    case EventType.Lambda: {
      handlerFn = routes.lambda?.default;
      break;
    }
    case EventType.Sqs: {
      handlerFn = routes.sqs?.default;
      break;
    }
    default:
      throw responseService.responseBadRequest({
        code:"AWS_EVENT_NOT_SUPPORTED",
        data:"AWS Event not supported."
      });
  }
  if (!handlerFn) {
    throw responseService.responseBadRequest({
      code:"HANDLER_NOT_FOUND",
      data:"No handler found for this event."
    });
  }
  return handlerFn(normalized);

}
