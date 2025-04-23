import { EventType } from "../types/event-type.enum";

export interface EventBridgeNormalized {
  type: EventType.EventBridge;
  source: string;
  detailType: string;
  detail: any;
  raw: any;
}

export function handleEventBridge(event: any): EventBridgeNormalized {
  return {
    type: EventType.EventBridge,
    source: event.source,
    detailType: event['detail-type'],
    detail: event.detail,
    raw: event,
  };
}
