import { handleEventBridge } from "../../src/events/eventbridge";

test('normaliza evento EventBridge', () => {
  const event = { 'detail-type': 'Test', source: 'aws.test', detail: { foo: 'bar' } };
  const result = handleEventBridge(event);
  expect(result).toEqual({
    type: 'eventbridge',
    source: 'aws.test',
    detailType: 'Test',
    detail: { foo: 'bar' },
    raw: event,
  });
});
