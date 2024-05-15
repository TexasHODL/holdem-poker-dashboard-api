import affiliates from '../../schema/affiliates';
import { UserAuthPayload } from '../../../controller/auth/user.interface';
import { encrypt } from '../../../helpers/crypto';
import { isValidateEmail } from '../../../helpers/utils';
import logger from '../../../logger';

export const validateAffliate = async (requestPayLoad: UserAuthPayload) => {
  const { userName, password } = requestPayLoad;
  const { success, result } = encrypt(password);
  try {
    return isValidateEmail(userName)
      ? (await affiliates().findOne({
          email: userName,
          password: success ? result : '',
        })) || {}
      : (await affiliates().findOne({
          userName,
          password: success ? result : '',
        })) || {};
  } catch (e) {
    logger.error(`validateAffiliate , error ${e}`);
    return {};
  }
};
