import configs from "@/configs";
import { DBModel, InjectDBModel } from "@/database/connections/db";
import { BadRequestException, Injectable } from "@nestjs/common";
import sm from "@sendgrid/mail";
import { Model } from "mongoose";
import nodemailer from "nodemailer";

const templateIds = {
  default: "7ee59c06-bb58-4e31-a8c3-1e1530095931", //for sendgrid mail template
  welcome: "7ee59c06-bb58-4e31-a8c3-1e1530095931", //for sendgrid mail welcome template
  forgot: "2d136c5b-bda1-480f-b694-511a47aa51ef", // for forgot password mail
  scratchCardPlayer: "91f32e0f-c64b-42c2-9d98-1b45cd72f183",
  scratchCardAffiliate: "89a4abf0-d152-4552-b6d5-826f68e28c43",
  cashoutApproved: "92dec987-8db8-4595-b2a9-eaaf5da09d33",
  cashoutRejected: "fe0f266e-f32b-4988-ad80-4510770e8638",
  fundTransferPlayerFail: "100634e8-4609-4c4e-b77d-2d57832a0066",
  cashoutSuccessful: "e611c594-cbc5-401e-948c-f431853ffd03",
  cashoutUnsuccessful: "afb29f45-1246-4f02-96db-114990cec83d",
  fundTransferPlayer: "dca420da-0619-45fe-978d-16efea8145da",
  scratchCardExpiration: "d8337f8e-6f92-4884-ab1f-5becf3b4face",
  updatePlayerMail: "57349884-1b41-4c31-ac7d-7262ac7fab78",
  rakeback: "928ba70b-3b10-4fe3-871f-3e22c37bf00f",
  affiliateSignUp: "afaf4e3e-f23e-48cd-9dee-32748104ece2",
  signUpBonus: "dbe3520b-a916-4931-9451-659fcf4ef5cb",
  inactivePlayer: "b2e1afac-b8c5-4656-96b1-5bbb00fa5e84",
  instantBonusTransfer: "274bb06f-a9cc-4970-a5b8-586958a9db7b",
  leaderboardWinner: "e9f1fd5e-cebe-4f77-b9c2-25ab532ca198",
  leaderboardRegistration: "adcc60a9-edd1-4030-ada4-45b11d10c813",
  lockedBonusCredit: "3a977179-edeb-403b-a68d-c0d972a75034",
  lockedBonusClaimed: "d97f6d7d-7369-4d55-b45b-e049fe951403",
  lockedBonusExpired: "755058a3-9420-40b9-8268-24d9ea8cad28",
  dailyUpdateLockedBonus: "62535636-ad76-4278-8d91-2da85f53182b",
  claimBonusMails: "10793f25-35c0-4756-957a-2b9d75dea2f1",
  leaderboardWinnerHand: "4f16c46f-a49f-4025-a75c-ed540b9d7b4e",

  // add more send-grid template ids here
};

@Injectable()
export class MailService {
  constructor(
    @InjectDBModel(DBModel.User)
    private userModel: Model<any>
  ) {
    // sm.setApiKey(configs.mail.username);
  }

