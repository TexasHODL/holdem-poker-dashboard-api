import configs from '@/configs';
import { DBModel, InjectDBModel } from '@/database/connections/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import helper from '@sendgrid/helpers';
import sm from '@sendgrid/mail';
import { Model } from 'mongoose';
import https from "https";

@Injectable()
export class RequestDataService {
  constructor(
    @InjectDBModel(DBModel.User)
    private userModel: Model<any>,
  ) {
    // sm.setApiKey(configs.mail.username);
  }

  async requestData (method = "GET", path = '', data = {}, headersEx = {}) {
    const temp = JSON.stringify(data);
    const options = {
        hostname: "texashodl.net",
        port: 3015,
        path,
        method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(temp)
        }
    };
    // ovwerwrite header 
    if (!this.isEmpty(headersEx)) {
        Object.assign(options.headers, headersEx);
    }

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                resolve({ status: res.statusCode, result: chunk });

            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject({ status: 500, result: e.message });
        });

        // Write data to request body
        req.write(temp);
        req.end();
    });
  }

  isEmpty(obj = {}) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
  }
  
}
