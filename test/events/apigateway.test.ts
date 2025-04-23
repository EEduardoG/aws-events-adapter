import { handleApiGateway } from "../../src/events/apigateway";

test('normaliza evento ApiGateway', () => {
  const event = { httpMethod: 'POST', path: '/foo', headers: { a: 1 }, body: 'bar' };
  const result = handleApiGateway(event);
  expect(result).toEqual({
    type: 'apigateway',
    method: 'POST',
    path: '/foo',
    headers: { a: 1 },
    body: 'bar',
    raw: event,
  });
});
