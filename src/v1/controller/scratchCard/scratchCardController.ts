import { Request } from 'express';
import { RESPONSE_CODES } from '../../constants';
import { fromObject, isPayloadValid } from '../../helpers/utils';
import {
  approveScratchCardData,
  approveScratchCardPayload,
  ContentType,
  createDepositQueryType,
  createScratchCardAffiliatePayload,
  detailsType,
  rejectScratchCardData,
  saveScratchCardAffiliateDetails,
  scratchCardDetailsType,
  ScratchCardHighRollersPayload,
  sendParamsType,
} from './scratchCardInterface';
import {
  createScratchCardAffiliateRequest,
  ScratchCardHighRollersRequest,
} from './scratchCardType';
import MESSAGES from '../../helpers/messages.error';
import {
  createScratchCard,
  createTransactionHistory,
  deleteScratchCard,
  findPlayer,
  findUser,
  getScratchCardCount,
  insertInScratchCardHistory,
  listScratchCard,
  scratchCardHistoryCount,
  scratchCardHistoryList,
  updateBalanceSheet,
  updateDeposit,
} from '../../model/queries/scratchCard';
import { isEmpty, get, isNumber, isArray } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { sendMailWithHtml, sendSimpleMail } from './sendMail';
import { mailMessages } from '../../helpers/messages';
import { Constants } from '../../helpers/configConstants';
import logger from '../../logger';

const catch_response: any = {
  ...RESPONSE_CODES[500],
  success: false,
  info: MESSAGES.API_FAILURE_MESSAGE,
};

const error_response: any = {
  ...RESPONSE_CODES[400],
  success: false,
};

const success_response: any = {
  ...RESPONSE_CODES[200],
  success: true,
};

/**
 * This method checks the user is exists or not.
 * @method checkUserExists
 */
const checkUserExists = async (params: createScratchCardAffiliatePayload) => {
  const query = { userName: params.affiliateId };
  const response: any = await findUser(query);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: MESSAGES.NO_USER,
      result: response,
    };
  }
};

/**
 * This method cretes the scratch card for affiliate.
 * @method createScratchCardAffiliate
 * @param req [req.body]
 * @returns   [Validate response]
 */
export const createScratchCardAffiliate = async (req: Request) => {
  console.log("inside createScratchCardAffiliate");
  
  try {
    const requestPayload: any = fromObject(
      req,
      createScratchCardAffiliateRequest as createScratchCardAffiliatePayload,
    );
    console.log("requestPayload: ", requestPayload);
    const { isValid, message } = isPayloadValid(
      requestPayload,
      createScratchCardAffiliateRequest,
    );
    console.log("isValid: ", isValid);

    if (isValid) {
      const params = req.body;
      const checkUser = await checkUserExists(params);
      if (checkUser.success) {
        let level;
        if (checkUser.result[0].role.level === -1) {
          level = 'SUB-AFFILIATE';
        } else {
          level = 'AFFILIATE';
        }
        const details: saveScratchCardAffiliateDetails = {
          ...params,
          emailId: checkUser.result[0].email,
          userLevel: level,
          affiliateDetail: checkUser.result[0],
          comment: 'N/A',
        };
        const data = await createScratchCard(details);
        return {
          ...success_response,
          info: 'scratch card created successfully',
        };
      } else {
        return {
          ...RESPONSE_CODES[400],
          message:'User not found!',
          success: false,
          info: 'User not found!',
        };
      }
    } else {
      return {
        ...RESPONSE_CODES[400],
        message,
        success: false,
        info: message,
      };
    }
  } catch (err) {
    logger.error(`createScratchCardAffiliate , error ${err}`);
    return catch_response;
  }
};

/**
 * This method results the count of Scratch card generated which will be approve or reject by admin.
 * @method getScratchCardListCount
 */

export const getScratchCardListCount = async (req: Request) => {
  try {
    const query = req.body;
    const response: any = await getScratchCardCount(query);
    if (isNumber(response)) {
      return {
        ...success_response,
        info: 'Scratch card count',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'No scratch card found',
        result: response,
      };
    }
  } catch (err) {
    logger.error(`getScratchCardListCount , error ${err}`);
    return catch_response;
  }
};

/**
 * This method checks the players is exists or not.
 * @method checkPlayerExists
 */