  // send simple mail
  // using sendgrid
  async sendEmail(data: {
    to: string;
    from?: string;
    subject: string;
    content: string;
  }) {
    await this.checkPlayerStateWithEmail(data.to);
    console.log("send mail");
    sm.setApiKey(configs.sendgrid.API_KEY);
    console.log(
      "data.from || process.env.FROM_EMAIL",
      data.from || process.env.FROM_EMAIL
    );
    return sm.send({
      from: {
        name: "Texas",
        email: data.from || process.env.FROM_EMAIL,
      },
      to: {
        name: "",
        email: data.to,
      },
      subject: data.subject,
      html: data.content,
      // content: [
      //   {
      //     type: 'text/html',
      //     value: data.content
      //   }
      // ]
    });

    // var from_email  = new helper.classes.EmailAddress(data.from_email);
    // var to_email    = new helper.classes.EmailAddress(data.to_email);
    // var subject     = data.subject;
    // // var content     = new helper.classes.("text/html", data.content);
    // var mail        = new helper.classes.Mail({
    //   from: from_email,
    //   to: to_email,
    //   subject
    // });
    // var key = stateOfX.SendGridApiKey;
    // console.log(key);
    // var sg = require('sendgrid')(key);

    // var request = sg.emptyRequest({
    //   method: 'POST',
    //   path: '/v3/mail/send',
    //   body: mail.toJSON()
    // });

    // console.log("going to send email in shared module",data);
    // sg.API(request, function(error, response) {
    //   console.log("sent mail in shared module");
    //   console.log('response.statusCode',response.statusCode);
    //   console.log('response.body',response.body);
    //   console.log('response.headers',response.headers);
    //   return callback({success: true});
    // });
  }

  // SEND HTML TEMPLATE MAILS
  // using sendgrid
  async sendMailWithHtml(params: {
    to: string;
    from?: string;
    subject: string;
    template?: string;
    data?: any;
    content?: any;
  }) {
    console.log("line 118 inside sendmailwith html", params);
    sm.setApiKey(configs.sendgrid.API_KEY);
    const msg = {
      to: {
        name: "Texas",
        email: params.to,
      },
      from: {
        name: "",
        email: params.from || process.env.FROM_EMAIL,
      },
      subject: params.subject || "Welcome to" + configs.app.GAME_NAME_TEXT,
      text: "is fun",
      html: "<p></p>",
      templateId: templateIds[params.template || "default"],
      substitutions: this.getSubstitutions({
        ...params,
        ...params.data,
      }),
    };
    const res = await sm.send(msg);
    console.log("send email result", res);
    return res;

    // var r = sm.send(msg);
    // r.then(([response, body]) => {
    //   console.log(response.statusCode);
    //   console.log(response);
    //   callback({ success: true });
    // }).catch((error) => {
    //   console.error(error.toString());
    //   callback({ success: false });
    // });
    // checkStatePlayer.checkPlayerStateWithEmail(data.to_email,function(res){
    //   console.log("res in send mail",res);
    //   if(!res.success){
    //     console.log('line 118 inside sendmailwith html', data);
    //     var s = client;
    //     s.setApiKey(stateOfX.SendGridApiKey);
    //     var request = {};
    //     var msg = {
    //     to : data.to_email,
    //     from : data.from_email || process.env.FROM_EMAIL,
    //     subject: data.subject || "Welcome to"+configConstants.GAME_NAME_TEXT,
    //     text: 'is fun',
    //     html: '<p></p>',
    //     templateId: templateIds[(data.template||'default')],
    //     substitutions: getSubstitutions(data)
    //     };
    //     var r = sm.send(msg);
    //     r.then(([response, body]) => {
    //      console.log(response.statusCode);
    //      console.log(response);
    //      callback({success: true});
    //     }).catch((error) => {
    //      console.error(error.toString());
    //      callback({success: false});
    //     });
    //   }else{
    //     console.log("mail not sent");
    //     callback({success: true});
    //   }
    // });
  }

