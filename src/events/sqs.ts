import { EventType } from "../types/event-type.enum";

export function handleSqs(event: any): any {
  return {
    type: EventType.Sqs,
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    body: event.body,
    raw: event,
  };
}