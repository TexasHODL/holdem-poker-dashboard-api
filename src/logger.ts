import { NestExpressApplication } from '@nestjs/platform-express';
import morgan from 'morgan';
export function useLogger(app: NestExpressApplication) {
  app.use(
    morgan(':method :url :response-time', {
      skip: function (req, res) {
        return req.url === '/' || res.statusCode === 404;
      },
    }),
  );
}
