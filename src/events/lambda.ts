import { EventType } from "../types/event-type.enum";

export interface LambdaNormalized {
  type: EventType.Lambda;
  payload: any;
  raw: any;
}

export function handleLambda(event: any): LambdaNormalized {
  return {
    type: EventType.Lambda,
    payload: event,
    raw: event,
  };
}