const checkPlayerExists = async (playerId: string) => {
  const query = { userName: playerId };
  const response: any = await findPlayer(query);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'no player found',
    };
  }
};

/**
 * This method creates high rollers scratch card for that users who are performing good in game.
 * @method createScratchCardHighRollers
 */

export const createScratchCardHighRollers = async (req: Request) => {
  try {
    const requestPayload: any = fromObject(
      req,
      ScratchCardHighRollersRequest as ScratchCardHighRollersPayload,
    ) as ScratchCardHighRollersPayload;
    const { isValid, message } = isPayloadValid(
      requestPayload,
      ScratchCardHighRollersRequest,
    );
    if (isValid) {
      const params = req.body;
      const checkPlayer = await checkPlayerExists(params.playerId);
      if (checkPlayer.success) {
        const details = {
          ...params,
          emailId: get(checkPlayer, 'result[0].emailId'),
          playerDetail: get(checkPlayer, 'result[0]'),
        };

        const data = await createScratchCard(details);
        return {
          ...success_response,
          info: 'ScratchCard high rollers created successfully',
          return: data,
        };
      } else {
        return checkPlayer;
      }
    } else {
      return {
        ...error_response,
        message,
        info: 'Invalid request payload',
      };
    }
  } catch (err) {
    logger.error(`createScratchCardHighRollers , errors ${err}`);
    return catch_response;
  }
};

/**
 * This methods gets the Scratch card list.
 * @method getScratchCardList
 */

export const getScratchCardList = async (req: Request) => {
  console.log("inside getScratchCardList");
  
  try {
    const query = req.body;
    const response: any = await listScratchCard(query);
    if (isArray(response) && !isEmpty(response)) {
      return {
        ...success_response,
        info: 'list of scratch card',
        result: response,
      };
    } else if (isArray(response) && isEmpty(response)) {
      return {
        ...success_response,
        info: 'scratch card list is empty',
        return: response,
      };
    } else {
      return {
        ...error_response,
        info: 'No scratch card found',
        result: response,
      };
    }
  } catch (err) {
    logger.error(`getScratchCardList , error ${err}`);
    return catch_response;
  }
};

/**
 * This method return the count of history in scratch card management.
 * @method getScratchCardHistoryCount
 */

//need to test api
export const getScratchCardHistoryCount = async (req: Request) => {
  try {
    const query = req.body;
    const response: any = await scratchCardHistoryCount(query);
    if (response) {
      return {
        ...success_response,
        info: 'count of scratch card history',
        result: response,
      };
    } else {
      return {
        ...error_response,
        info: 'zero count in scratch card history',
        result: response,
      };
    }
  } catch (err) {
    logger.error(`getScratchCardHistoryCount , error ${err}`);
    return catch_response;
  }
};

/**
 * This method return the list of history in scratch card management.
 * @method getScratchCardHistory
 */

export const getScratchCardHistory = async (req: Request) => {
  try {
    if (req.body['createdBy.userName']) {
      req.body['createdBy.userName'] = eval('/' + req.body['createdBy.userName'] + '/i');
    }
    if (req.body['issuedBy.userName']) {
      req.body['issuedBy.userName'] = eval('/' + req.body['issuedBy.userName'] + '/i');
    }
    if (req.body['usedBy.userName']) {
      req.body['usedBy.userName'] = eval('/' + req.body['usedBy.userName'] + '/i');
    }
    const response: any = await scratchCardHistoryList(req.body);
    if (!isEmpty(response)) {
      return {
        ...success_response,
        info: 'scratch card history list',
        result: response,
      };
    } else {
      return {
        ...success_response,
        info: 'scratch card history list is empty',
        result: response,
      };
    }
  } catch (err) {
    logger.error(`getScratchCardHistory , error ${err}`);
    return catch_response;
  }
};

const insertDataInHistory = async (data: rejectScratchCardData) => {
  const query = data;
  const response: any = await insertInScratchCardHistory(query);
  if (!isEmpty(response)) {
    return {
      ...success_response,
      info: 'Scratch card rejected',
      result: response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error in scratch card deletion',
      result: response,
    };
  }
};

const removeScratchCardFromPending = async (_id: string) => {
  const query = { _id: _id };
  const response: any = await deleteScratchCard(query);
  if (!isEmpty(response)) {
    return {
      ...success_response,
    };
  } else {
    return {
      ...error_response,
      info: 'error in deleting scratch card',
    };
  }
};

