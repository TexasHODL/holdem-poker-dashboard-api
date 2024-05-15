import * as express from 'express';
import cors from 'cors';
import { generateToken } from './helpers/jwt';
import { validateRequest } from './helpers/validate';
import { RESPONSE_CODES } from './constants';
import {
  userAuth,
  checkUserSessionInDb,
  createUser,
  listUser,
  countUsers,
  createNewAffiliate,
  createSubAffiliate,
  listAffiliate,
  listOneAffiliate,
  listSubAffiliate,
  affiliateCount,
  subAffiliateCount,
} from './controller/auth/userController';
import { getCurrentDataOfBalanceSheetForDashboard } from './controller/balanceSheetMgmt/balanceSheet';
import { getAllModules } from './controller/modules/moduleAdmin';
import { getModuleListAff, getModuleListSubAff, getModuleAff } from './controller/modules/moduleAffiliates';
import { protectedRoute } from './helpers/protectedRoute';
//import { getAllModules } from './controller/modules/modulesController';
import {
  createLoyaltyPoints,
  listLoyaltyPoints,
  updateLoyaltyPoints,
} from './controller/loyaltyPoints/loyaltyPointsController';
import {
  listSpamWords,
  updateSpamWord,
} from './controller/spamWords/spamwordsController';
import {
  addPromotionalBonus,
  countBonusDeposit,
  createBonusCode,
  getActiveBonus,
  getBonusHistory,
  instantBonusExpire,
  listBonusDeposit,
  listPromotionalBonus,
  removePromotionalBonus,
  updateBonusCode,
} from './controller/bonusCode/bonusCodeController';
import {
  approveScratchCard,
  createScratchCardAffiliate,
  createScratchCardHighRollers,
  getScratchCardHistory,
  getScratchCardHistoryCount,
  getScratchCardList,
  getScratchCardListCount,
  rejectScratchCard,
} from './controller/scratchCard/scratchCardController';
import {
  getLeaderboardReportCount,
  listLeaderboardReport,
} from './controller/leaderboardReport/leaderboardReportController';
import {
  calculateChipsAddedPartialForDashboard,
  findNewPlayersJoinData,
  findPartialRakeGenerated,
  findPartialRakeGeneratedDay,
  findPlayerLoginData,
  findTotalRakeLastWeek,
  findTotalRakeYesterday,
} from './controller/activity/activityController';
import {
  createLeaderboard,
  deleteLeaderboard,
  directEntryPlayer,
  editLeaderboard,
  getTables,
  listLeaderboard,
  countDirectEntryHistory,
  directEntryHistoryPlayer,
  getCurrentLeaderboardParticipants,
} from './controller/leaderboardManagement/leaderboardManagementController';
import {
  countLeaderboardSets,
  createLeaderboardSet,
  deleteLeaderboardSet,
  getLeaderboardSets,
  updateLeaderboardSet,
  getLeaderboardSpecificDetails,
  changeViewOfSet,
  changeViewOfLeaderboard,
} from './controller/leaderboardSetManagement/leaderboardSetManagementController';
// import logger from './logger';

