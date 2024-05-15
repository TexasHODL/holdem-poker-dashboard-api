import { isEmpty } from 'lodash';
import { sendParamsType, simpleMailParamsType } from './scratchCardInterface';
import { findPlayerToSendMail, findPlayerToSendMobie } from '../../model/queries/scratchCard';
import nodemailer from 'nodemailer';
import { Constants } from '../../helpers/configConstants';
import request from "request";

const checkPlayerStateWithEmail = async (playerEmail: string) => {
  console.log('inside checkPlayerState with email ====');
  const query = { emailId: playerEmail };
  const response: any = await findPlayerToSendMail(query);
  console.log('response ===', response);
  if (!isEmpty(response)) {
    return {
      success: true,
    };
  } else {
    return {
      success: false,
    };
  }
};

const checkPlayerStateWithMobile = async (playerMobile) =>{
	console.log("inside checkPlayerStateWithMobile",playerMobile);
	const query: any = {};
	if(playerMobile.length == 10) query.mobileNumber = playerMobile;
	else query.mobileNumber = playerMobile.substring(2);
  const findUser = await findPlayerToSendMobie(query);
  console.log('responsefindUser ===', findUser);
  if (!isEmpty(findUser)) {
    return ({success :findUser.isBlocked});
  } else {
    return ({success : false});
  }
};

export const sendMailWithHtml = async (data: sendParamsType) => {
  console.log('inside sendMail with html');
  const checkStatePlayer = await checkPlayerStateWithEmail(data.to_email);
  console.log('checkStatePlayer====', checkStatePlayer);
  if (checkStatePlayer.success) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "admin@texashodl.net",
        pass: "cyvv vznf kqxr itcj",
   },
    });

    // need to add  substitution field in mailOptions.
    const mailOptions = {
      from: data.from_email || process.env.FROM_EMAIL,
      to: data.to_email,
      subject: data.subject || `Welcome to ${Constants.GAME_NAME_TEXT}`,
      html: '<p> write your message here </p>',
    };

    await transporter
      .sendMail(mailOptions)
      .then((response) => {
        return {
          success: true,
          info: 'mail sent successfully',
        };
      })
      .catch((err) => {
        return {
          success: false,
          info: 'mail not sent',
        };
      });
  } else {
    return {
      success: false,
      info: 'User not found! mail not sent',
    };
  }
};

export const sendSimpleMail = async (params: simpleMailParamsType) => {
  console.log('inside sendSimpleMail ==');
  const checkStatePlayer = await checkPlayerStateWithEmail(params.to_email);
  console.log('checkStatePlayer====', checkStatePlayer);
  if (checkStatePlayer.success) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'sender@gmail.com',
        pass: '111111',
      },
    });

    // need to add  substitution field in mailOptions.
    const mailOptions = {
      from: params.from_email || process.env.FROM_EMAIL,
      to: params.to_email,
      subject: params.subject || `Welcome to ${Constants.GAME_NAME_TEXT}`,
      html: `${params.content}`,
    };

    await transporter
      .sendMail(mailOptions)
      .then((response) => {
        return {
          success: true,
          info: 'mail sent successfully',
        };
      })
      .catch((err) => {
        return {
          success: false,
          info: 'mail not sent',
        };
      });
  } else {
    return {
      success: false,
      info: 'User not found! mail not sent',
    };
  }
};

