import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json, urlencoded, raw, text } from 'body-parser';
import * as hbs from 'hbs';

export function useView(app: NestExpressApplication) {
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);
}
