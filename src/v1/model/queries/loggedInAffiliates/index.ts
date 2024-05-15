import loggedInAffiliates from '../../schema/loggedInAffiliates';
import affiliates from '../../schema/affiliates';
import {
  LoginResponse,
  CheckUserSession,
  ResetpasswordPayload,
  CheckUser2FA,
  CreateSecret2FA
} from '../../../controller/auth/user.interface';

export const createSessionForLoggedInUser = async (
  userReponsePayload: LoginResponse,
) => {
  try {
    return await loggedInAffiliates().insertMany([userReponsePayload]);
    // return await loggedInAffiliates().update({ userName: userReponsePayload.userName }, [userReponsePayload], { upsert: true });
  } catch (e) {
    return {};
  }
};

export const getSessionForLoggedInUser = async (
  userReponsePayload: LoginResponse,
) => {
  try {
    return await loggedInAffiliates().findOne({ userName: userReponsePayload.userName });;
    // return await loggedInAffiliates().update({ userName: userReponsePayload.userName }, [userReponsePayload], { upsert: true });
  } catch (e) {
    return {};
  }
};

export const updateSessionForLoggedInUser = async (
  userReponsePayload: LoginResponse,
  ) => {
  console.log("userReponsePayload: ", userReponsePayload);
  try {
    return await loggedInAffiliates().update({ userName: userReponsePayload.userName }, userReponsePayload, { upsert: true });
  } catch (e) {
    return {};
  }
};

export const getPasswordForLoggedInUser = async (
  resetPassword: LoginResponse,
) => {
  try {
    return await loggedInAffiliates().findOne({ email: resetPassword.email });
  } catch (e) {
    return {};
  }
};

export const UpdatePasswordForLoggedInUser = async (
  resetReponsePayload: ResetpasswordPayload,
) => {
  try {
    return await loggedInAffiliates()
      .findByIdAndUpdate({ email: resetReponsePayload.email })
      .updateMany({ password: resetReponsePayload.password });
  } catch (e) {
    return {};
  }
};

export const validateUserSession = async (
  checkUserSession: CheckUserSession,
) => {
  try {
    return (
      (await loggedInAffiliates().findOne({
        uniqueSessionId: checkUserSession.uniqueSessionId,
      })) || {}
    );
  } catch (e) {
    return {};
  }
};

export const deleteLoggedInUser = async (
  checkUserSession: CheckUserSession,
) => {
  try {
    return (
      (await loggedInAffiliates().deleteOne({
        uniqueSessionId: checkUserSession.uniqueSessionId,
      })) || {}
    );
  } catch (e) {
    return {};
  }
};

export const checkGoogleAuthenticator = async (checkUser2FA: CheckUser2FA) => {
  try {
    return (
      (await affiliates().findOne({
        userName: checkUser2FA.userName,
      })) || {}
    );
  } catch (e) {
    return {};
  }
};

export const checkUserOrEmail = async (params) => {
  console.log("inside checkUserOrEmail", params.email);

  // console.log("Câu truy vấn:", {
  //   $or: [{
  //     userName: params.email
  //   }, {
  //     email: params.email
  //   }]
  // });
  
  
  try {
    return (
      (await affiliates().find({
        $or: [{
          userName: params.email
        }, {
          email: params.email
        }]
      })) || {}
    );
  } catch (error) {
    return {};
  }
}

export const createSecretKey = async (createSecret2FA: CreateSecret2FA) => {
  console.log("inside createSecretKey: ", createSecret2FA);
  try {
    return (
      (await affiliates().update({
        userName: createSecret2FA.userName,
      }, { secret: createSecret2FA.secret }))
    );
  } catch (e) {
    return {};
  }
};

export const updateGoogleCount = async (createSecret2FA: CreateSecret2FA) => {
  try {
    return (
      await affiliates().update({
        userName: createSecret2FA.userName
      }, { countGoogleAuthen: 1 })
    )
  } catch (error) {
    return {}
  }
}