/**
 * This method is used to reject the scratch card generated by User.
 * @method rejectScratchCard
 */

export const rejectScratchCard = async (req: Request) => {
  try {
    const data: rejectScratchCardData = {};
    let detailString = '';
    const scratchCardDetails = get(req, 'body.scratchCardDetails');
    if (!isEmpty(scratchCardDetails)) {
      data.scratchCarddetails = scratchCardDetails;
      for (let i = 0; i < scratchCardDetails.length; i++) {
        detailString =
          detailString +
          scratchCardDetails[i].denomination +
          ' x ' +
          scratchCardDetails[i].quantity;
        if (i < get(req, 'body.scratchCardDetails.length') - 1) {
          detailString += ', ';
        }
      }
    }
    data.detailString = detailString;
    data.code = 'N/A';
    data.scratchCardType = get(req, 'body.scratchCardType');
    data.denomination = get(req, 'body.totalAmount');
    data.expiresOn = get(req, 'body.expiresOn');
    data.transactionType = get(req, 'body.transactionType');
    data.createdBy = get(req, 'body.createdBy');
    data.status = 'REJECTED';
    data.reasonOfRejection = get(req, 'body.reasonOfRejection');
    data.usedBy = 'N/A';
    data.issuedBy = get(req, 'body.issuedBy');
    data.generationId = uuidv4().toUpperCase();
    if (get(req, 'body.promoCode')) {
      data.promoCode = get(req, 'body.promoCode');
    }
    if (get(req, 'body.affiliateId')) {
      data.affiliateId = get(req, 'body.affiliateId');
      data.userLevel = get(req, 'body.userLevel');
    }
    if (get(req, 'body.playerId')) {
      data.playerId = get(req, 'body.playerId');
    }
    if (get(req, 'body.comment')) {
      data.comment = get(req, 'body.comment');
    }

    const removeCard = await removeScratchCardFromPending(get(req, 'body._id'));
    if (removeCard.success) {
      return await insertDataInHistory(data);
    } else {
      return removeCard;
    }
  } catch (err) {
    logger.error(`rejectScratchCard , error ${err}`);
    return catch_response;
  }
};

const convertDateToMidnight = (dateToConvert: Date) => {
  dateToConvert = new Date(dateToConvert);
  dateToConvert.setHours(0);
  dateToConvert.setMinutes(0);
  dateToConvert.setSeconds(0);
  dateToConvert.setMilliseconds(0);
  return dateToConvert;
};

const insertApprovedScratchCardInHistory = async (
  data: approveScratchCardData,
) => {
  const query = data;
  const response: any = await insertInScratchCardHistory(query);
  if (!isEmpty(response)) {
    return success_response;
  } else {
    return {
      ...error_response,
      info: 'error in inserting scratch card history',
    };
  }
};

const createDepositHistory = async (query: createDepositQueryType) => {
  const response: any = await createTransactionHistory(query);
  if (!isEmpty(response)) {
    return success_response;
  } else {
    return {
      ...error_response,
      info: 'error in create Transaction History',
    };
  }
};

const insertApprovedDataInHistory = async (
  params: approveScratchCardPayload,
  element: any,
  infoDe: any
) => {
  const data: approveScratchCardData = {};
  data.code = uuidv4().slice(30).toUpperCase();
  data.scratchCardType = params.scratchCardType;
  data.denomination = element;
  data.expiresOn = params.expiresOn;
  data.transactionType = params.transactionType;
  data.createdBy = params.createdBy;
  data.issuedBy = params.issuedBy;
  data.status = 'NEW';
  data.generationId = uuidv4().toUpperCase();
  data.info = infoDe;
  if (params.promoCode) {
    data.promoCode = params.promoCode;
  }
  if (params.affiliateId) {
    data.affiliateId = params.affiliateId;
    data.userLevel = params.userLevel;
  }
  if (params.playerId) {
    data.playerId = params.playerId;
    data.receiverMail = params.playerDetail?.emailId;
    data.playerName = params.playerDetail?.firstName;
  }

  const insertInHistory = await insertApprovedScratchCardInHistory(data);
  if (!isEmpty(insertInHistory)) {
    return {
      ...success_response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error in inserting data in history',
    };
  }
};

