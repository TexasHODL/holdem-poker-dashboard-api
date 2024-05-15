import { object, string, TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     ListSpamWordsRequest:
 *       type: object
 *     ListSpamWordsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         info:
 *           type: string
 *         result:
 *           type: array
 *           items:
 *             type: string
 *     UpdateSpamWordRequest:
 *       type: object
 *       properties:
 *         blockedWordsList:
 *           type: object
 *           properties:
 *             blockedWord:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   text:
 *                      type: string
 *         blockedWords:
 *           type: array
 *           items:
 *             type: string
 *             default: "scam"
 *     UpdateSpamWordSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *     CreateLoyaltyPointsRequest:
 *       type: object
 *       properties:
 *         loyaltyLevel:
 *           type: string
 *         levelThreshold:
 *           type: number
 *         percentReward:
 *           type: number
 *     CreateLoyaltyPointsSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             loyaltyLevel:
 *               type: string
 *             levelThreshold:
 *               type: number
 *             percentReward:
 *               type: number
 *             levelId:
 *               type: number
 *             _id:
 *               type: string
 *               default: "62bc33324058f24e6d83beea"
 *             createdAt:
 *               type: string
 *             udpatedAt:
 *               type: string
 *     ListLoyaltyPointsSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: array
 *           items:
 *              type: object
 *              properties:
 *                _id:
 *                   type: string
 *                   default: "62bc33324058f24e6d83beea"
 *                loyaltyLevel:
 *                   type: string
 *                levelThreshold:
 *                   type: number
 *                percentReward:
 *                   type: number
 *                levelId:
 *                   type: number
 *                createdAt:
 *                   type: string
 *                updatedAt:
 *                   type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 400
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: false
 *         info:
 *           type: string
 *     CatchErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 500
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: false
 *         info:
 *           type: string
 *     UpdateLoyaltyPointsRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           default: "62bc33324058f24e6d83beea"
 *         loyaltyLevel:
 *           type: string
 *         levelThreshold:
 *           type: number
 *         percentReward:
 *           type: number
 *         levelId:
 *           type: number
 *         updatedAt:
 *           type: string
 *     UpdateLoyaltyPointsSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *     ListLeaderboardReportRequest:
 *       type: object
 *       properties:
 *         skip:
 *           type: number
 *           default: 0
 *         limit:
 *           type: number
 *           default: 20
 *     ListLeaderboardReportSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: array
 *           default: []
 *     GetLeaderboardReportCountSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: number
 *     CreateBonusCodeRequest:
 *       type: object
 *       properties:
 *         validTill:
 *           type: string
 *         codeName:
 *           type: string
 *         instantBonusPercent:
 *           type: number
 *         lockedBonusPercent:
 *           type: number
 *         instantCap:
 *           type: number
 *         lockedCap:
 *           type: number
 *         bonusCodeType:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             type:
 *               type: string
 *         bonusCodeCategory:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             type:
 *               type: string
 *         minAmount:
 *           type: number
 *         maxAmount:
 *           type: number
 *         loyalityLevel:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             level:
 *               type: number
 *         tag:
 *           type: string
 *         tagDescription:
 *           type: string
 *         createdBy:
 *           type: string
 *         createdAt:
 *           type: string
 *         profile:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             level:
 *               type: number
 *         status:
 *           type: string
 *         totalUsed:
 *           type: number
 *         bonusId:
 *           type: string
 *     CreateBonusCodeSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     UpdateBonusCodeRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         tag:
 *           type: string
 *         tagDescription:
 *           type: string
 *         updatedBy:
 *           type: string
 *         updatedByRole:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             level:
 *               type: number
 *         validTill:
 *           type: string
 *     UpdateBonusCodeSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *     InstantBonusExpireSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *     AddPromotionalBonusRequest:
 *       type: object
 *       properties:
 *         promoCode:
 *           type: string
 *           default: "affiliate"
 *         amount:
 *           type: number
 *     AddPromotionalBonusSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *              _id:
 *                type: string
 *              promoCode:
 *                type: string
 *                default: "affiliate"
 *              amount:
 *                type: number
 *              date:
 *                type: string
 *              updatedAt:
 *                type: string
 *     ListPromotionalBonusSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               promoCode:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *     RemovePromotionalBonusSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               promoCode:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *     CountBonusDepositSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: number
 *     ListBonusDepositSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     BonusHistorySuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: array
 *     GetActiveBonusSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *     CreateScratchCardAffiliateRequest:
 *       type: object
 *       properties:
 *         scratchCardDetails:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               denomination:
 *                 type: number
 *                 default: 5000
 *               quantity:
 *                 type: number
 *                 default: 5
 *               scratchCardType:
 *                 type: string
 *               affiliateId:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               expiresOn:
 *                 type: string
 *               transactionType:
 *                 type: string
 *               createdBy:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   userName:
 *                     type: string
 *                   role:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         default: "admin"
 *                       level:
 *                         type: number
 *                         default: 7
 *                   id:
 *                     type: string
 *     createScratchCardAffiliateSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     GetScratchCardListCountSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: number
 *           default: 0
 *     GetScratchCardListSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     GetScratchCardHistoryCountSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: number
 *           default: 0
 *     GetScratchCardHistorySuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     RejectScratchCardRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         scratchCardType:
 *           type: string
 *         totalAmount:
 *           type: number
 *         isActive:
 *           type: boolean
 *         expiresOn:
 *           type: string
 *         createdBy:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             userName:
 *               type: string
 *             role:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 level:
 *                   type: number
 *             id:
 *               type: string
 *         transactionType:
 *           type: string
 *         emailId:
 *           type: string
 *         playerDetail:
 *           type: object
 *         comment:
 *           type: string
 *         index:
 *           type: string
 *         issuedBy:
 *           type: object
 *         reasonOfRejection:
 *           type: string
 *     RejectScratchCardSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             scratchCardType:
 *               type: string
 *               default: "HIGH-ROLLERS"
 *             detailString:
 *               type: string
 *             code:
 *               type: string
 *             denomination:
 *               type: number
 *             expiresOn:
 *               type: string
 *             createdBy:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 userName:
 *                   type: string
 *                 role:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     level:
 *                       type: number
 *                 id:
 *                   type: string
 *             transactionType:
 *               type: string
 *             issuedBy:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 userName:
 *                   type: string
 *                 role:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     level:
 *                       type: number
 *                 id:
 *                   type: string
 *             status:
 *               type: string
 *             generationId:
 *               type: string
 *             usedBy:
 *               type: string
 *             reasonOfRejection:
 *               type: string
 *             comment:
 *               type: string
 *             _id:
 *               type: string
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *     ApproveScratchCardRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         scratchCardType:
 *           type: string
 *         scratchCardDetails:
 *           type: array
 *           properties:
 *             denomination:
 *               type: number
 *             quantity:
 *               type: number
 *             _id:
 *               type: string
 *         totalAmount:
 *           type: number
 *         isActive:
 *           type: boolean
 *         expiresOn:
 *           type: string
 *         affiliateId:
 *           type: string
 *         createdBy:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             userName:
 *               type: string
 *             role:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 level:
 *                   type: number
 *             id:
 *               type: string
 *         transactionType:
 *           type: string
 *         userLevel:
 *           type: string
 *         emailId:
 *           type: string
 *         affiliateDetail:
 *           type: object
 *           properties:
 *             role:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 level:
 *                   type: number
 *             chipsManagement:
 *               type: object
 *               properties:
 *                 deposit:
 *                   type: number
 *                 withdrawl:
 *                   type: number
 *                 withdrawlCount:
 *                   type: number
 *                 profitCount:
 *                   type: number
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             userName:
 *               type: string
 *             email:
 *               type: string
 *             gender:
 *               type: string
 *             dob:
 *               type: string
 *             mobile:
 *               type: number
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 *             roles:
 *               type: string
 *             status:
 *               type: string
 *             pincode:
 *               type: number
 *             password:
 *               type: string
 *             rakeCommision:
 *               type: number
 *             realChips:
 *               type: number
 *             profit:
 *               type: number
 *             withdrawl:
 *               type: number
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *     ApproveScratchCardSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *     CreateScratchCardHighRollersRequest:
 *       type: object
 *       properties:
 *          playerId:
 *            type: string
 *          totalAmount:
 *            type: number
 *          expiresOn:
 *            type: string
 *          transactionType:
 *            type: string
 *          comment:
 *            type: string
 *          scratchCardType:
 *            type: string
 *          isActive:
 *            type: boolean
 *          createdBy:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              userName:
 *                type: string
 *              role:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                  level:
 *                    type: number
 *              id:
 *                type: string
 *     CreateScratchCardHighRollersSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     findTotalRakeYesterdaySuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             sumOfRake:
 *               type: number
 *     FindPlayerLoginDataRequest:
 *       type: object
 *       properties:
 *         keyForRakeModules:
 *           type: boolean
 *     FindPlayerLoginDataSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             onlinePlayers:
 *               type: number
 *             totalPlayersLoggedInYesterday:
 *               type: number
 *             totalPlayersLoggedInToday:
 *               type: number
 *     findTotalRakeLastWeekSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             sumOfRake:
 *              type: number
 *     findPartialRakeGeneratedDaySuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             partialRakeToday:
 *               type: number
 *             partialRakeYesterday:
 *               type: number
 *     FindPartialRakeGeneratedSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             partialRakeThisWeek:
 *               type: number
 *             partialRakeLastWeek:
 *               type: number
 *             averageRakeThisWeek:
 *               type: number
 *     findTotalChipsAddedSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             totalChipsAddedYesterday:
 *               type: number
 *             totalChipsAddedLastWeek:
 *               type: number
 *             totalchipsAddedPartialToday:
 *               type: number
 *             totalchipsAddedPartialYesterday:
 *               type: number
 *             totalChipsAddedPartialThisWeek:
 *               type: number
 *             totalChipsAddedPartialLastWeek:
 *               type: number
 *     findNewPlayersJoinDataSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             newPlayersToday:
 *               type: number
 *             newPlayersThisMonth:
 *               type: number
 *             newPlayersThisYear:
 *               type: number
 *             allPlayersJoinData:
 *               type: number
 *     CreateLeaderboardRequest:
 *       type: object
 *       properties:
 *          startTime:
 *            type: string
 *          endTime:
 *            type: string
 *          leaderboardName:
 *            type: string
 *          leaderboardType:
 *            type: string
 *          description:
 *            type: string
 *          minVipPoints:
 *            type: number
 *          minHands:
 *            type: number
 *          noOfWinners:
 *            type: numbers
 *          totalPrizePool:
 *            type: number
 *          tables:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                _id :
 *                  type: string
 *                channelName:
 *                  type: string
 *                smallBlind:
 *                  type: number
 *                bigBlind:
 *                  type: number
 *          payout:
 *            type: array
 *            items:
 *              type: number
 *          percentAccumulation:
 *            type: number
 *          createdBy:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              level:
 *                type: number
 *     CreateLeaderboardSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     listLeaderboardSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: array
 *     GetTablesRequest:
 *       type: object
 *       properties:
 *         isActive:
 *           type: boolean
 *         isRealMoney:
 *           type: boolean
 *         channelType:
 *           type: string
 *     GetTablesSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               channelName:
 *                 type: string
 *               smallBlind:
 *                 type: number
 *               bigBlind:
 *                 type: number
 *     DeleteLeaderboardRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         bonusCodeChanged:
 *           type: boolean
 *         leaderboardData:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             leaderboardId:
 *               type: string
 *             leaderboardName:
 *               type: string
 *             leaderboardType:
 *               type: string
 *             startTime:
 *               type: string
 *             endTime:
 *               type: string
 *             status:
 *               type: string
 *             minVipPoints:
 *               type: number
 *             minHands:
 *               type: number
 *             noOfWinners:
 *               type: number
 *             createdBy:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 level:
 *                   type: number
 *             tables:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   channelName:
 *                     type: string
 *                   smallBlind:
 *                     type: number
 *                   bigBlind:
 *                     type: number
 *             payout:
 *               type: array
 *               items:
 *                 type: number
 *             termsCondition:
 *               type: array
 *               items:
 *                 type: string
 *             totalPrizePool:
 *               type: number
 *             usedInSet:
 *               type: boolean
 *             percentAccumulation:
 *               type: number
 *             description:
 *               type: string
 *             minRake:
 *               type: number
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *     DeleteLeaderboardSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     EditLeaderboardRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         leaderboardName:
 *           type: string
 *         leaderboardType:
 *           type: string
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 *         description:
 *           type: string
 *         minVipPoints:
 *           type: number
 *         tables:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               channelName:
 *                 type: string
 *               smallBlind:
 *                 type: number
 *               bigBlind:
 *                 type: number
 *         totalPrizePool:
 *           type: number
 *         percentAccumulation:
 *           type: number
 *         noOfWinners:
 *           type: number
 *         payout:
 *           type: array
 *           items:
 *             type: number
 *         termsCondition:
 *           type: array
 *           items:
 *             type: string
 *         minHands:
 *           type: number
 *         updatedBy:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             level:
 *               type: number
 *     EditLeaderboardSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *     CountDirectEntryHistoryRequest:
 *       type: object
 *       properties:
 *         bonusCode:
 *           type: string
 *     CountDirectEntryHistorySuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: number
 *     DirectEntryPlayerRequest:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *         bonusCode:
 *           type: string
 *     DirectEntryPlayerSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *           default: true
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     DirectEntryHistoryPlayerRequest:
 *       type: object
 *       properties:
 *         skip:
 *           type: number
 *         limit:
 *           type: number
 *         bonusCode:
 *           type: string
 *     DirectEntryHistoryPlayerSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     GetCurrentLeaderboardParticipantsSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     CreateLeaderboardSetRequest:
 *       type: object
 *       properties:
 *         leaderboardSetName:
 *           type: string
 *         leaderboardArray:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               leaderboardId:
 *                 type: string
 *               leaderboardName:
 *                 type: string
 *     CreateLeaderboardSetSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *           properties:
 *             leaderboardSetName:
 *               type: string
 *             leaderboardList:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   leaderboardId:
 *                     type: string
 *                   leaderboardName:
 *                     type: string
 *                   onView:
 *                     type: boolean
 *             leaderboardSetId:
 *               type: string
 *             onView:
 *               type: boolean
 *             _id:
 *               type: string
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *     DeleteLeaderboardSetRequest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         leaderboardSetName:
 *           type: string
 *         leaderboardList:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               leaderboardId:
 *                 type: string
 *               leaderboardName:
 *                 type: string
 *               onView:
 *                 type: boolean
 *         leaderboardSetId:
 *           type: string
 *         onView:
 *           type: boolean
 *         createdAt:
 *           type: string
 *         editedAt:
 *           type: string
 *     DeleteLeaderboardSetSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     GetLeaderboardSpecificDetailsRequest:
 *       type: object
 *       properties:
 *         usedInSet:
 *           type: boolean
 *         projectionFields:
 *           type: object
 *           properties:
 *             leaderboardId:
 *               type: string
 *             leaderboardName:
 *               type: string
 *     GetLeaderboardSpecificDetailsSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               projection:
 *                 type: object
 *                 properties:
 *                   leaderboardId:
 *                     type: string
 *                   leaderboardName:
 *                     type: string
 *     UpdateLeaderboardSetRequest:
 *       type: object
 *       properties:
 *         editedAt:
 *           type: string
 *         leaderboardArray:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               leaderboardId:
 *                 type: string
 *               leaderboardName:
 *                 type: string
 *               onView:
 *                 type: boolean
 *         leaderboardSetId:
 *           type: string
 *     UpdateLeaderboardSetSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     ChangeViewOfSetRequest:
 *       type: object
 *       properties:
 *         leaderboardSetId:
 *           type: string
 *         onView:
 *           type: boolean
 *     ChangeViewOfSetSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     changeViewOfLeaderboardRequest:
 *       type: object
 *       properties:
 *         leaderboardSetId:
 *           type: string
 *         leaderboardId:
 *           type: string
 *         onView:
 *           type: boolean
 *     changeViewOfLeaderboardSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: object
 *     CountLeaderboardSetsSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: number
 *     GetLeaderboardSetsSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           default: 200
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         info:
 *           type: string
 *         result:
 *           type: array
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
