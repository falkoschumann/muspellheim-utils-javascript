import { describe, expect, it } from '@jest/globals';

import { SseClient } from '../lib/sse-client.js';

describe('SSE client', () => {
  it('Connects to the server', async () => {
    const client = SseClient.createNull();

    await client.connect(() => {});

    expect(client.isConnected).toBe(true);
  });

  it('Rejects multiple connections', async () => {
    const client = SseClient.createNull();
    await client.connect(() => {});

    const connectTwice = client.connect(() => {});

    expect(connectTwice).rejects.toThrow();
  });

  it('Closes the connection', async () => {
    const client = SseClient.createNull();
    await client.connect(() => {});

    client.close();

    expect(client.isConnected).toBe(false);
  });

  it('Receives a message', async () => {
    const client = SseClient.createNull();
    const events = [];
    await client.connect((event) => events.push(event));

    client.simulateMessage({ anwser: 42 });

    expect(events).toEqual([
      expect.objectContaining({
        data: { anwser: 42 },
      }),
    ]);
  });

  it('Receives a typed message', async () => {
    const client = SseClient.createNull();
    const events = [];
    await client.connect('ping', (event) => events.push(event));

    client.simulateMessage({ anwser: 42 }, 'ping');

    expect(events).toEqual([
      expect.objectContaining({
        data: { anwser: 42 },
      }),
    ]);
  });
});