class Router {
  constructor(server: express.Express) {
    const router = express.Router();
    //router.options('*', cors());
    server.use('/', router);

    router.get(
      '/generateToken/:userId',
      cors(),
      (req: express.Request, res: express.Response) => {
        res.json({
          token: generateToken({ userName: req.params.userId, time: Date() }),
        });
      },
    );

    router.post(
      '/validateToken',
      cors(),
      async (req: express.Request, res: express.Response) => {
        if (validateRequest(req)) {
          return res.json({
            ...RESPONSE_CODES[200],
            isValid: true,
          });
        } else {
          return res.json(RESPONSE_CODES[401]);
        }
      },
    );

    router.post(
      '/login',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await userAuth(req));
      },
    );

    router.post(
      '/getModuleList',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await getAllModules());
      },
    );

    router.post(
      '/getModuleListAff',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await getModuleListAff());
      },
    );

    router.post(
      '/getModuleListSubAff',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await getModuleListSubAff());
      },
    );

    router.post(
      '/getModuleAff',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await getModuleAff());
      },
    );

    router.post(
      '/checkUserSessionInDb',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await checkUserSessionInDb(req));
      },
    );

    router.post(
      '/createUser',
      // cors(),
      // protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await createUser(req));
      },
    );

    router.post(
      '/listUser',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await listUser(req));
      },
    );

    router.post(
      '/countUsers',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await countUsers(req));
      },
    );

    router.post(
      '/createNewAffiliate',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await createNewAffiliate(req));
      },
    );

    router.post(
      '/createSubAffiliate',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await createSubAffiliate(req));
      },
    );

    router.post(
      '/listAffiliate',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await listAffiliate(req));
      },
    );

    router.post(
      '/listOneAffiliate',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await listOneAffiliate(req));
      },
    );

    router.post(
      '/listSubAffiliate',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await listSubAffiliate(req));
      },
    );

    router.post(
      '/getAffiliateCount',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await affiliateCount(req));
      },
    );

    router.post(
      '/getSubAffiliateCount',
      cors(),
      protectedRoute,
      async (req: express.Request, res: express.Response) => {
        return res.json(await subAffiliateCount(req));
      },
    );

    //return res.json(await getAllModules(req));
    //});

    /****** Loyalty Points Route Start *****/

    /**
     * @openapi
     * '/createLoyaltyPoints':
     *  post:
     *    summary: "create the loyalty points "
     *    tags:
     *    - Loyality Points Management
     *    description: Create the loyalty points on the basis of loyalty level
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/CreateLoyaltyPointsRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CreateLoyaltyPointsSuccessResponse"
     *      400:
     *        description: Bad Request
     *      500:
     *        description: Internal Server Error
     */
    router.post(
      '/createLoyaltyPoints',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await createLoyaltyPoints(req));
      },
    );

    /**
     * @openapi
     * '/listLoyaltyPoints':
     *  get:
     *    summary: "list existing loyalty points "
     *    tags:
     *    - Loyality Points Management
     *    description: List out all the Loyalty levels with Percent reward and Level Threshold
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ListLoyaltyPointsSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/listLoyaltyPoints',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await listLoyaltyPoints(req));
      },
    );

    /**
     * @openapi
     * '/udpateLoyaltyPoints':
     *  put:
     *    summary: update loyalty Points.
     *    tags:
     *    - Loyality Points Management
     *    description: update the loyalty points according the the loyalty level
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/UpdateLoyaltyPointsRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/UpdateLoyaltyPointsSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.put(
      '/updateLoyaltyPoints',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await updateLoyaltyPoints(req));
      },
    );

    /****** Loyalty Points Route End *****/

    /****** Spam Words Route Starts *****/

    /**
     * @openapi
     * '/listSpamWords':
     *  get:
     *    summary: "lists all the existing spam words"
     *    tags:
     *    - SpamWords
     *    description: get all the spam words
     *    responses:
     *      200:
     *         description: Success
     *         content:
     *            application/json:
     *               schema:
     *                  $ref: "#/components/schemas/ListSpamWordsResponse"
     *      400:
     *         description: Bad Request
     *
     */
    router.get(
      '/listSpamWords',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await listSpamWords(req));
      },
    );

    /**
     * @openapi
     * '/updateSpamWord':
     *  post:
     *    summary: "update & add spam word"
     *    tags:
     *    - SpamWords
     *    description: This API is used to update & add the spam words in spam dictionary.
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/UpdateSpamWordRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/UpdateSpamWordSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/updateSpamWord',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await updateSpamWord(req));
      },
    );

    /****** Spam Words Route End *****/

    /****** Bonus Code Management Route Start *****/

    /**
     * @openapi
     * '/createBonusCode':
     *  post:
     *    summary: "to create new bonus code"
     *    tags:
     *    - Bonus Code Management
     *    description: This API is used to create new bonus code. If that bonus is already exists then response will have message already exists otherwise new bonus code will be created successfully.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/CreateBonusCodeRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CreateBonusCodeSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */

    router.post(
      '/createBonusCode',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await createBonusCode(req));
      },
    );

    /**
     * @openapi
     * '/updateBonusCode':
     *  patch:
     *    summary: "to update bonus code"
     *    tags:
     *    - Bonus Code Management
     *    description: This API is used to update existing bonus code.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/UpdateBonusCodeRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/UpdateBonusCodeSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.patch(
      '/updateBonusCode',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await updateBonusCode(req));
      },
    );

    /**
     * @openapi
     * '/instantBonusExpire/:id':
     *  patch:
     *    summary: "to update bonus code"
     *    tags:
     *    - Bonus Code Management
     *    description: This API is used to update existing bonus code.
     *    parameters:
     *      - in: path
     *        name: id
     *        type: string
     *        required: true
     *        description: id of bonus code
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/InstantBonusExpireSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.patch(
      '/instantBonusExpire/:id',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await instantBonusExpire(req));
      },
    );

    /**
     * @openapi
     * '/addPromotionalBonus':
     *  post:
     *    summary: "to add new promotional bonus"
     *    tags:
     *    - Bonus Code Management
     *    description: This API is used for adding new Promotional bonus.
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/AddPromotionalBonusRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/AddPromotionalBonusSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/addPromotionalBonus',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await addPromotionalBonus(req));
      },
    );

    /**
     * @openapi
     * '/listPromotionalBonus':
     *  get:
     *    summary: " list promotional bonus"
     *    tags:
     *    - Bonus Code Management
     *    description: This API is used list all Promotional bonus.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ListPromotionalBonusSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/listPromotionalBonus',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await listPromotionalBonus(req));
      },
    );

    /**
     * @openapi
     * '/removePromotionalBonus/:id':
     *  delete:
     *    summary: "to remove promotional bonus"
     *    tags:
     *    - Bonus Code Management
     *    description: This API is used to remove the existing promotional bonus.
     *    parameters:
     *      - in: path
     *        name: id
     *        type: string
     *        required: true
     *        description: id of bonus code
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/RemovePromotionalBonusSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.delete(
      '/removePromotionalBonus/:id',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await removePromotionalBonus(req));
      },
    );

    /**
     * @openapi
     * '/countBonusDeposit':
     *  get:
     *    summary: " give count of bonus deposited"
     *    tags:
     *    - Bonus Code Management
     *    description: This API gives information about how many bonus code are deposited.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CountBonusDepositSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/countBonusDeposit',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await countBonusDeposit(req));
      },
    );

    /**
     * @openapi
     * '/listBonusDeposit':
     *  get:
     *    summary: " list bonus deposit"
     *    tags:
     *    - Bonus Code Management
     *    description: This API is used list all bonus deposited.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ListBonusDepositSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */

    router.get(
      '/listBonusDeposit',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await listBonusDeposit(req));
      },
    );

    /**
     * @openapi
     * '/bonusHistory':
     *  get:
     *    summary: "get bonus history"
     *    tags:
     *    - Bonus Code Management
     *    description: This API is used show bonus hitory.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/BonusHistorySuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */

    //need to add bonus history collection in model in this API.
    router.get(
      '/bonusHistory',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getBonusHistory(req));
      },
    );

    /**
     * @openapi
     * '/getActiveBonus':
     *  get:
     *    summary: "get active bonus"
     *    tags:
     *    - Bonus Code Management
     *    description: This API is used get the active bonus code of type signUp.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetActiveBonusSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */

    router.get(
      '/getActiveBonus',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getActiveBonus(req));
      },
    );

    /****** Bonus Code Management Route End *****/

    /****** Scratch Card Management Route Start *****/

    /**
     * @openapi
     * '/createScratchCardAffiliate':
     *  post:
     *    summary: "to create scratch card"
     *    tags:
     *    - Scratch Card Management
     *    description: This API is used to generate Scratch Card for Affiliates and Agents..
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/CreateScratchCardAffiliateRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/createScratchCardAffiliateSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/createScratchCardAffiliate',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await createScratchCardAffiliate(req));
      },
    );

    /**
     * @openapi
     * '/createScratchCardHighRollers':
     *  post:
     *    summary: "to create scratch card"
     *    tags:
     *    - Scratch Card Management
     *    description: This API is used to generate Scratch Card for Affiliates and Agents..
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/CreateScratchCardHighRollersRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CreateScratchCardHighRollersSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/createScratchCardHighRollers',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await createScratchCardHighRollers(req));
      },
    );

    /**
     * @openapi
     * '/getScratchCardListCount':
     *  get:
     *    summary: " give count of scratch card generated"
     *    tags:
     *    - Scratch Card Management
     *    description: This API is used for count the number of Scratch card generated which will be approve or reject by admin.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetScratchCardListCountSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/getScratchCardListCount',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getScratchCardListCount(req));
      },
    );

    /**
     * @openapi
     * '/getScratchCardList':
     *  get:
     *    summary: " give list of scratch card generated"
     *    tags:
     *    - Scratch Card Management
     *    description: This API is used get the list of Scratch card generated which will be approve or reject by admin.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetScratchCardListSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/getScratchCardList',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getScratchCardList(req));
      },
    );

    /**
     * @openapi
     * '/getScratchCardHistoryCount':
     *  get:
     *    summary: "give count of scratch card history"
     *    tags:
     *    - Scratch Card Management
     *    description: This API is used for getting the number of Scratch Card History count.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetScratchCardHistoryCountSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/getScratchCardHistoryCount',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getScratchCardHistoryCount(req));
      },
    );

    /**
     * @openapi
     * '/getScratchCardHistory':
     *  get:
     *    summary: "give list of scratch card history"
     *    tags:
     *    - Scratch Card Management
     *    description: This API is used for getting the list of Scratch Card History.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetScratchCardHistorySuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/getScratchCardHistory',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getScratchCardHistory(req));
      },
    );

    /**
     * @openapi
     * '/rejectScratchCard':
     *  post:
     *    summary: "to reject scratch card"
     *    tags:
     *    - Scratch Card Management
     *    description: This API is used to reject Scratch Card .
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/RejectScratchCardRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/RejectScratchCardSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    //need to add more keys in swagger request object in playerDetail field.
    router.post(
      '/rejectScratchCard',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await rejectScratchCard(req));
      },
    );

    /**
     * @openapi
     * '/approveScratchCard':
     *  post:
     *    summary: "to approve scratch card"
     *    tags:
     *    - Scratch Card Management
     *    description: This API is used to approve the scratch card.
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/ApproveScratchCardRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ApproveScratchCardSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/approveScratchCard',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await approveScratchCard(req));
      },
    );

    /****** Scratch Card Management Route End *****/

    /****** Activity Routes Starts *******/

    /**
     * @openapi
     * '/findTotalRakeYesterday':
     *  get:
     *    summary: "gives rake generated yesterday"
     *    tags:
     *    - Activity
     *    description: This API is used for providing information how much rake is generated yesterday from gameplay.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/findTotalRakeYesterdaySuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/findTotalRakeYesterday',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await findTotalRakeYesterday(req));
      },
    );

    /**
     * @openapi
     * '/findPlayerLoginData':
     *  post:
     *    summary: "gives player login data"
     *    tags:
     *    - Activity
     *    description: This API is gives information that how many players are logged in Today and Yesterday
     *    requestBody:
     *      required: false
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/FindPlayerLoginDataRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/FindPlayerLoginDataSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/findPlayerLoginData',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await findPlayerLoginData(req));
      },
    );

    /**
     * @openapi
     * '/findTotalRakeLastWeek':
     *  get:
     *    summary: "gives rake last week"
     *    tags:
     *    - Activity
     *    description: This API is used for getting how much rake is generated last week from gameplay.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/findTotalRakeLastWeekSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/findTotalRakeLastWeek',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await findTotalRakeLastWeek(req));
      },
    );

    /**
     * @openapi
     * '/findPartialRakeGeneratedDay':
     *  get:
     *    summary: "gives partial rake today & yesterday"
     *    tags:
     *    - Activity
     *    description: This API gives the information about partial rake generated Today and Yesterday.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/findPartialRakeGeneratedDaySuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/findPartialRakeGeneratedDay',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await findPartialRakeGeneratedDay(req));
      },
    );

    /**
     * @openapi
     * '/findPartialRakeGenerated':
     *  get:
     *    summary: "gives partial rake this week & last week"
     *    tags:
     *    - Activity
     *    description: This API is used for providing information about Partial and Average rake generated this week and last week.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/FindPartialRakeGeneratedSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/findPartialRakeGenerated',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await findPartialRakeGenerated(req));
      },
    );

    /**
     * @openapi
     * '/findTotalChipsAdded':
     *  get:
     *    summary: "gives how many chips added"
     *    tags:
     *    - Activity
     *    description: This API is gives information about how many chips are added Today, Yesteday and Lastweek.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/findTotalChipsAddedSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/findTotalChipsAdded',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await calculateChipsAddedPartialForDashboard(req));
      },
    );

    /**
     * @openapi
     * '/findNewPlayersJoinData':
     *  get:
     *    summary: "gives data how many player joined"
     *    tags:
     *    - Activity
     *    description: This API is used for providing information that how many new player are join Today, This month, This Year, All Time.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/findNewPlayersJoinDataSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/findNewPlayersJoinData',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await findNewPlayersJoinData(req));
      },
    );

    /****** Activity Routes End *******/

    /****** Leaderboard Report Management Start *****/

    /**
     * @openapi
     * '/listLeaderboardReport':
     *  get:
     *    summary: "get the list of leader loard reports"
     *    tags:
     *    - Leaderboard Reports
     *    description: This API is used to get the chart of Leader Board Reports.
     *    requestBody:
     *      required: false
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/ListLeaderboardReportRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ListLeaderboardReportSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */

    router.get(
      '/listLeaderboardReport',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await listLeaderboardReport(req));
      },
    );

    /**
     * @openapi
     * '/getLeaderboardReportCount':
     *  get:
     *    summary: "get the count of Leaderboard Report"
     *    tags:
     *    - Leaderboard Reports
     *    description: This API is used to get the count of Leaderboard Report.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetLeaderboardReportCountSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/getLeaderboardReportCount',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getLeaderboardReportCount(req));
      },
    );

    /****** Leaderboard Report Management  Route Start *****/

    /****** Leaderboard Management Route Start ********/

    /**
     * @openapi
     * '/createLeaderboard':
     *  post:
     *    summary: "to create leaderboard"
     *    tags:
     *    - Leaderboard Management
     *    description: This API is used to create new Leader Board.
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/CreateLeaderboardRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CreateLeaderboardSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/createLeaderboard',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await createLeaderboard(req));
      },
    );

    /**
     * @openapi
     * '/listLeaderboard':
     *  get:
     *    summary: "list all Leaderboards"
     *    tags:
     *    - Leaderboard Management
     *    description: This API is used to list all the existing Leaderboards.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/listLeaderboardSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/listLeaderboard',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await listLeaderboard(req));
      },
    );

    /**
     * @openapi
     * '/getTables':
     *  post:
     *    summary: "list all leaderboard tables"
     *    tags:
     *    - Leaderboard Management
     *    description: This API is used to get all the Tables names.
     *    requestBody:
     *      requried: false
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/GetTablesRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetTablesSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/getTables',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getTables(req));
      },
    );

    /**
     * @openapi
     * '/deleteLeaderboard':
     *  delete:
     *    summary: "to delete leaderboard"
     *    tags:
     *    - Leaderboard Management
     *    description: This API is used to delete the existing Leader Board.
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/DeleteLeaderboardRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/DeleteLeaderboardSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.delete(
      '/deleteLeaderboard',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await deleteLeaderboard(req));
      },
    );

    /**
     * @openapi
     * '/editLeaderboard':
     *  put:
     *    summary: "to udpate leaderboard"
     *    tags:
     *    - Leaderboard Management
     *    description: This API is used to update the existing Leader Board..
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/EditLeaderboardRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/EditLeaderboardSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.put(
      '/editLeaderboard',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await editLeaderboard(req));
      },
    );

    /**
     * @openapi
     * '/countDirectEntryHistory':
     *  post:
     *    summary: "to get direct entry history count"
     *    tags:
     *    - Leaderboard Management
     *    description: This API is used to give the number of players who get direct entry with Bonus Code.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/CountDirectEntryHistoryRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CountDirectEntryHistorySuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/countDirectEntryHistory',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await countDirectEntryHistory(req));
      },
    );

    /**
     * @openapi
     * '/directEntryPlayer':
     *  post:
     *    summary: "list direct entry of player"
     *    tags:
     *    - Leaderboard Management
     *    description: This API is used for the Direct Entry of player with Bonus code.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/DirectEntryPlayerRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/DirectEntryPlayerSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/directEntryPlayer',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await directEntryPlayer(req));
      },
    );

    /**
     * @openapi
     * '/directEntryHistoryPlayer':
     *  post:
     *    summary: "list direct entry of player"
     *    tags:
     *    - Leaderboard Management
     *    description: This API is used for the Direct Entry of player with Bonus code.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/DirectEntryHistoryPlayerRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/DirectEntryHistoryPlayerSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/directEntryHistoryPlayer',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await directEntryHistoryPlayer(req));
      },
    );

    /**
     * @openapi
     * '/getCurrentLeaderboardParticipants/:leaderboardId/:status':
     *  post:
     *    summary: "get current leaderboard participants"
     *    tags:
     *    - Leaderboard Management
     *    description: This API is used to give the list of Current Waiting/Running Leader Board Participants.
     *    parameters:
     *      - in: path
     *        name: leaderboardId
     *        type: string
     *        required: true
     *        description: leaderboardId of bonus code
     *      - in: path
     *        name: status
     *        type: string
     *        required: true
     *        description: current status of leaderboard
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetCurrentLeaderboardParticipantsSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/getCurrentLeaderboardParticipants/:leaderboardId/:status',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getCurrentLeaderboardParticipants(req));
      },
    );

    /****** Leaderboard Management Route End *******/

    /****** Leaderboard Set Management Route Start ******/

    /**
     * @openapi
     * '/createLeaderboardSet':
     *  post:
     *    summary: "create new leaderboard set"
     *    tags:
     *    - Leaderboard Set Management
     *    description: This API is used to create new Leader Board Set.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/CreateLeaderboardSetRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CreateLeaderboardSetSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/createLeaderboardSet',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await createLeaderboardSet(req));
      },
    );

    /**
     * @openapi
     * '/deleteLeaderboardSet':
     *  delete:
     *    summary: "to delete leaderboard set"
     *    tags:
     *    - Leaderboard Set Management
     *    description: This API is used to delete Leaderboard Set.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/DeleteLeaderboardSetRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/DeleteLeaderboardSetSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.delete(
      '/deleteLeaderboardSet',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await deleteLeaderboardSet(req));
      },
    );

    /**
     * @openapi
     * '/getLeaderboardSpecificDetails':
     *  post:
     *    summary: "to get leaderboard set specific info"
     *    tags:
     *    - Leaderboard Set Management
     *    description: This API is used to get the information about Leader Board Id and Leader Board Name.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/GetLeaderboardSpecificDetailsRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetLeaderboardSpecificDetailsSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/getLeaderboardSpecificDetails',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getLeaderboardSpecificDetails(req));
      },
    );

    /**
     * @openapi
     * '/updateLeaderboardSet':
     *  patch:
     *    summary: "to udpate leaderboard set "
     *    tags:
     *    - Leaderboard Set Management
     *    description: This API is used to edit the existing Leader Board Sets.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/UpdateLeaderboardSetRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/UpdateLeaderboardSetSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.patch(
      '/updateLeaderboardSet',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await updateLeaderboardSet(req));
      },
    );

    /**
     * @openapi
     * '/changeViewOfSet':
     *  post:
     *    summary: "to enable/disable leaderboard set "
     *    tags:
     *    - Leaderboard Set Management
     *    description: This API is used to Enable/Disable the Leader Board Set.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/ChangeViewOfSetRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ChangeViewOfSetSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/changeViewOfSet',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await changeViewOfSet(req));
      },
    );

    /**
     * @openapi
     * '/changeViewOfLeaderboard':
     *  post:
     *    summary: "to enable/disable leaderboard set view"
     *    tags:
     *    - Leaderboard Set Management
     *    description: This API is used to change the view of Leader Board Set i.e., Enable or Disable.
     *    requestBody:
     *      requried: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/changeViewOfLeaderboardRequest"
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/changeViewOfLeaderboardSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.post(
      '/changeViewOfLeaderboard',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await changeViewOfLeaderboard(req));
      },
    );

    /**
     * @openapi
     * '/countLeaderboardSets':
     *  get:
     *    summary: "get the count of  leaderboard sets"
     *    tags:
     *    - Leaderboard Set Management
     *    description: This API is used to get the number of Leaderboard Sets Available.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CountLeaderboardSetsSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/countLeaderboardSets',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await countLeaderboardSets(req));
      },
    );

    /**
     * @openapi
     * '/getLeaderboardSets':
     *  get:
     *    summary: "get the list of leaderboard sets"
     *    tags:
     *    - Leaderboard Set Management
     *    description: This API is used to list out the Leader Board Sets currently present.
     *    responses:
     *      200:
     *        description: Success Resposne
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/GetLeaderboardSetsSuccessResponse"
     *      400:
     *        description: Bad Request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/ErrorResponse"
     *      500:
     *        description: Internal Server Error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/CatchErrorResponse"
     */
    router.get(
      '/getLeaderboardSets',
      cors(),
      async (req: express.Request, res: express.Response) => {
        return res.json(await getLeaderboardSets(req));
      },
    );

    /****** Leaderboard Set Management Route End ******/
  }
}

export default Router;