  sendMailWithHtmlRejectCashout(params: {
    to: string;
    from?: string;
    subject: string;
    template?: string;
    data?: any;
    content?: any;
  }) {
    console.log("inside sendMailWithHtml", params);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "admin@texashodl.net",
        pass: "cyvv vznf kqxr itcj",
      },
    });

    // setup email data with unicode symbols
    const substitutions = this.getSubstitutions({
      ...params,
      ...params.data,
    });
    const mailOptions = {
      from: "admin@texashodl.net", // sender address
      to: params.to || "naman.jain@pokersd.com", // list of receivers
      subject: params.subject,
      // templateId: templateIds[params.template || 'default'],
      html: `
        <p>Dear ${substitutions.player_name}</p>
        <p>Your cashout request (${substitutions.player_referenceNo}) could not be completed at this time as .</p>
        <p>The chips have been returned to your account.</p>
        <p>Kindly contact customer care or revert on this mail for further inquiry.</p>
        <p>Regards,</p>
        <p>Texas Holdl<p>
      `,
    };
    return new Promise((res, rej) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) rej(error);
        else res(info);
      });
    });
  }

  sendFileViaMail(params: {
    to: string;
    from?: string;
    subject: string;
    text?: string;
    fileData: any;
  }) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "admin@texashodl.net",
        pass: "cyvv vznf kqxr itcj",
      },
    });

    const subjects = "Texas Hodl hand history Report";
    // setup email data with unicode symbols
    const mailOptions = {
      from: '"support@creatiosoft.com" <foo@example.com>', // sender address
      to: params.to || "naman.jain@pokersd.com", // list of receivers
      subject: params.subject || subjects, // Subject line
      text: params.text, // plain text body
      attachments: [
        {
          // utf-8 string as an attachment
          filename: "Hand_History_Report.txt",
          content: Buffer.from(params.fileData, "utf-8"),
        },
      ],
    };
    return new Promise((res, rej) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) rej(error);
        else res(info);
      });
    });
  }

  getSubstitutions(data) {
    console.log("datagetSubstitutions ", data);
    switch (data.template) {
      case "forgot":
        return {
          player_name: data.userName || "Poker-User",
          player_forgot_link: data.resetPasswordLink,
        };
      case "fundTransferPlayer":
        return {
          player_name: data.content.userName || "Poker-User",
          player_referenceNo: data.content.referenceNo,
          player_amount: data.content.amount,
          player_totalAmount: data.content.totalAmount,
        };
      case "scratchCardAffiliate":
        return {
          affiliate_name: data.content.name || "Poker-User",
          affiliate_userName: data.content.userName,
          affiliate_scratchCardDetails: data.content.scratchCardDetails,
        };
      case "scratchCardPlayer":
        return {
          player_name: data.content.name || "Poker-User",
          player_userName: data.content.userName,
          player_scratchCardDetails: data.content.scratchCardDetails,
        };
      case "cashoutRejected":
        return {
          player_name: data.content.userName,
          player_referenceNo: data.content.referenceNo,
          reject_reason: data.content.unsuccessfulReason,
        };

      case "fundTransferPlayerFail":
        return {
          player_name: data.content.userName,
        };

      case "cashoutApproved":
        return {
          player_name: data.content.userName,
          player_chips: data.content.chips,
          player_referenceNo: data.content.referenceNo,
        };

      case "cashoutUnsuccessful":
        return {
          player_name: data.content.userName,
          player_referenceNo: data.content.referenceNo,
          unsuccessful_reason: data.content.unsuccessfulReason,
        };

      case "cashoutSuccessful":
        return {
          player_name: data.content.userName,
          player_chips: data.content.chips,
          player_referenceNo: data.content.referenceNo,
          player_amount: data.content.amount,
          player_accountNumber: data.content.accountNumber,
          player_tds: data.content.tds,
          player_panNumber: data.content.panNumber,
        };

      case "scratchCardExpiration":
        return {
          player_name: data.content.name,
          player_userName: data.content.userName,
          player_scratchCardId: data.content.scratchCardId,
          player_date: data.content.date,
        };

      case "updatePlayerMail":
        return {
          affiliate_name: data.content.parentName,
          player_name: data.content.playerName,
        };

      case "rakeback":
        return {
          player_name: data.content.playerName,
          date: data.content.date,
          rakeBack_amount: data.content.rakeback,
          previous_bal: data.content.previousBal,
          new_Balance: data.content.newBalance,
        };

      case "affiliateSignUp":
        return {
          affiliate_name: data.content.affiliateName,
          affiliate_userName: data.content.userName,
          link: data.content.link,
        };

      case "signUpBonus":
        return {
          player_name: data.content.playerName,
          bonus_percent: data.content.bonusPercent,
          bonus_code: data.content.bonusCode,
          date: data.content.date,
        };

      case "instantBonusTransfer":
        return {
          player_name: data.userName,
          player_amount: data.amount,
          player_text: data.mailText,
        };

      case "lockedBonusCredit":
        return {
          player_name: data.content.userName,
          player_lockedAmount: data.content.lockedBonusAmount,
          player_currentVipLevel: data.content.playerCurrentVipLevel,
          player_bonusCreditedAt: data.content.bonusCreditedAt,
          player_bonusExpiredAt: data.content.bonusExpiredAt,
          player_vipPointsNeeded: data.content.vipPointsNeeded,
          player_depositAmount: data.content.depositAmount,
        };

      case "lockedBonusClaimed":
        return {
          player_name: data.userName,
          player_claimedAmount: data.claimedAmount,
          player_playerPrevVipPoints: data.playerPrevVipPoints,
          player_playerNewVipPoints: data.playerNewVipPoints,
          player_playerPrevVipLevel: data.playerPrevVipLevel,
          player_playerNewVipLevel: data.playerNewVipLevel,
          player_previousChips: data.previousChips,
          player_updatedChips: data.updatedChips,
          player_vipPointsDeducted: data.vipPointsDeducted,
        };

      case "lockedBonusExpired":
        return {
          player_name: data.userName,
          player_lockedBonus: data.lockedBonus,
          player_creditedDate: data.creditedDate,
          player_expiredDate: data.expiredDate,
        };

      case "inactivePlayer":
        return {};

      case "leaderboardWinner":
        return {
          player_name: data.content.userName,
          player_rank: data.content.rank,
          leaderboard_name: data.content.leaderboardName,
          leaderboard_stakes: data.content.stakes,
          leaderboard_startTime: data.content.startTime,
          leaderboard_endTime: data.content.endTime,
          player_VipPoints: data.content.vipPoints,
          player_amountWon: data.content.amountWon,
          leaderboard_prizePool: data.content.prizePool,
          leaderboard_text: data.content.text,
        };

      case "leaderboardWinnerHand":
        return {
          player_name: data.content.userName,
          player_rank: data.content.rank,
          leaderboard_name: data.content.leaderboardName,
          leaderboard_stakes: data.content.stakes,
          leaderboard_startTime: data.content.startTime,
          leaderboard_endTime: data.content.endTime,
          player_VipPoints: data.content.vipPoints,
          player_amountWon: data.content.amountWon,
          leaderboard_prizePool: data.content.prizePool,
          leaderboard_text: data.content.text,
        };
      case "leaderboardRegistration":
        return {
          player_name: data.content.userName,
          leaderboard_name: data.content.leaderboardName,
          leaderboard_prizePool: data.content.prizePool,
          leaderboard_stakes: data.content.stakes,
          leaderboard_minVipPoints: data.content.minVipPoints,
          leaderboard_noOfWinners: data.content.noOfWinners,
        };

      case "dailyUpdateLockedBonus":
        return {
          player_name: data.content.name,
          player_lockedDataTable: data.content.dailyBonusDetails,
        };

      case "claimBonusMails":
        return {
          player_name: data.content.name,
          player_lockedClaimAvailble: data.content.claimBonusTable,
        };

      // add more cases here
      case "welcome": // dont use break here
        return {};
      default:
        return {
          player_name: data.userName || "Poker-Player",
          player_verify_link: data.verifyLink,
          player_link_title: data.linkTitle || "Click here to verify your mail",
        };
    }
  }

  async checkPlayerStateWithEmail(playerEmail) {
    const user = await this.userModel.findOne({ emailId: playerEmail });
    if (!user) {
      throw new BadRequestException("Invalid user email");
    }
    return user;
  }
}
