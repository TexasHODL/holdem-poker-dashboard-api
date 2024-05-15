import configs from '@/configs';
import { HttpException, Injectable } from '@nestjs/common';
import {
  create as pomeloCreate,
  PomeloClient,
} from 'pomelo-node-client-websocket';

@Injectable()
export class SocketClientService {
  private _client: PomeloClient;
  constructor() {}

  get client() {
    if (!this._client) {
      this._client = pomeloCreate();
    }
    return this._client;
  }
  getClient() {
    return this.client;
  }

  async init () {
    return await new Promise(async (resolve, reject) => {
      let timeout = null;
      let succeed = false;
      this.client.init(
        {
          host: configs.tools.connectorHost,
          port: configs.tools.connectorPort,
          log: true,
        },
        () => {
          succeed = true;
          clearTimeout(timeout);
          resolve(true);
        },
        );
        console.log("succeed: ", succeed);
      await new Promise((r) => {
        timeout = setTimeout(r, 6000);
      });
      if (!succeed) {
        reject(new HttpException("Socket error: Can't connect to the socket server", 500));
      }
    });
  }

  async request(route: string, msg: any) {
    return await new Promise((resolve, reject) => {
      this.client.request(route, msg, (res) => {
        resolve(res);
      });
    });
  }

  disconnect() {
    return this.client.disconnect();
  }

  async send(route: string, msg: any) {
    const connected = await this.init();
    if (connected) {
      await this.request(route, msg);
      this.disconnect();
      return true;
    }
    return false;
  }
}
