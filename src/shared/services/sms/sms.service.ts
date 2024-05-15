import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SmsService {
  constructor(private http: HttpService) {}
  // old logic: shareModule.sendOTP
  async send(data: { mobileNumber: string; msg: string }) {
    console.log('Inside sharedModule sendOtp' + JSON.stringify(data));
    const reqObject = {};
    console.log('request reqObject in sendOtp - ' + JSON.stringify(reqObject));
    const sendUrl =
      'https://japi.instaalerts.zone/httpapi/QueryStringReceiver?ver=1.0&key=ZHVhZ2FtaW5nOlBva2Vyc2RAMTIz&encrpt=0&dest=' +
      data.mobileNumber +
      '&send=POKRSD&text=' +
      data.msg; //URL to hit
    const response = await this.http.post(sendUrl, reqObject).toPromise();
    console.log(response, 'body.result in sharedModule sendOtp', response.data);
    return true;
  }
}