export const sendMailWithHtmlVerify = async (params) => {
  console.log("datasendMailWithHtml ", params);
  const checkStatePlayer = await checkPlayerStateWithEmail(params.to_email);
  console.log("checkStatePlayer: ", checkStatePlayer);
  console.log("========================aaa");
  
  console.log("heeleell")
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "admin@texashodl.net",
      pass: "cyvv vznf kqxr itcj",
    },
    tls: { 
      rejectUnauthorized: false
    },
  });
  console.log("heeleell22")
  let mailOptions = {
    from: "support@creatiosoft.com" || process.env.FROM_EMAIL,
    to: params.to_email, // list of receivers
    subject: params.subject || "Welcome to"+ "Holdem Poker", // Subject line
    html: `
      <p>Dear ${params.userName}</p>
      <p>Welcome to <b>Holdem Poker</></p>
      <p>We have saved you a seat at the tables.</p>
      <a href=${params.verifyLink}>${params.linkTitle}</a>
      <p>or try pasting this link into your browser :</p>
      <a href=${params.verifyLink}>${params.verifyLink}</a>
      <p>Regards,</p>
      <p>Texas Holdl<p>
    `
  };

  await transporter
    .sendMail(mailOptions)
    .then((response) => {
      console.log("response====", response);
      return {
        success: true,
        info: 'mail sent successfully',
      };
    })
    .catch((err) => {
      return {
        success: false,
        info: 'mail not sent',
      };
    });
  // if (checkStatePlayer.success === true) {
  // } else {
  //   console.log("aaaaa");
    
  //   return {
  //     success: false,
  //     info: 'User not found! mail not sent',
  //   };
  // }
};

export const sendOtp = async (data) => {
  const checkStatePlayer = await checkPlayerStateWithMobile(data.mobileNumber);
  if (!checkStatePlayer.success) {
    console.log("Inside sharedModule sendOtp" + JSON.stringify(data));
    // var data = {msg : "Test Message", mobileNumber: '919555859576'}
    // callback({success : true})
    var reqObject = {
      // "authentication": {
      //   "username": systemConfig.sendSmsUsername,
      //   "password": systemConfig.sendSmsPassword
      // },
      // "messages": [{
      //   "sender": systemConfig.sendSmsSender,
      //   "text": data.msg,
      //   "recipients": [{
      //     "gsm": data.mobileNumber
      //   }]
      // }]
    };
    console.log("request reqObject in sendOtp - " + JSON.stringify(reqObject));
    var sendUrl= "https://japi.instaalerts.zone/httpapi/QueryStringReceiver?ver=1.0&key=ZHVhZ2FtaW5nOlBva2Vyc2RAMTIz&encrpt=0&dest="+data.mobileNumber+"&send=POKRSD&text="+data.msg; //URL to hit
    request({
      url: sendUrl, //URL to hit
      method: 'POST', //Specify the method
      json : reqObject
    }, function(error, response, body){
      console.log("in the mail send api--"+error+'\n-->'+JSON.stringify(response)+'\n-->'+body);
        if(error) {
          // console.log(error, response.statusCode, body);
          console.log(error);
          return ({success : false});
        } else {
          console.log(response,"body.result in sharedModule sendOtp", body);
          if(response.statusCode == 200) {
            return ({success : true});
          } else {
            return ({success : false, result:"Error in sending message"});
          }
        }
    });
  }
}

export const sendMailWithHtmlForgot = async (params) => {
  console.log("datasendMailWithHtml ", params);
  const checkStatePlayer = await checkPlayerStateWithEmail(params.to_email);
  console.log("checkStatePlayer: ", checkStatePlayer);
  if (checkStatePlayer.success) {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: "admin@texashodl.net",
                pass: "cyvv vznf kqxr itcj",
      },
      tls: { 
        rejectUnauthorized: false
      },
    });

    let mailOptions = {
      from: params.from_email || "support@creatiosoft.com",
      to: params.to_email, // list of receivers
      subject: params.subject || "Welcome to"+ "Holdem poker", // Subject line
      html: `
        <p>Dear ${params.userName}</p>
        <p>You have requested that your password be reset.</p>
        <p>Kindly visit the link below or copy and paste in your browser to reset the password.</p>
        <a href=${params.resetPasswordLink}>${params.resetPasswordLink}</a>
        <p>Regards,</p>
        <p>Texas Holdl<p>
        `
    };
      
    console.log("mailOptions: ", mailOptions);
    await transporter
      .sendMail(mailOptions)
      .then((response) => {
        console.log("response====", response);
        return {
          success: true,
          info: 'mail sent successfully',
        };
      })
      .catch((err) => {
        console.log("aaaaâ");
        
        return {
          success: false,
          info: 'mail not sent',
        };
      });
  } else {
    return {
      success: false,
      info: 'User not found! mail not sent',
    };
  }
};