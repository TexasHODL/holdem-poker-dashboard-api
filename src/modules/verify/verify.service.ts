import { CrudService } from '@/core/services/crud/crud.service';
import { DBModel, InjectDBModel } from '@/database/connections/db';
import { AdminDBModel, InjectAdminModel } from '@/database/connections/admin-db';
import { BadRequestException, Injectable, Redirect, HttpException } from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';
import * as configConstants from "@/shared/constants/configConstants";
import stateOfX from '@/shared/constants/StateOfX';
import keySets from '@/shared/constants/keysDictionaryWeb';
import popupTextManager from '@/shared/constants/popupTextManager';
import { sendMailWithHtmlVerify, sendOtp, sendMailWithHtml, sendMailWithHtmlForgot } from '@/v1/controller/scratchCard/sendMail';
import { parseStringToObjectId } from '@/shared/helpers/mongoose';
import { encrypt } from '@/v1/helpers/crypto';
@Injectable()
export class VerifyService extends CrudService<any> {
    constructor(
        @InjectDBModel(DBModel.User)
        protected readonly model: Model<any>,
        @InjectAdminModel(AdminDBModel.BonusCollection)
        protected readonly bonusCollection: Model<any>,
        @InjectDBModel(DBModel.PendingPasswordReset)
        protected readonly pendingPasswordResets: Model<any>,
        @InjectAdminModel(AdminDBModel.Affiliates)
        protected readonly affiliatesCollection: Model<any>,
    ) {
        super(model);
    }

