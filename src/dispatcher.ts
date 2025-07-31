import { RequestService, ResponseService } from 'serverless-request-manager';
import { EventType } from './types/event-type.enum';
import { DispatchRoutes } from './types/dispatchRoutes';

export function detectEventType(event: any): EventType {
  if (event.source == 'EVENT_BRIDGE') return EventType.EventBridge;
  if (event.requestContext && event.httpMethod) return EventType.ApiGateway;
  if (event.Records && Array.isArray(event.Records) && event.Records[0]?.eventSource === 'aws:sqs') return EventType.Sqs;
  if (event.awsRequestId) return EventType.Lambda;
  return EventType.Unknown;
}

const responseService = new ResponseService()

export async function dispatchEvent(event: any, routes: DispatchRoutes): Promise<any> {

  console.log("Event Received: ", {event});

  const type = detectEventType(event);
  console.log("Event Type: ", {type});
  const normalized = new RequestService().setEvent(event, type) 
  console.log("Event Normalized: ", {normalized});
  let handlerFn;

  switch(type) {
    case EventType.EventBridge: {
      const operationName = normalized.eventRaw.detail?.operationName;
      handlerFn = operationName
        ? routes.eventbridge?.[operationName] || routes.eventbridge?.default
        : routes.eventbridge?.default;
      break;
    }
    case EventType.ApiGateway: {
      const method = normalized.eventRaw.httpMethod?.toLowerCase();
      const path = normalized.eventRaw.path;
      console.log("Event Method: ", {method});
      console.log("Event Path: ", {path});
      handlerFn = routes.apigateway?.[method]?.[path] || routes.apigateway?.default?.[path] || routes.apigateway?.[method]?.default || routes.apigateway?.default?.default;
      break;
    }
    case EventType.Lambda: {
      handlerFn = routes.lambda?.default;
      break;
    }
    case EventType.Sqs: {
      normalized.payload = JSON.parse(normalized.eventRaw.Records[0].body);
      const queueName = normalized.eventRaw.Records[0].eventSourceARN.split(':').pop();
      handlerFn = routes.sqs?.[queueName] || routes.sqs?.default;
      break;
    }
    default:
      console.log(`Event type not supported: ${type}`);
      return responseService.responseBadRequest();
  }
  if (!handlerFn) {
    console.log(`Handler not found for event: ${normalized.eventRaw.path}`);
    return responseService.responseForbidden();
  }
  return await handlerFn(normalized);

}
