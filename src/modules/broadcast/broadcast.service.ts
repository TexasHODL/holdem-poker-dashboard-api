import { SocketClientService } from '@/shared/services/socket-client/socket-client.service';
import { Inject, Injectable } from '@nestjs/common';
import { RequestDataService } from '@/shared/services/request-data/request-data.service';

@Injectable()
export class BroadcastService {
    constructor(
        @Inject(SocketClientService)
        protected readonly socketClientService: SocketClientService,
        protected readonly requestData: RequestDataService
    ) {

    }
    async sendBroadcastToGame(params) {
        try {
            // await this.socketClientService.init();
            // const res = await this.socketClientService.request(
            //     'room.adminActionsHandler.informUsers',
            //     { data: params },
            // );
            // this.socketClientService.disconnect();
            // return res;
            return this.requestData.requestData('POST', '/broadcastToGame', { data: params }).then((response: any) => {
                const responseData = JSON.parse(response.result);
                if (responseData.success === true) {
                  console.log("responseData.data: ", responseData.data);
                  return responseData.data
                } else {
                  return false; 
                }
            }).catch(err => {
                console.log("err", err);
                return false;
            })
        } catch (e) {
            this.socketClientService.disconnect();
            console.log(e);
        }
    }
}
