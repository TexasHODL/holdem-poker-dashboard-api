// import { NestExpressApplication } from '@nestjs/platform-express';
// import * as Queue from 'bull';
// import { createBullBoard } from '@bull-board/api';
// import { BullAdapter } from '@bull-board/api/bullAdapter';
// import { ExpressAdapter } from '@bull-board/express';
// import { ConfigService } from '@nestjs/config';

// const basicAuth = () => (req, res, next) => {
//   // authentication middleware
//   const auth = {login: process.env.BULL_BOARD_ADMIN_USERNAME, password: process.env.BULL_BOARD_ADMIN_PASSWORD}
//   // parse login and password from headers
//   const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
//   const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
//   // Verify login and password are set and correct
//   if (login && password && login === auth.login && password === auth.password) {
//     // Access granted...
//     return next()
//   }
//   // Access denied...
//   res.set('WWW-Authenticate', 'Basic realm="401"')
//   res.status(401).send('Authentication required.')
// };

// export function useQueue(app: NestExpressApplication, queues: Queue[]) {
//   const serverAdapter = new ExpressAdapter();
//   // const configService = app.get(ConfigService);
//   // const redisConfig = {
//   //   redis: {
//   //     port: configService.get('REDIS_PORT'),
//   //     host: configService.get('REDIS_HOST'),
//   //     db: configService.get('REDIS_DB'),
//   //   },
//   // };
//   // const notificationQueue = new Queue('notification', redisConfig);
//   // const crmQueue = new Queue('crm', redisConfig);
//   // const progressQueue = new Queue('progress', redisConfig);
//   createBullBoard({
//     queues: queues.map(q => new BullAdapter(q)),
//     serverAdapter,
//   });
//   serverAdapter.setBasePath('/ui/queues');
//   // console.log('serverAdapter.getRouter()', serverAdapter.getRouter())
//   app.use('/ui/queues', basicAuth(),  serverAdapter.getRouter());
// }
