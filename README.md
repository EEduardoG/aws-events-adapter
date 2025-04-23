# aws-events-adapter

**aws-events-adapter** is an npm package written in TypeScript that allows you to handle and dispatch multiple types of AWS events to your Lambda functions, with a unified routing pattern.

## Features

- 🔄 Supports multiple AWS event types (EventBridge, ApiGateway, Lambda, SQS, etc).
- 🛠️ Automatic routing to the correct handler based on event type and details.
- 📦 TypeScript-first for safety and maintainability.
- 🚀 Easy integration in serverless projects.

## Installation

```bash
npm install aws-events-adapter
```

or

```bash
yarn add aws-events-adapter
```

## Usage

You define a routing object (`DispatchRoutes`) that maps each AWS event type to its handler(s):

### API Gateway Routing
Route by HTTP method and path:
```typescript
import { DispatchRoutes } from 'aws-events-adapter';

const apigateway = {
  get: {
    '/user': async (event) => ({ statusCode: 200, body: 'User GET!' }),
  },
  post: {
    '/user': async (event) => ({ statusCode: 201, body: 'User created!' }),
  },
};
```

### EventBridge Routing
Route by `operationName` inside `event.detail.operationName`:
```typescript
const eventbridge = {
  hello: async (event) => ({ statusCode: 200, body: 'Hello from EventBridge!' }),
  bye: async (event) => ({ statusCode: 200, body: 'Goodbye from EventBridge!' }),
  default: async (event) => ({ statusCode: 400, body: 'Operation not supported' })
};
```

### Lambda and SQS Routing
Route by handler name:
```typescript
const lambda = {
  default: async (event) => ({ statusCode: 200, body: 'Lambda default handler' }),
};
const sqs = {
  default: async (event) => ({ statusCode: 200, body: 'SQS default handler' }),
};
```

### Integrating with your Lambda
```typescript
import { dispatchEvent } from 'aws-events-adapter';
import { apigateway, eventbridge, lambda, sqs } from './routes';

const routes = { apigateway, eventbridge, lambda, sqs };

export const handler = async (event, context) => {
  return dispatchEvent(event, routes);
};
```

### Example EventBridge Event
```json
{
  "source": "EVENT_BRIDGE",
  "detail": {
    "operationName": "hello",
    "data": { "foo": "bar" }
  }
}
```

## Types
See [`src/types/dispatchRoutes.ts`](src/types/dispatchRoutes.ts) for all route type definitions.

## Contributing
Contributions are welcome! Please open an issue or pull request for suggestions, improvements, or bug fixes.

## License
MIT