const insertApprovedScratchCardDataInHistory = async (
  params: approveScratchCardPayload,
) => {
  const data: approveScratchCardData = {};
  data.code = uuidv4().slice(30).toUpperCase();
  data.scratchCardType = params.scratchCardType;
  data.playerId = params.playerId;
  data.receiverMail = params.recieverMail;
  data.playerName = params.playerName;
  data.denomination = params.totalAmount;
  data.expiresOn = params.expiresOn;
  data.comment = params.comment;
  data.createdBy = params.createdBy;
  data.transactionType = params.transactionType;
  data.issuedBy = params.issuedBy;
  (data.status = 'NEW'), (data.generationId = uuidv4().toUpperCase());

  const response: any = await insertApprovedScratchCardInHistory(data);
  if (response.success) {
    return {
      ...success_response,
      result: data,
    };
  } else {
    return {
      ...error_response,
      info: 'Error in inserting in history',
      result: data,
    };
  }
};

const createDepositHistoryForHighRollers = async (
  params: approveScratchCardPayload,
) => {
  const query: createDepositQueryType = {};
  query.name = `${params.playerDetail?.firstName} ${params.playerDetail?.lastName}`;
  query.loginId = params.playerDetail?.userName;
  query.scratchCardType = 'HIGH-ROLLERS';
  query.date = new Date();
  query.referenceNumber = uuidv4().toUpperCase();
  query.amount = params.totalAmount;
  query.transferMode = 'Scratch Card';
  query.paymentId = 'N/A';
  query.bonusCode = 'N/A';
  query.bonusAmount = 'N/A';
  query.transactionType = params.transactionType;
  (query.transferTo = 'N/A'), (query.approvedBy = params.issuedBy.userName);
  query.status = 'NOT USED';
  query.profileScratchCard = 'PLAYER';
  const response: any = await createDepositHistory(query);
  if (response.success) {
    return {
      ...success_response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error in create deposit history',
    };
  }
};

const createDepositHistoryForAffiliates = async (
  params: approveScratchCardPayload,
) => {
  const query: createDepositQueryType = {};
  if (params.affiliateId) {
    query.name = params.affiliateDetail?.name;
    query.loginId = params.affiliateDetail?.userName;
    query.userLevel = params.userLevel;
    query.scratchCardType = 'Affiliate';
    query.profileScratchCard = params.userLevel;
  }
  if (params.playerId) {
    query.name = `${params.playerDetail?.firstName} ${params.playerDetail?.lastName}`;
    query.loginId = params.playerDetail?.userName;
    query.scratchCardType = 'Emergency';
    query.profileScratchCard = 'PLAYER';
  }
  if (params.scratchCardType == 'PROMOTION') {
    query.name = 'N/A';
    query.loginId = 'N/A';
    query.scratchCardType = 'PROMOTION';
    query.profileScratchCard = 'N/A';
  }
  query.transactionType = 'N/A';
  query.transferTo = 'N/A';
  query.date = new Date();
  query.referenceNumber = uuidv4().toUpperCase();
  query.amount = params.totalAmount;
  query.transferMode = 'Scratch Card';
  query.paymentId = 'N/A';
  query.bonusCode = 'N/A';
  query.bonusAmount = 'N/A';
  query.transactionType = params.transactionType;
  query.approvedBy = params.issuedBy.userName;
  query.status = 'NOT USED';

  const response: any = await createDepositHistory(query);
  if (response.success) {
    return {
      ...success_response,
    };
  } else {
    return {
      ...error_response,
      info: 'Error in create deposit history',
    };
  }
};

/**
 * This method is used to approve the sratch card generated by user/admin
 * @method approveScratchCard
 */

