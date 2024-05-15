import { NestExpressApplication } from '@nestjs/platform-express';

let __APP__: NestExpressApplication = null;

export function useApp(app) {
  __APP__ = app;
}

export function getApp() {
  return __APP__;
}

export default __APP__;
