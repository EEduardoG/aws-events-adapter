import { EventType } from "../types/event-type.enum";

export interface ApiGatewayNormalized {
  type: EventType.ApiGateway;
  method: string;
  path: string;
  headers: Record<string, string>;
  body: any;
  raw: any;
}

export function handleApiGateway(event: any): ApiGatewayNormalized {
  return {
    type: EventType.ApiGateway,
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    body: event.body,
    raw: event,
  };
}
