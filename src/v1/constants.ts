export const RESPONSE_CODES = {
  200: {
    status: 200,
    message: 'success',
    success: true,
  },
  204: {
    status: 204,
    message: 'No content',
  },
  400: {
    status: 400,
    message: 'Invalid Params',
    success: false,
  },
  401: {
    status: 401,
    message: 'unauthorized',
    success: false,
  },
  500: {
    status: 500,
    message: 'Internal server error',
  },
};
