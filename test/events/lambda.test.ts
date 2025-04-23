import { handleLambda } from "../../src/events/lambda";

test('normaliza evento Lambda', () => {
  const event = { awsRequestId: '123', foo: 'bar' };
  const result = handleLambda(event);
  expect(result).toEqual({
    type: 'lambda',
    payload: event,
    raw: event,
  });
});
