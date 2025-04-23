import { dispatchEvent, detectEventType } from '../src/dispatcher';

describe('dispatcher', () => {
  it('detecta eventos EventBridge', () => {
    const event = { 'detail-type': 'Test', source: 'aws.test', detail: {} };
    expect(detectEventType(event)).toBe('eventbridge');
  });
  it('detecta eventos ApiGateway', () => {
    const event = { requestContext: {}, httpMethod: 'GET', path: '/test' };
    expect(detectEventType(event)).toBe('apigateway');
  });
  it('detecta eventos Lambda', () => {
    const event = { awsRequestId: '1234' };
    expect(detectEventType(event)).toBe('lambda');
  });
  it('lanza error en eventos desconocidos', async () => {
    await expect(dispatchEvent({}, () => {})).rejects.toThrow('Tipo de evento AWS no soportado');
  });
});
