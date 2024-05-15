import { Schema, model } from 'mongoose';

export const webApiLogSchema = new Schema(
  {
    id: {
      type: String,
    },
    apiname: {
      type: String,
    },
    requestUrl: {
      type: String,
    },
    requestMethod: {
      type: String,
    },
    requestBody: {
      userName: {
        type: String,
      },
      uniqueSessionId: {
        type: String,
      },
    },
    queryParams: {
      type: String,
    },
    requestHeaders: {
      host: {
        type: Date,
      },
      contentType: {
        type: String,
      },
      origin: {
        type: Date,
      },
      acceptEncoding: {
        type: String,
      },
      cookie: {
        type: String,
      },
      connection: {
        type: String,
      },
      accept: {
        type: String,
      },
      userAgent: {
        type: String,
      },
      referer: {
        type: Date,
      },
      contentLength: {
        type: Date,
      },
      acceptLanguage: {
        type: String,
      },
    },
    requestTime: {
      type: String,
    },
    responseData: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export default model('WebApiLog', webApiLogSchema, 'webApiLog');
