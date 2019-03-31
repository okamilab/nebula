import { SwarmClient } from '@erebos/swarm-browser';
import StreamRPC from '@mainframe/rpc-stream';

import RxWebSocketSubject from './RxWebSocketSubject';

export default class ClientResolver {
  constructor(config) {
    const { bzz, ws } = config;

    this.subject = new RxWebSocketSubject(ws);
    this.client = new SwarmClient({
      bzz,
      rpc: new StreamRPC(this.subject.socket)
    });

    const _this = this;
    this.subject.connectionStatus.subscribe(
      (isConnected) => {
        if (!isConnected) {
          return;
        }

        _this.client = new SwarmClient({
          bzz,
          rpc: new StreamRPC(_this.subject.socket)
        });
      }
    );
  }
}