export const approveScratchCard = async (req: Request) => {
  try {
    const expiresOnDate = get(req, 'body.expiresOn');
    const currentDate = new Date();
    if (
      convertDateToMidnight(expiresOnDate) < convertDateToMidnight(currentDate)
    ) {
      return {
        ...error_response,
        info: 'Scratch Card usage date has already expired! Please Reject it',
      };
    }
    if (get(req, 'body.scratchCardType') === 'HIGH-ROLLERS') {
      let scratchCardTableForEmail =
        '<html><body><table style="font-size: 11px; margin: 15px 0; border-collapse: collapse;">  <tr>    <th width="25%" align="center" style="border: 1px solid;">Scratch Card Code</th>    <th width="25%" align="center" style="border: 1px solid;">Reference No.</th>    <th width="25%" align="center" style="border: 1px solid;">Amount</th>   <th width="25%" align="center" style="border: 1px solid;">Expiration Date</th> </tr> ';

      const insertInHistory = await insertApprovedScratchCardDataInHistory(
        req.body,
      );
      if (insertInHistory.success) {
        scratchCardTableForEmail =
          scratchCardTableForEmail +
          '<tr><td width="25%" align="center" style="line-height: 20px; border: 1px solid;">' +
          insertInHistory.result.code +
          '</td> <td width="25%" align="center" style="line-height: 20px; border: 1px solid;">' +
          insertInHistory.result.generationId +
          '</td> <td width="25%" align="center" style="line-height: 20px; border: 1px solid;">' +
          insertInHistory.result.denomination +
          '</td> <td width="25%" align="center" style="line-height: 20px; border: 1px solid;">' +
          new Date(
            get(req, 'body.expiresOn') + 330 * 60 * 1000,
          ).toLocaleString() +
          ' (IST)</td>  </tr>';
        const removeScratchCard = await removeScratchCardFromPending(
          get(req, 'body._id'),
        );
        if (removeScratchCard.success) {
          const createDeposit = await createDepositHistoryForHighRollers(
            req.body,
          );
          if (createDeposit.success) {
            scratchCardTableForEmail =
              scratchCardTableForEmail + '</table></body></html><br><br>';
            const content = {
              name: get(req, 'body.playerDetail.firstName'),
              userName: get(req, 'body.playerDetail.userName'),
              scratchCardDetails: scratchCardTableForEmail,
            };

            const mailData = {
              content: content,
              to_email: get(req, 'body.playerDetail.emailId'),
              from_email: mailMessages.mail_scratchCardSender,
              subject: 'receiverSubject', //this is dummy value, verify it from existing code.
              template: 'scratchCardPlayer',
            };
            const sendMail = await sendMailWithHtml(mailData);
            if (sendMail?.success) {
              return {
                ...success_response,
                info: `${sendMail?.info} in HIGH-ROLLERS`,
              };
            } else {
              return {
                ...error_response,
                info: `${sendMail?.info} in HIGH-ROLLERS`,
              };
            }
            //console.log('inside final line send mail in controller ===')
          } else {
            return createDeposit; // return error response
          }
        } else {
          return removeScratchCard; // return error response
        }
      } else {
        return insertInHistory; // return error response
      }
    } else {
      console.log(
        'inside else statment in approve scratch card ====',
        req.body,
      );
      let mailContent = '';
      let receiverMail: any = '';
      let receiverSubject = '';

      switch (get(req, 'body.scratchCardType')) {
        case 'PROMOTION':
          mailContent =
            'Hi Admin,<br><br>Please find the scratch card details below.<br><br>Email us at ' +
            process.env.FROM_EMAIL +
            '.<br><br><br>';
          receiverMail = process.env.BECOME_AFFMAIL;
          receiverSubject = mailMessages.mail_subjectScratchCardPlayer;
          break;

        case 'EMERGENCY':
          mailContent = `Hi ${get(
            req,
            'body.playerDetail.firstName',
            '',
          )} (${get(
            req,
            'body.playerDetail.userName',
            '',
          )}), <br><br>Please find the scratch card details below.<br><br>Email us at ${process.env.FROM_EMAIL
            }. <br><br><br>`;
          receiverMail = get(req, 'body.playerDetail.emailId');
          receiverSubject = mailMessages.mail_subjectScratchCardPlayer;
          break;

        case 'AFFILIATE':
          receiverMail = get(req, 'body.affiliateDetail.email');
          receiverSubject = mailMessages.mail_subjectScratchCardAffiliate;
          break;
      }

      console.log("qua day 1");
      
      let scratchCardTableForEmail =
        '<html><body><table style="font-size: 11px; margin: 15px 0; border-collapse: collapse;">  <tr>    <th width="25%" align="center" style="border: 1px solid;">Scratch Card Code</th>    <th width="25%" align="center" style="border: 1px solid;">Reference No.</th>    <th width="25%" align="center" style="border: 1px solid;">Amount</th>   <th width="25%" align="center" style="border: 1px solid;">Expiration Date</th> </tr> ';
      const ScratchCardDetails: detailsType[] = get(
        req,
        'body.scratchCardDetails',
      );

      console.log("ScratchCardDetails: ", ScratchCardDetails);
      // ScratchCardDetails.forEach(async (element) => {
      //   for (let i = 0; i < element.quantity; i++) {
      //     const response: any = await insertApprovedDataInHistory(
      //       req.body,
      //       element,
      //     );
      //     if (!response.success) {
      //       return response; //return error response.
      //     }
      //   }
      // });
      const totalAm = ScratchCardDetails.reduce((acc, val) => acc + (val.denomination * val.quantity), 0)
      const infoAm = ScratchCardDetails.map((item) => `${item.denomination}x${item.quantity}`)
      const response: any = await insertApprovedDataInHistory(
        req.body,
        totalAm,
        infoAm
      );
      if (!response.success) {
        return response; //return error response.
      }

      const removeScratchCard = await removeScratchCardFromPending(
        get(req, 'body._id'),
      );
      if (removeScratchCard.success) {
        const depositHitory = await createDepositHistoryForAffiliates(req.body);
        if (depositHitory.success) {
          if (get(req, 'body.scratchCardType') === 'PROMOTION') {
            const filter = {};
            const query = { $inc: { bonus: get(req, 'body.totalAmount') } };
            const modifyBalanceSheet = await updateBalanceSheet(filter, query);
            scratchCardTableForEmail =
              scratchCardTableForEmail +
              '</table></body></html><br><br>Regards,<br>' +
              Constants.GAME_NAME_TEXT +
              ' Team';
            const mailData = {
              content: `${mailContent} ${scratchCardTableForEmail}`,
              from_email: mailMessages.mail_scratchCardSender,
              to_email: receiverMail,
              subject: receiverSubject,
            };
            const sendMail = await sendSimpleMail(mailData);
            //need to add error handling here for sending response.
            return {
              ...success_response,
              info: 'All insertion done for PROMOTION',
            };
          } else {
            const filter = {};
            const query = { $inc: { deposit: get(req, 'body.totalAmount') } };
            const modifyBalanceSheet = await updateBalanceSheet(filter, query);
            scratchCardTableForEmail =
              scratchCardTableForEmail + '</table></body></html><br><br>';
            if (get(req, 'body.scratchCardType') === 'AFFILIATE') {
              const filter = { userName: get(req, 'body.affiliateId') };
              const query = {
                $inc: {
                  'chipsManagement.deposit': get(req, 'body.totalAmount'),
                },
              };
              const updateAmount = await updateDeposit(filter, query);
              const content = {
                name: get(req, 'body.affiliateDetail.name'),
                userName: get(req, 'body.affiliateDetail.userName'),
                scratchCardDetails: scratchCardTableForEmail,
              };
              const mailData = {
                content: content,
                from_email: mailMessages.mail_scratchCardSender,
                to_email: receiverMail,
                subject: receiverSubject,
                template: 'scratchCardAffiliate',
              };
              const sendMail = await sendMailWithHtml(mailData);
              if (sendMail?.success) {
                return {
                  ...success_response,
                  info: `${sendMail?.info} in AFFILIATE`,
                };
              } else {
                return {
                  ...error_response,
                  info: `${sendMail?.info} in AFFILIATE`,
                };
              }
            } else {
              const content = {
                name: get(req, 'body.playerDetail.firstName'),
                userName: get(req, 'body.playerDetail.userName'),
                scratchCardDetails: scratchCardTableForEmail,
              };
              const mailData = {
                content: content,
                from_email: mailMessages.mail_scratchCardSender,
                to_email: receiverMail,
                subject: receiverSubject,
                template: 'scratchCardAffiliate',
              };
              const sendMail = await sendMailWithHtml(mailData);
              if (sendMail?.success) {
                return {
                  ...success_response,
                  info: `${sendMail?.info} in AFFILIATE`,
                };
              } else {
                return {
                  ...error_response,
                  info: `${sendMail?.info} in AFFILIATE`,
                };
              }
            }
          }
        } else {
          return depositHitory; // return error response
        }
      } else {
        return removeScratchCard; //return error response
      }
    }
  } catch (err) {
    logger.error(`approveScratchCard , error ${err}`);
    return catch_response;
  }
};