    async resendEmailVerificationLink (params) {
        console.log("inside resendEmailVerificationLink", params);
        var activityParams: any = {};
        activityParams.data = {};
        var activityCategory = stateOfX.profile.category.profile;
        var activitySubCategory = stateOfX.profile.subCategory.emailVerify;
        activityParams.rawInput = params;
        activityParams.playerId = params.playerId;
        let validate = this.validateKeySets('Request', 'user', 'resendEmailVerificationLink', params);
        console.log("validate: ", validate);
        if (validate.success) {
            var query: any = {};
            var query1: any = {};
            var updateKeys: any = {};
            if (params.playerId) {
                query.playerId = params.playerId;
                query1.emailId = params.emailId.toString();
            } else {
                return ({ success: false, info: validate.info });
            }
            updateKeys.emailId = params.emailId;
            updateKeys.emailVerificationToken = this.createUniqueId(0);
            updateKeys.isEmailVerificationTokenExpire = false;
            console.log('query object is in resendEmailVerificationLink', query);
            let user = await this.model.findOne(query1);
            if (!user) {
                activityParams.comment = 'Not able to find user dbError';
                activityParams.rawResponse = { success: false, info: 'dbError not able to find user' };
                this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.error);
                return ({ success: false, info: popupTextManager.dbQyeryInfo.DB_INVALID_USER_INFO, isRetry: false, isDisplay: true, channelId: '' });
            }
            if (user != null) {
                if (user.playerId == params.playerId) {
                    activityParams.data.emailId = params.emailId;
                    activityParams.data.prevIsEmailVerificationTokenExpire = user.isEmailVerificationTokenExpire;
                    activityParams.data.emailVerificationToken = updateKeys.emailVerificationToken;
                    var emailVerificationLink = process.env.PROTOCOL + process.env.EMAIL_HOST + ':' + process.env.EMAIL_PORT + '/verifyEmail/?token=' + updateKeys.emailVerificationToken;
                    var mailData = this.createResendEmailVerificationLinkData({ link: emailVerificationLink, emailId: params.emailId });
                    let sendMail: any = await sendMailWithHtmlVerify(mailData);
                    console.log("sendMail===== ", sendMail);
                        
                    let updateUser = await this.model.update(query, { $set: updateKeys });
                    if (updateUser) {
                        activityParams.comment = 'Verification Email sent to user successfully';
                        activityParams.rawResponse = { success: true, info: 'emailVerificationLink  sent to email successfully' };
                        this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.completed);
                        activityParams.data.prevIsEmailVerificationTokenExpire = false;
                        return ({ success: true, info: popupTextManager.falseMessages.SUCCESS_SENT_EMAILVERFICATIONLINK, isRetry: false, isDisplay: false, channelId: '' });

                    } else {
                        activityParams.comment = 'Not able to update email verification token in db';
                        activityParams.rawResponse = { success: false, info: popupTextManager.dbQyeryInfo.DB_ERROR_UPDATE_USER_SEND_MAIL };
                        this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.error);
                        return ({ success: false, info: popupTextManager.dbQyeryInfo.DB_ERROR_UPDATE_USER_SEND_MAIL, isRetry: false, isDisplay: false, channelId: '' });
                    }
                    //   if (sendMail?.success) {
                    //   } else {
                    //     activityParams.comment = 'Mandrill Error not able to send verification email';
                    //     activityParams.rawResponse = { success: false, info: 'not able to send email error occoured by mandrill' };
                    //     this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.error);
                    //     return ({ success: false, info: popupTextManager.falseMessages.MANDRILL_ERROR_SEND_EMAIL, isRetry: false, isDisplay: false, channelId: '' });
                    //   }
                } else {
                    activityParams.comment = 'Email Id already attached to other account';
                    activityParams.rawResponse = { success: false, info: 'email Id already attached to other account' };
                    this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.error);
                    return ({ success: false, info: popupTextManager.falseMessages.EMAILl_AlREADY_EXIST_ERROR, isRetry: false, isDisplay: false, channelId: '' });
                }
            } else {
                let user1 = await this.model.findOne(query);
                if (user1) {
                    activityParams.data.emailId = updateKeys.emailId;
                    activityParams.data.prevIsEmailVerificationTokenExpire = user1.isEmailVerificationTokenExpire;
                    activityParams.data.emailVerificationToken = updateKeys.emailVerificationToken;
                    var emailVerificationLink = process.env.PROTOCOL + process.env.EMAIL_HOST + ':' + process.env.EMAIL_PORT + '/verifyEmail/?token=' + updateKeys.emailVerificationToken;
                    var mailData = this.createResendEmailVerificationLinkData({ link: emailVerificationLink, emailId: updateKeys.emailId, userName: user1.userName });
                    let sendMail: any = await sendMailWithHtmlVerify(mailData);
                    let updateUser = await this.model.update(query, { $set: updateKeys }); 

                    if (updateUser) {
                        activityParams.comment = 'Verification Email sent to user successfully';
                        activityParams.rawResponse = { success: true, info: 'emailVerificationLink  sent to email successfully' };
                        this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.completed);
                        activityParams.data.prevIsEmailVerificationTokenExpire = false;
                        return ({ success: true, info: popupTextManager.falseMessages.SUCCESS_SENT_EMAILVERFICATIONLINK, isRetry: false, isDisplay: false, channelId: '' });
                    } else {
                        activityParams.comment = 'Not able to update email verification token in db';
                        activityParams.rawResponse = { success: false, info: popupTextManager.dbQyeryInfo.DB_ERROR_UPDATE_USER_SEND_MAIL };
                        this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.error);
                        return ({ success: false, info: popupTextManager.dbQyeryInfo.DB_ERROR_UPDATE_USER_SEND_MAIL, isRetry: false, isDisplay: false, channelId: '' });
                    }
                    //   if (sendMail?.success) {
                    //   }
                }
            }
        } else {
            console.log(validate.info);
            return ({ success: false, info: validate.info });
        }
    }

    async resendVerificationLinkDasboard (params) {
        console.log("inside resendVerificationLinkDasboard", params);
        await this.checkMailAlreadyVerified(params);
        await this.updateEmailVerificationToken(params);
        await this.sendVerificationLinkToMail(params);

        return ({success: true, result: params});
    }

    async verifyEmail (params, res) {
        console.log("inside verifyEmail", params);
        var msgData: any = {};
        var activityParams: any = {};
        activityParams.data = {};
        var activityCategory = stateOfX.profile.category.profile;
        var activitySubCategory = stateOfX.profile.subCategory.emailVerify;
        activityParams.rawInput = params;
        let validate = this.validateKeySets('Request', 'user', 'verifyEmail', params);
        if (validate.success) {
            if (params.token) {
                var query: any = {};
                var updateKeys: any = {};
                query.emailVerificationToken = params.token;
                updateKeys.isEmailVerified = true;
                updateKeys.isEmailVerificationTokenExpire = true;
                updateKeys.isNewUser = false;
                updateKeys.isBlocked = false;
                updateKeys.status = 'Active';
                let user = await this.model.findOne(query);
                console.log('user in find user in verify email is in user.js', JSON.stringify(user));
                if (user) {
                    activityParams.playerId = user.playerId;
                    if (!user.isEmailVerificationTokenExpire) {
                        activityParams.data.prevIsEmailVerificationTokenExpire = user.isEmailVerificationTokenExpire;
                        let updateUser = await this.model.update(query, { $set: updateKeys });
                        if (updateUser) {
                            var query: any = {};
                            query.status = 'Live';
                            query.bonusCodeType = {};
                            query.bonusCodeType.type = "signUp";
                            let findBonus = await this.findBonus(query);
                            if (findBonus.length > 0 && user.isOrganic && user.isNewUser) {
                                msgData.msg = 'Hello ' + user.userName + ', \nFor your first deposit with us, Get upto ' + (findBonus[0].instantBonusPercent + findBonus[0].lockedBonusPercent) + 'BONUS.\n USE CODE: ' + findBonus[0].codeName + '\n Visit www.pokersd.com';
                                let sendOtp = await this.sendOtpFunction(msgData);
                                var content: any = {};
                                content.playerName = user.firstName + "(" + user.userName + ")";
                                content.bonusPercent = findBonus[0].instantBonusPercent + findBonus[0].lockedBonusPercent;
                                content.bonusCode = findBonus[0].codeName;
                                content.date = new Date(findBonus[0].validTill + (330 * 60 * 1000)).toLocaleString();
                                var mailData = this.createMailData({ content: content, toEmail: user.emailId, from_email: process.env.FROM_EMAIL, subject: "Welcome to PokerSD", template: 'signUpBonus' });
                                let sendMail: any = await sendMailWithHtml(mailData);
                                if (sendMail?.success) {
                                    console.log("Mail sent");
                                } else {
                                    console.log("Mail not sent");
                                }
                            } else {
                                console.log("\n\nNo Signup bonus found");
                            }
                            activityParams.comment = 'email verified successfully';
                            activityParams.rawResponse = { success: true, info: 'email verified successfully' };
                            this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.completed);
                            activityParams.data.postIsEmailVerificationTokenExpire = true;
                    
                            var redirectLink = process.env.PROTOCOL + "texashodl.net/emailVerify?status=201";
                            return res.redirect(redirectLink);
                        } else {
                            activityParams.comment = 'user not found of this token in update user';
                            activityParams.rawResponse = { success: false, info: 'no user find in update' };
                            this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.error);
                            return res.json({ success: false, isRetry: false, isDisplay: true, channelId: ' ', info: popupTextManager.dbQyeryInfo.DBNOTUPDATEDUSER_VALIDATEKEYSETS_VERIFYEMAIL_USERCONTROLLER_USER });
                        }
                    } else {
                        activityParams.comment = 'email verification token expired';
                        activityParams.rawResponse = { success: false, info: 'email verification token expired' };
                        this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.error);
                        var redirectLink = process.env.PROTOCOL + "texashodl.net/emailVerify?status=201";
                        return res.redirect(redirectLink);
                    }
                } else {
                    activityParams.comment = 'no user found in verify email for this token';
                    activityParams.rawResponse = { success: false, info: 'no user found in verify email for this token' };
                    this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.error);
                    return res.json({ success: false, info: 'no user found in verify email for this token' });
                }
            } else {
                activityParams.comment = 'no token found in verifyEmail';
                activityParams.rawResponse = { success: false, info: 'no token found in verifyEmail' };
                this.logUserActivity(activityParams, activityCategory, activitySubCategory, stateOfX.profile.activityStatus.error);
                return res.json({ success: false, isRetry: false, isDisplay: false, channelId: ' ', info: popupTextManager.falseMessages.NOTOKENFOUNDINEMAIL_VALIDATEKEYSETS_VERIFYEMAIL_USERCONTRO2LLER_USER });
            }
        } else {
            return res.json({ success: false, info: validate.info });
        }
    }

    async websiteSendMail (params) {
        console.log("inside websiteSendMail", params);
        var mailData = params.mailData;
        let sendMail = await sendMailWithHtmlForgot(mailData);
        console.log("sendMail: ", sendMail);
        if (sendMail?.success) {
            await this.deletePlayerReset(params);
            return ({success: true, result: mailData});
        } else {
            return ({success: false, info: "Can't send email"});
        }
    }

    async resetPasswordPlayer (params) {
        console.log("inside resetPasswordPlayer", params);
        params.password = params.password || '';
        if (!(params.password.length >= 6 && params.password.length <= 25)) {
            return ({success: false, info: popupTextManager.falseMessages.GETCONNECTOR_INVALIDPASSWORD_GATEHANDLER})
        }

        await this.findPlayerReqWithToken(params);
        await this.findPlayerWithId(params);
        await this.updatePlayerPasswordInDb(params);
        await this.deletePlayerResetReq(params);

        params.success = true;
        return ({ success: true, result: params });
    }

    async forgotPasswordUser (params) {
        console.log("inside forgotPasswordUser", params);
        await this.findPlayerWithEmail(params);
        await this.sendPasswordMailToPlayer(params);
        await this.addTempKeyInPlayerDb(params);

        params.success = true;
        var infoResult = "Email sent to reset password."
        return ({success: false/*because - client needs to display response*/, successDashboard: true, isDisplay: true, info: infoResult})
    }

    async checkTokenResetExpried (params) {
        console.log("inside checkTokenResetExpried", params);
        let findPasswordResetReqInDb = await this.pendingPasswordResets.findOne({ passwordResetToken: params.token });
        if (findPasswordResetReqInDb) {
            return ({success: true})
        } else {
            return ({success: false})
        }
    }

    async addTempKeyInPlayerDb (params) {
        console.log('Inside addTempKeyInPlayerDb ', params)
        var query: any = {}
        query.passwordResetToken = params.passwordResetToken
        query.playerId = params.id
        query.createdAt = Number(new Date())
        let addPasswordResetExpiryKeyInDb = await this.pendingPasswordResets.create(query);
        if (addPasswordResetExpiryKeyInDb) {
            return params
        } else {
            return ({success: false, info: 'Unable to add key for password reset expire.'})
        }
    }

    async sendPasswordMailToPlayer (params) {
        console.log("inside sendPasswordMailToPlayer", params);
        var content = 'Your new password is ' + params.password
        params.passwordResetToken = this.createUniqueId(0)
        console.log('resetPasswordToken is ', params.passwordResetToken)
        var passwordLink = process.env.PROTOCOL + process.env.EMAIL_HOST + ':' + process.env.EMAIL_FORGOT + '/resetPasswordPlayer/' + params.passwordResetToken + '/0'
        var mailData = {
            to_email: params.emailId,
            subject: 'Reset password mail | Poker',
            template: 'forgot',
            userName: (params.userName || 'Player'),
            resetPasswordLink: passwordLink
        }
        console.log('The maildata in sendPasswordMailToPlayer is ', mailData)
        let sendMail = await sendMailWithHtmlForgot(mailData);
        await this.deletePlayerReset(params)
        if (sendMail?.success) {
            return params;            
        } else {
            return ({ success: false, info: "Can't send email" });
        }
    }

    async findPlayerWithEmail (params) {
        console.log('Inside findPlayerWithEmail the params is ', params)
        params.emailId = params.emailId || ''
        params.emailId = params.emailId.trim()
        params.emailId = params.emailId.toLowerCase()
        var filter = {
            emailId: params.emailId
        }
        let findPlayerWithEmail = await this.model.findOne(filter);
        if (findPlayerWithEmail) {
            if (findPlayerWithEmail.isEmailVerified) {
                console.log('the result found in findPlayerWithEmail is', findPlayerWithEmail)
                params.id = parseStringToObjectId(findPlayerWithEmail._id)
                params.userName = findPlayerWithEmail.userName;
                params.playerId = findPlayerWithEmail.playerId;
                console.log('params in findPlayerWithEmail----------', params)
                return params;
            } else {
                return ({ success: false, info: 'You have not verified your email yet, please verify your email' })
            }
        } else {
            console.log('No data found for such email')
            return ({ success: false, info: 'No data found for such email.' })
        }
    }

    async deletePlayerResetReq (params) {
        console.log("inside deletePlayerResetReq", params);
        let deletePasswordResetReqInDb: any = await this.pendingPasswordResets.deleteOne({ playerId: params.playerId, passwordResetToken: params.id });
        if (deletePasswordResetReqInDb) {
            params.id = deletePasswordResetReqInDb.playerId;
            return params;
        } else {
            return params
        }
    }

    async deletePlayerReset (params) {
        console.log("inside deletePlayerReset", params);
        let deletePasswordResetReqInDb: any = await this.pendingPasswordResets.deleteMany({ playerId: params.playerId });
        if (deletePasswordResetReqInDb) {
            params.id = deletePasswordResetReqInDb.playerId;
            return params;
        } else {
            return params
        }
    }

    async updatePlayerPasswordInDb (params) {
        console.log('Inside updatePlayerPasswordInDb the params is ', params)
        var password = params.password
        var encrypted = encrypt(password)
        console.log('the result from encrypted pass is', encrypted)
        if (encrypted.success) {
            params.password = encrypted.result
            var query = {
                emailId: params.emailId
            }
            var updateKeys = {
                password: params.password,
                isEmailVerified: true
            }
            console.log('updateKeys is ', updateKeys)
            console.log(params.password)
            let updatePasswordInDb = await this.model.update(query, { $set: updateKeys });
            if (updatePasswordInDb) {
                return params
            } else {
                return ({success: false, info: 'Something went wrong!!'})
            }
        }
    }

    async findPlayerWithId (params) {
        console.log('Inside findPlayerWithId the params is ', params);
        var filter = {
            _id: parseStringToObjectId(params.playerId)
        }
        let findPlayerWithId = await this.model.findOne(filter);
        if (findPlayerWithId) {
            console.log('the result found in findPlayerWithId is', findPlayerWithId)
            params.emailId = findPlayerWithId.emailId
            return params;
        } else {
            console.log('No data found for such id')
            return ({ success: false, info: 'No data found for such id' })
        }
    }

    async findPlayerReqWithToken (params) {
        console.log("inside findPlayerReqWithToken", params);
        var expireDurationMinutes = configConstants.EXPIRE_DURATIONMINUTE // 24*60 // TEMP
        let findPasswordResetReqInDb = await this.pendingPasswordResets.findOne({ passwordResetToken: params.id });
        if (findPasswordResetReqInDb) {
            params.playerId = findPasswordResetReqInDb.playerId;
            return params;
        } else {
            return ({ success: false, info: "Request not found/used already." })
        }
    }

    // async emailVerify (params) {
    //     console.log("inside emailVerify", params);
    //     await this.checkMailAlreadyVerified(params);
    //     await this.updateEmailVerify(params);
    //     await this.sendVerificationLinkToEmail(params)
    // }

    // async sendVerificationLinkToEmail (params) {
    //     console.log("inside sendVerificationLinkToEmail", params);
    //     let emailVerificationLink;
    //     if (params.isEmailVerified) {
    //         emailVerificationLink = process.env.PROTOCOL + process.env.EMAIL_HOST + "/poker-website/emailVerify/?status=201"
    //     } else {
    //         emailVerificationLink = process.env.PROTOCOL + process.env.EMAIL_HOST + "/emailVerify/?token="+params.emailVerificationToken + "&status=200"
    //     }
    //     var mailParams: any = {}
    //     mailParams.from_email = stateOfX.mailMessages.from_emailLogin.toString()
    //     mailParams.to_email = params.emailId
    //     mailParams.userName = params.userName
    //     mailParams.verifyLink = emailVerificationLink
    //     mailParams.linkTitle = "Click here to verify your mail"
    //     mailParams.content    = stateOfX.mailMessages.mail_contentEmailVerification.toString() + params.emailVerificationLink
    //     mailParams.subject = stateOfX.mailMessages.mail_subjectEmailVerification.toString()
    //     let sendMail = await sendMailWithHtmlVerify(mailParams);
    //     console.log("sendMail====11 ", sendMail);
    //     if (sendMail?.success) {
    //         let findUser = await this.model.findOne({ userName: params })
    //     }
    // }

    async updateEmailVerify (params) {
        console.log("inside updateEmailVerify", params);
        var emailVerificationToken = this.createUniqueId(10)
        var query: any = {}
        query.emailId = params.emailId
        var updateKeys: any = {}
        updateKeys.isEmailVerificationToken = emailVerificationToken;
        let updateUser = await this.model.update(query, { $set: updateKeys });
        if (updateUser) {
            params.emailVerificationToken = emailVerificationToken;
            return params;
        } else {
            return ({success: false, info : 'Unable to update emailVerificationToken'})
        }
    }


    validateKeySets (type, fileName, methodName, clientKeys) {
        let validateResponse = keySets.validate(type, fileName, methodName, clientKeys);
        if (validateResponse.success) {
            return validateResponse;
        } else {
            return ({ success: false, info: validateResponse.info });
        }
    };

    createUniqueId (len) {
        if (len > 0) {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < (len || 15); i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        } else {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < 15; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }
    };

    logUserActivity (params, category, subCategory, status) {
        var activityObject: any = {};
        activityObject.playerId 	 = params.playerId;
        activityObject.category 	 = category;
        activityObject.subCategory = subCategory;
        activityObject.status 		 = status;
        activityObject.comment 		 = params.comment;
        activityObject.createdAt 	 = Number(new Date());
        activityObject.channelId 	 = (params.channelId || "");
        if(!!params.rawInput) {
            activityObject.rawInput = params.rawInput;
        }
        if(!!params.rawResponse) {
            activityObject.rawResponse = params.rawResponse;
        }
        if(category === stateOfX.profile.category.profile) {
            activityObject[stateOfX.profile.category.profile] = params.data;
        } else if(category === stateOfX.profile.category.transaction) {
            //set transaction data
        } else if(category === stateOfX.profile.category.game) {
            //set game data
        } else if(category === stateOfX.profile.category.tournament) {
            //set tournament data
        }
        // activityObject = _.omit(activityObject,"self");
        // activityObject = _.omit(activityObject,"session");
        this.insertInDb(activityObject);
    }

    insertInDb (activityObject) {
        return;
    }

    createResendEmailVerificationLinkData (params) {
        var mailData: any = {};
        mailData.from_email = stateOfX.mailMessages.from_email.toString();
        mailData.to_email = params.emailId;
        mailData.template = 'welcome';
        mailData.verifyLink = params.link;
        mailData.userName = params.userName || params.emailId;
        mailData.subject = stateOfX.mailMessages.mail_subjectEmailVerification.toString();
        mailData.linkTitle = "Click here to verify your mail";
        console.log('mailData is in createResendEmailVerificationLinkData - ' + JSON.stringify(mailData));
        return mailData;
    };

    createMailData (params) {
        var mailData: any = {};
        console.log('create mail data params', params);
        mailData.from_email = stateOfX.mailMessages.from_email.toString();
        mailData.to_email = params.toEmail;
        mailData.subject = params.subject;
        mailData.content = params.content;
        mailData.template = params.template;
        console.log('mailData is in createMailData - ' + JSON.stringify(mailData));
        return mailData;
    };

    async checkMailAlreadyVerified (params) {
        console.log("inside checkMailAlreadyVerified", params);
        var query: any = {};
        query.emailId = params.emailId;
        query.isOrganic = true;
        query.isEmailVerified = true;
        let user = await this.model.findOne(query);
        if (user) {
            return ({success: false, info: 'Email already verified'});
        } else {
            return params;
        }
    }

    async updateEmailVerificationToken (params) {
        console.log("inside updateEmailVerificationToken", params);
        var emailVerificationToken = this.createUniqueId(10);
        var query: any = {};
        query.emailId = params.emailId;
        var updateKeys: any = {};
        updateKeys.emailVerificationToken = emailVerificationToken;
        let updateUser = await this.model.update(query, { $set: updateKeys });
        if (updateUser) {
            params.emailVerificationToken = emailVerificationToken;
            return params;
        } else {
            return ({success: false, info : 'Unable to update emailVerificationToken'});
        }
    }

    async sendVerificationLinkToMail (params) {
        console.log("inside sendVerificationLinkToMail", params);
        var emailVerificationLink = process.env.PROTOCOL+process.env.EMAIL_HOST + ":" +process.env.EMAIL_PORT + "/verifyEmail/?token="+params.emailVerificationToken;
        var mailParams: any = {};
        mailParams.from_email = stateOfX.mailMessages.from_emailLogin.toString();
        mailParams.to_email = params.emailId;
        mailParams.userName = params.userName;
        mailParams.verifyLink = emailVerificationLink;
        mailParams.linkTitle = "Click here to verify your mail";
        mailParams.content    = stateOfX.mailMessages.mail_contentEmailVerification.toString() + params.emailVerificationLink;
        mailParams.subject = stateOfX.mailMessages.mail_subjectEmailVerification.toString();
        let sendMail: any = await sendMailWithHtmlVerify(mailParams);
        if (sendMail?.success) {
            console.log("mail sent successfully", sendMail);
            let findUser: any = this.model.findOne({ userName: params.userName });
            if (findUser) {
                params.password = findUser.password;
                return; 
            }
        } else {
            return ({success: false, info: 'Mail not sent'});
        }
    }

    async findBonus (query) {
        console.log("inside findBonus", query);
        var newQuery: any = {};
        if (query.profile) {
            newQuery.profile = query.profile;
        }
        if (query.codeName) {
            newQuery.codeName = query.codeName;
        }
        if (query.bonusPercent) {
            newQuery.bonusPercent = query.bonusPercent;
        }
        if (query.bonusCodeType) {
            newQuery['bonusCodeType.type'] = query.bonusCodeType.type;
        }
        if (query.bonusCodeCategoryType) {
            newQuery['bonusCodeCategory.type'] = query.bonusCodeCategoryType;
        }
        if (query.status) {
            newQuery.status = query.status;
        }
        if (query.createdBy) {
            newQuery.createdBy = query.createdBy;
        }
        if (query._id) {
            newQuery._id = parseStringToObjectId(query._id);
        }
        var skip = query.skip || 0;
        var limit = query.limit || 20;

        let bonus = await this.bonusCollection.find(newQuery).skip(skip).limit(limit).sort({ createdAt: -1 });
        return bonus;
    }

    async sendOtpFunction (params) {
        console.log("inside sendOtpFunction", params);
        var params2 = {
            mobileNumber: '91' + params.mobileNumber,
            msg: params.msg
        };
        let resSendOtp: any = await sendOtp(params2);
        console.log("resSendOtp: ", resSendOtp);
        return resSendOtp
    }

    async findUserWithId (params) {
        console.log("inside findUserWithId", params);
        var filter = {
            _id: parseStringToObjectId(params.id)
        }
        
        const findUserWithId = await this.affiliatesCollection.findOne(filter);
        if (findUserWithId) {
            console.log('the result found in findUserWithId is', findUserWithId)
            params.userName = findUserWithId.userName
            return params;
        } else {
            console.log('No data found for such id')
            return ({ success: false, info: 'No data found for such id' })
        }
    }

    async updateUserPasswordInDb (params) {
        console.log('Inside updatePlayerPasswordInDb the params is ', params)
        var password = params.password
        var encrypted = encrypt(password)
        console.log('the result from encrypted pass is', encrypted)
        if (encrypted.success) {
            params.password = encrypted.result
            var query = {
                userName: params.userName
            }
            var updateKeys = {
                password: params.password,
            }
            console.log('updateKeys is ', updateKeys)
            console.log(params.password)
            let updatePasswordInDb = await this.affiliatesCollection.update(query, { $set: updateKeys });
            if (updatePasswordInDb) {
                return params
            } else {
                return ({success: false, info: 'Something went wrong!!'})
            }
        }
    }

    async resetPassword (params) {
        console.log("inside resetPassword", params);

        params.password = params.password || '';
        if (!(params.password.length >= 6 && params.password.length <= 25)) {
            return ({success: false, info: popupTextManager.falseMessages.GETCONNECTOR_INVALIDPASSWORD_GATEHANDLER})
        }

        if (params.password !== params.newPassword) {
            throw new HttpException("Confirm password field values don't match", 400);
        }

        await this.findUserWithId(params);
        await this.updateUserPasswordInDb(params);

        params.success = true;
        return ({ success: true, result: params });
    }
}
