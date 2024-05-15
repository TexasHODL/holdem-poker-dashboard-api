/*jshint node: true */
"use strict";

const falseMessages = {
  SAVEJOINRECORDFAIL_AUTOSITHANDLER: "Unable to store player record in join - ",
  SAVEACTIVITYRECORDFAIL_AUTOSITHANDLER:
    "Unable to store player activity record for disconnection handling",
  FIRECARDDISTRIBUTEBROADCASTFAIL_BROADCASTHANDLER:
    "Sorry, unable to start game for now. Please check back after sometime",
  FIREONTURNBROADCASTFAIL_BROADCASTHANDLER:
    "Error while sending on turn broadcast - ",
  PERFORMMOVEFAIL_CHANNELTIMERHANDLER: "Time bank check not finished properly!",
  KILLCHANNELFAIL_ENTRYHANDLER: "Channel not found!",
  CHECKMULTIPLESIGNUPFAIL_ENTRYHANDLER:
    "You are signed from other computer. Please log out from there and try again.",
  GETJOINEDCHANNELSFAIL_ENTRYHANDLER: "Sorry, unable to fetch your data",
  BINDUSERSESSION_TRUE_ENTRYHANDLER:
    "Session has been binded and session values has been also set.",
  AUTOSITFAIL_ENTRYHANDLER:
    "All seats on table are full. Please choose another table",
  JOINWAITINGLISTFAIL_ENTRYHANDLER:
    "Sorry, no active game is going on the table. Please play on other table",
  ADDFAVOURATESEATFAIL_MISSINGCHANNELID_ENTRYHANDLER: "missing channelId",
  ADDFAVOURATESEATFAIL_MISSINGPOSITION_ENTRYHANDLER: "Invalid position",
  ADDFAVOURATETABLEFAIL_MISSINGCHANNELID_ENTRYHANDLER: "missing channelId",
  ADDFAVOURATETABLESEATFAIL_MISSINGPOSITION_ENTRYHANDLER: "Invalid position",
  ADDFAVOURATETABLESEATFAIL_MISSINGCHANNELID_ENTRYHANDLER: "missing channelId",
  INSERTVIDEOLOGFAIL_ENTRYHANDLER: "video insertion failed",
  LEAVEWAITINGLISTFAIL_ENTRYHANDLER:
    "Sorry, no active game is going on the table. Please play on other table",
  CHECKIFPLAYERSAVAILABLEFAIL_IDLEPLAYERSHANDLER:
    "Error while checking players on cache table.",
  ISPLAYERPLAYINGFAIL_IDLEPLAYERSHANDLER:
    "Sorry, you have been removed from this table by the system. Please join again",
  ISPLAYERCROSSEDLIMITFAIL_IDLEPLAYERSHANDLER:
    "Player still not crossed the idle limit, not removing from table!",
  PROCESSPLAYERFAIL_IDLEPLAYERSHANDLER:
    "Error while processing a player for idle cases! -",
  PROCESSPLAYERTRUE_IDLEPLAYERSHANDLER: "Player processed successfully!",
  STARTPROCESSINGPLAYERFAIL_IDLEPLAYERSHANDLER:
    "PLAYERS = Error while processing players on cache table. ",
  GETTOURNAMENTCHANNELFAIL_JOINCHANNELHANDLER:
    "ERROR IN FINDING IN MEMORY TABLE",
  VALIDATEKEYONJOINFAIL_JOINCHANNELHANDLER:
    "Key channelId or tableId not found or contains blank value!",
  TABLEPASSWORDFAIL_JOINCHANNELHANDLER:
    "The table is password protected. You need to enter valid password to get access.",
  ERRORCREATINGCHANNELFAIL_LATEREGISTRATIONHANDLER:
    "Error in creating channels",
  ERRORCREATINGTABLEINCHANNELFAIL_LATEREGISTRATIONHANDLER:
    "Error in creating table in create channel",
  PROCESS_TRUE_LATEREGISTRATIONHANDLER: "player joined successfully",
  GETUSERSESSIONFAIL_LOGOUTHANDLER: "user session not found",
  GETUSERSESSION_TRUE_LOGOUTHANDLER: "user logged out successfully",
  KILLUSERSESSIONFAIL_LOGOUTHANDLER: "Error in kill user session",
  OFCJOINWAITINGLISTFAIL_OFCHANDLER:
    "Waiting list feature is not implemented yet..",
  DEDUCTCHIPSFAIL_REBUYHANDLER: "Error in deductChips",
  REBUY_TRUE_REBUYHANDLER: "Rebuy successfully done",
  REBUYPROCESSFAIL_REBUYHANDLER: "You are not eligible for rebuy",
  LEAVEUSERFROMALLCHANNEL_SESSIONHANDLER:
    "Sorry, something went wrong . Please try again",
  TABLEBUYRESPONSEFAIL_SITHEREHANDLER:
    "The chips amount are invalid. Please try with different amount",
  VALIDATESEATOCCUPANCYFAIL_SITHEREHANDLER:
    "The seat is occupied. Please choose another",
  CHECKGAMESTARTONCHANNELLEVEL_CHANNELMISSINGFAIL_STARTGAMEHANDLER:
    "Channel missing while starting game!",
  CHECKGAMESTARTONCHANNELLEVEL_GAMEALREADYSETFAIL_STARTGAMEHANDLER:
    "A game start event already set for this channel!",
  CHECKBREAKMANAGEMENTFAIL_STARTGAMEHANDLER: "Tournament will go into break .",
  SHUFFLETOURNAMENTPLAYERSFAIL_STARTGAMEHANDLER:
    "Unable to save record of user in player shuffling",
  FIREGAMEPLAYERSBROADCASTFAIL_STARTGAMEHANDLER:
    "Missing event name while starting Game!",
  SETONBREAKANDSTARTRESERVETIMERFAIL_STARTGAMEHANDLER:
    "Setting bankrupt player state as onbreak failed!",
  CHECKGAMESTARTFAIL_STARTGAMEHANDLER:
    "Sorry, unable to start game on this table. Please play on other table",
  DECIDETOURNAMENTFINISHFAIL_STARTGAMEHANDLER:
    "Sorry, we are unable to download tournamnet data. Please register in another tournament.",
  STARTTOURNAMENTFAIL_STARTTOURNAMENTHANDLER:
    "Error while starting tournament.",
  GETPLAYERCHANNEL_NOTABLE_TOURNAMENTJOINHANDLER:
    "channelId and tableId not found",
  CREATETABLEFORNORMALTOURNAMENTFAIL_TOURNAMENTSCHEDULER:
    "error in creating table",
  PROCESSPRIZERULEANDRANKSFAIL_TOURNAMENTSCHEDULER:
    "Error in creating prize rule",
  UPDATEUSERENCRYPTIONERROR_UPDATEPROFILEHANDLER:
    "not able to encrypt pan number crypto error",
  UPDATEPROFILEFAIL_UPDATEPROFILEHANDLER:
    "Sorry, unable to update profile due to server issue. Please try again .",
  GETNEXTQUEUEDPLAYERIDFAIL_WAITINGLISTHANDLER:
    "There is no waiting player for this table",
  UPDATEPROFILEHANDLERFAIL_WAITINGLISTHANDLER:
    "Sorry, unable to fetch your data. Please logout and login again ",
  PROCESSPLAYERAUTOSITFAIL_WAITINGLISTHANDLER:
    "The table is full, please join waiting list or join another similar table",
  GETCONNECTOR_UNKNOWNLOGIN_GATEHANDLER: "unknown loginMode",
  GETCONNECTOR_UNABLETOCREATEUSER_GATEHANDLER: "not able to create user in db",
  GETCONNECTOR_INVALIDEMAIL_GATEHANDLER: "Please enter valid email id.",
  GETCONNECTOR_USERNAMEERROR_GATEHANDLER:
    "Username can contain only a-z, A-Z, 0-9 and _",
  GETCONNECTOR_INVALIDPASSWORD_GATEHANDLER:
    "Password must contain atleast 6-25 characters.",
  GETCONNECTOR_MINREQFIELDERROR_GATEHANDLER:
    "Username/email id is required for signing in.",
  GETCONNECTOR_UNKOWNLOGINTYPEERROR_GATEHANDLER: "unknown loginType",
  GETDECRYPTEDDATA_KEYMISMATCH_AUTHHANDLER: "encryption key mismatch!!",
  UNSIGNDATA_DECODEFAIL_AUTHHANDLER: "unable to decode json",
  STARTCONSIDERPLAYERSFAIL_VALIDATEGAMESTART:
    "Player consider and skip failed !",
  SORTPLAYERINDEXESFAIL_VALIDATEGAMESTART:
    "Sorting players on game start failed.",
  REMOVESITOUTPLAYER_BLIND_VALIDATEGAMESTART:
    "Unable to remove blind missed player or sitout game missed player! - ",
  REMOVESITOUTPLAYERFAIL_VALIDATEGAMESTART: "Removing sitout player failed !",
  SITNGOREGISTRATIONFAIL_TOURNAMENTREGISTRATION: "Tournament already started",
  NORMALTOURNAMENTREGISTRATIONFAIL_TOURNAMENTREGISTRATION:
    "Sorry, tournament has started, please register in other tournament . ",
  NORMALTOURNAMENTREGISTRATIONFAIL_REGISTRATIONNOTSTARTED:
    "Sorry, tournament registration has not started yet .",
  VALIDATEACTIONFAIL_TOURNAMENTLEAVE:
    "You are not allowed to standup, please choose Leave.",
  GETTOURNAMENTROOMCALLBACK_NOTOURNAMENTROOM_TOURNAMENT:
    "Sorry, we are unable to download tournamnet data. Please try again",
  GETTOURNAMENTROOMCALLBACK_TOURNAMENT:
    "Sorry, we are unable to download tournamnet data. Please try again",
  REGISTERTOURNAMENTFAIL_TOURNAMENT:
    "Sorry, we are unable to download tournamnet data. Please try again",
  FINDTOURNAMENTUSERFAIL_TOURNAMENT:
    "Sorry, we are unable to download tournamnet data. Please try again",
  GETREBUYSTATUSFAIL_TOURNAMENT: "Error in getting rebuy status",
  VALIDATEANDREGISTERTOURNAMENTFAIL_TOURNAMENT:
    "Sorry, you can only deregister before the start of the tournament",
  GETENROLLEDPLAYERSCHILDTOURNAMENTFAIL_TOURNAMENT:
    "Error in getting enrolled players of child",
  GETENROLLEDPLAYERSPARENTTOURNAMENTFAIL_TOURNAMENT:
    "Error in getting enrolled players of child",
  CREATERESPONSEFORSATELLITEFAIL_TOURNAMENT:
    "Error in getting enrolled players of child",
  GETCURRENTPLAYERFAIL_TABLEMANAGER:
    "Sorry, unable to download your data. Please logout and login again",
  RESUMEPLAYER_NOTOPTED_TABLEMANAGER:
    "Sorry, you are not sitting on the table. Please  join the table again",
  RESUMEPLAYER_NOTSITTING_TABLEMANAGER:
    "Sorry, you are not sitting on the table. Please  join the table again",
  PROCESSSITOUTNEXTHANDFAIL_TABLEMANAGER:
    "Sorry, you are not sitting on the table. Please  join the table again",
  PROCESSSITOUTNEXTBIGBLINDFAIL_TABLEMANAGER:
    "Cannot use this feature in tournament",
  PROCESSSITOUTNEXTBIGBLIND_NOTSITTING_TABLEMANAGER:
    "Sorry, you are not sitting on the table. Please  join the table again",
  RESETSITOUTFAIL_TABLEMANAGER:
    "Sorry, you are not sitting on the table. Please  join the table again",
  SETPLAYERVALUEFAIL_TABLEMANAGER:
    "Sorry, you are not sitting on the table. Please  join the table again",
  DISCONNECTCURRENTPLAYERFAIL_TABLEMANAGER:
    "Sorry, unable to fetch your data. Please try again",
  GETPLAYERVALUEFAIL_TABLEMANAGER:
    "Get player value from key failed, player not on table!",
  PERFORMAUTOSITFAIL_TABLEMANAGER:
    "Sorry, you are not sitting on the table. Please  join the table again",
  PLAYERONTABLEFAIL_TABLEMANAGER: "You are already sitting on the table",
  SEATSFULLONTABLEFAIL_TABLEMANAGER:
    "The table is full, please join waiting list or join another similar table",
  ADDCHIPSONTABLEFAIL_TABLEMANAGER: "Cannot add chips in tournament table.",
  ADDCHIPSONTABLE_ADDAMOUNTFAIL_TABLEMANAGER:
    "Please provide a valid value to add chips",
  ADDCHIPSONTABLE_PLAYERTOOKASEAT_TABLEMANAGER:
    "Invalid attempt to add chips, Please take a seat first!",
  ADDCHIPSONTABLE_TOTALEXCEEDTABLEMAXBUY_TABLEMANAGER:
    "Please provide a valid value to add chips. It cannot be more than the max buyin for the table ",
  ADDCHIPSONTABLE_FOLDEDPLAYERFAIL_TABLEMANAGER:
    "Sorry, you can add chips only when the round is over",
  ADDCHIPSONTABLEOUTOFMONEYFAIL_TABLEMANAGER:
    "Please provide a valid value to add chips",
  ADDCHIPSONTABLEINTOURNAMENT_TABLEMANAGER:
    "Invalid attempt to add chips, Please take a seat first!",
  ISRUNITTWICEFAIL_TABLEMANAGER:
    "Getting run it twice from player profile failed! - ",
  // 'ISSAMENETWORKSITFAIL_TABLEMANAGER'                                            : 'A player with same network/IP is already playing on this table!',
  ISSAMENETWORKSITFAIL_TABLEMANAGER:
    "A player with same network/IP is already playing on this table!",
  CHECKTABLECOUNTFORPLAYERFAIL_TABLEMANAGER:
    "You have already joined maximum number of tables.\nPlease leave some to join more.",
  SETPLAYERVALUEONTABLE_KEYNOTPRESENT_TABLEMANAGER:
    "This key is not present in the players attribute!",
  SETPLAYERVALUEONTABLE_PLAYERNOTSIT_TABLEMANAGER:
    "Sorry, you are not sitting on this table",
  NEXTACTIVESEATINDEXFAIL_TABLEMANAGER: "Get next active seat index failed!",
  NEXTCONSIDERSEATINDEXFAIL_TABLEMANAGER: "Get next active seat index failed!",
  REMOVEWAITINGPLAYERINDEX_NOTINWAITINGLIST_TABLEMANAGER:
    "Sorry, you have been removed from waiting list",
  REMOVEWAITINGPLAYERFAIL_TABLEMANAGER:
    "There is an error while leaving waiting list.",
  GETBESTHANDFAIL_TABLEMANAGER: "Setting players best hands failed !",
  VALIDATEENTITIES_CURRENTPLAYERSETFAIL_TABLEMANAGER:
    "Current player who has the move unable to set, will lock table !",
  VALIDATEENTITIES_NEXTPLAYERSETFAIL_TABLEMANAGER:
    "Player next to dealer not set, will lock table!",
  VALIDATEENTITIES_BIGBLINDPLAYERSETFAIL_TABLEMANAGER:
    "Unable to set Big Blind player index, will lock table !",
  VALIDATEENTITIES_NEXTACTIVEINDEXFAIL_TABLEMANAGER:
    "Unable to set next player with move index, will lock table !",
  CHANGEDISCONNPLAYERSTATE_PLAYERNOTINTABLE_TABLEMANAGER:
    "Player hasnt on table so skipping player state update!",
  CHANGEDISSCONNPLAYERSTATE_PLAYERNOTDISCONNECTED_TABLEMANAGER:
    "Player is not in DISCONNECTED state, so skipping player state update!",
  CHANGEDISSCONNPLAYERSTATE_PLAYERINDISCONNECTEDSTATE_TABLEMANAGER:
    "Player is in DISCONNECTED state, but not in current game, setting state ONBREAK!",
  CHANGEDISSCONNPLAYERSTATE_PLAYERINDISCONNECTEDSTATE_CURRENTGAME_TABLEMANAGER:
    "Player is in DISCONNECTED state, and in current game, setting state PLAYING!",
  SETTIMEBANKDETAILSFAIL_TABLEMANAGER:
    "Player hasnt on table so skipping time bank setting!",
  SETTIMEBANKDETAILSTRUE_TABLEMANAGER: "Time bank details set successfully!",
  UPDATETOURNAMENTRULESTRUE_TABLEMANAGER:
    "tournamentRules updated successfully!",
  SETPLAYERSASPLAYINGFAIL_TABLECONFIGMANAGER:
    "Player consider and skip failed !",
  SORTPLAYERINDEXESFAIL_TABLECONFIGMANAGER:
    "Sorting players on game start failed.",
  SETDEALERINDEXFAIL_TABLECONFIGMANAGER: "Dealer decision failed for new Game",
  SETSMALLBLINDINDEXFAIL_TABLECONFIGMANAGER: "Small blind decision failed !",
  REPLACEACTUALVARIABLESFAIL_TABLECONFIGMANAGER:
    "Replace temp values failed - ",
  GETNEXTDEALERSEATINDEXFAIL_TABLECONFIGMANAGER:
    "Getting next dealer seat index failed !",
  SEARCHSIMILARTABLE_TABLEEXISTFAIL_SIMILARTABLE:
    "Sorry no similar table exists. Please join tables with different stakes or try again later",
  SEARCHSIMILARTABLE_TABLENOTEXISTFAIL_SIMILARTABLE:
    "Sorry no similar table exists. Please join tables with different stakes or try again later",
  SORTCHANNELSTRENGTH_FAIL_SIMILARTABLE:
    "Sorry no similar table exists. Please join tables with different stakes or try again later",
  CREATEBASICSUMMARY_FAIL_SETTABLECONFIG:
    "Sorry, unable to download history. Please check back after sometime",
  SETDEALERINDEXANDSEATINDEX_FAIL_SETTABLECONFIG:
    "Dealer decision failed for new Game",
  SETSMALLBLINDINDEXANDSEATINDEX_FAIL_SETTABLECONFIG:
    "Small blind decision failed !",
  INCREMENTBLINDMISSED_FAIL_SETTABLECONFIG:
    "Increment big blind count fail ! - ",
  ASSIGNPRECHECKS_FAIL_SETTABLECONFIG: "Precheck decision failed.",
  //noor
  ASYNCEACHSERIES_UPDATESEATS_FAILED_PLAYERSHUFFLING:
    "Error in updating seats in async",
  GETALLCHANNELS_UPDATESEATS_FAILED_PLAYERSHUFFLING:
    "Error in update seats in playerShuffling",
  IMDB_PUSHPLAYERSINTABLE_FAILED_PLAYERSHUFFLING:
    "Error in push players in to new channel",
  IMDB_GETTABLE_FINDFREESEATINDEX_FAILED_PLAYERSHUFFLING:
    "Error in finding channel in inMemoryDb",
  ASYNC_PREPAREPLAYERS_FAILED_PLAYERSHUFFLING:
    "Error in async in preparePlayers",
  IMDB_GETTABLE_UPDATESEATSANDSHUFFLEID_FAILED_PLAYERSHUFFLING:
    "Error in get table in updateSeatsAndShuffleId",
  TOURNAMENT_NOTFOUND_QUICKSEAT:
    "Sorry, tournament you are looking for is over. Please play in other tournament",
  LISTTOURNAMENT_FAILED_QUICKSEAT: "Error Occured in getting tournaments",
  ASYNC_EACHSERIES_GETENROLLEDPLAYERS_FAILED_QUICKSEAT:
    "Unable to fetch tournament registered players data. Please try again",
  BBMISSEDPLAYER_FAILED_REPONSEHANDLER:
    "Unable to process BB missed players details!",
  USER_PROFILE_UPDATE_SUCCESS_REWARDRAKE:
    "Profile has been updated successfully",
  CHKLOYALITYPOINTOFPLAYER_SUCCESS_REWARDRAKE:
    "interation has been finialize in 1689",
  COMMISIONDISTRIBUTION_SUCCESS_REWARDRAKE: "Commission Distributed !!",
  USERPROFILEUPDATE_FAILED_REWARDRAKE:
    "Sorry, unable to update profile data. Please try again",
  COMMISIONDISTRIBUTION_FAILED_REWARDRAKE:
    "Commission Distribution _failed !! - ",
  DISTRIBUTERAKE_FAILED_REWARDRAKE:
    "Error occurred while commission distribution !!",
  CHKLOYALITYPOINTOFPLAYER_FAILED_REWARDRAKE: "somethins wrong line 1687",
  REGISTER_SUCCESS_SATELLITETOURNAMENT:
    "Congratulations, you have successfully registered.",
  VALIDATEKEYSETS_FAILED_PERFORMACTION: "No action name found -",
  USERRESPONSE_FREECHIPS_AVAILABLE_USER:
    "Maximum free chips allowed are availed.",
  USERRESPONSE_FREECHIPS_NOTAVAILABLE_USER:
    "You've already claimed your play money chips for today.Come back tomorrow to get more!",
  PLAYER_CHIPSCONFIG_NOTFOUND_USER: "no data found for this chipsConfig",
  PLAYER_IDREQUIRED_USER: "Playerid is missing",
  UPDATECONFIGURATIONQUERY_KEYSMISSING_USER: "query or updateKeys are missing",
  CREATECONFIGURATION_TYPEMISSING_USER: "type is missing",
  GETCONFIGURATION_TYPEMISSING_USER: "type is missing",
  //nishant
  DEDUCTFORCEBLIND_DEDUCTBLINDS: "Deducting force blind failed !",
  DEDUCTANTE_DEDUCTBLINNDS: "Deducting ante failed !",
  DISTRIBUTE_DISTRIBUTECARDS: "Cards distribution failed! - ",
  GETTINGTABLES_DYNAMICRANKS: "Error in getting tournament tables",
  CREATERESPONSEFORTOURNAMENTUSERS_DYNAMICRANKS: "invalid tournament state",
  PROCESSREGISTEREDUSER_DYNAMICRANKS: "invalid tournament state",
  GETUSERINFO_DYNAMICRANKS: "No user found by these userIds",
  GETTOURNAMENTROOM_DYNAMICRANKS:
    "Sorry, we are unable to download tournamnet data. Please register in another tournament. ",
  GETREGISTEREDTOURNAMENTUSERS_DYNAMICRANKS:
    "Sorry, unable to download tournament data. Please try again",
  ISGAMEPROGRESS_HANDLEGAMEOVER:
    "The present hand is over. Please remain part of game.",
  ASSIGNPOTINDEXANDBOARD_HANDLEGAMEOVER:
    "Pot division failed in run it twice case!",
  REFINEPOTCONTRIBUTORS_HANDLEGAMEOVER:
    "Error while refining pot contributors!",
  DIVIDEPOT_HANDLEGAMEOVER: "Pot division failed in run it twice case!",
  GETPLAYINGPLAYERS_HANDLEGAMEOVER: "Error in getting tournament channels",
  ASYNCEACH_SUMMARYONGAMEOVER_HANDLEGAMEOVER:
    "Unable to assign win amount for summary !",
  ASYNCEACH_DEDUCTAUTOBYIN_HANDLEGAMEOVER:
    "Resetting player on Game over fail !",
  ASYNCEACH_RESETPLAYERSONGAMEOVER_HANDLEGAMEOVER:
    "Resetting player on Game over fail !",
  ASYNCEACHSERIES_SETDECISIONPARAMSSINGLEWINNER_HANDLEGAMEOVER:
    "Generating params for winner failed for single winner case!",
  PROCESSRAKEDISTRIBUTION_REWARDRAKE_AWARDRAKETOAFFILATES_HANDLEGAMEOVER:
    "Rake distribution to system failed!",
  ISGAMEPROGRESS_ISALLINOCCURED_HANDLEGAMESTARTCASE:
    "No all in occured on game start.",
  VALIDATEACTION_LEAVEREMOTE:
    "You are not allowed to <........>, please choose Leave",
  PROFILEMGMTADDCHIPS_REFUNDAMOUNTONLEAVE_LEAVEREMOTE:
    "Refund money to player account failed on - ",
  KEYVALIDATORS_VALIDATEKEYSETS_LOCKTABLELOCK_LOCKTABLE:
    "No channelId passed while locking table!",
  ASYNCEACH_LOGSTARTGAME_LOGREMOTE:
    "Error while creating dealer chat on game start.",
  TABLEMANAGERINSERTHANDHISTORY_SUMMARYREMOTEGENERATESUMMARY_LOGSUMMARY_LOGREMOTE:
    "Inserting hand history failed !",
  CREATELOGONEVENT_LOGREMOTE: "No event log for this event.",
  MANAGEBOUNTYPROCESS_MANAGEBOUNTY: "Error in distributeBounty",
  ISMOVEEXISTS_MOVEREMOTE: "<.......> is not a valid move!",
  ISGAMEPROGRESS_VALIDATEPLAYER_MOVEREMOTE1:
    "Sorry, turn is of other player. Sorry for inconvenience.",
  ISGAMEPROGRESS_VALIDATEPLAYER_MOVEREMOTE2:
    "Sorry, you are not sitting on the table. Please take a seat",
  ISGAMEPROGRESS_SETBETAMOUNT_MOVEREMOTE1:
    "Invalid bet amount for this action.",
  ISGAMEPROGRESS_SETBETAMOUNT_MOVEREMOTE2:
    "Invalid bet amount for this action.",
  ISGAMEPROGRESS_SETBETAMOUNT_MOVEREMOTE3:
    "Cannot make action with this much amount, less on-table amount.",
  ISGAMEPROGRESS_SETBETAMOUNT_MOVEREMOTE4: "amount must be in range ",
  ISGAMEPROGRESS_SETBETAMOUNT_MOVEREMOTE5:
    "Invalid bet amount, must be greater than 0!",
  ISGAMEPROGRESS_VALIDATEBETAMOUNT_MOVEREMOTE:
    "Player cannot make  <.............> with amount  <..........>",
  ISGAMEPROGRESS_VALIDATEMOVEALLOWED_MOVEREMOTE: "<............> not allowed!",
  ACTIVEPLAYER_ISGAMEPROGRESS_UPDATEPLAYER_MOVEREMOTE:
    "You are in state - ' <.......> ', with last action as - ' <........> ' !'",
  ISGAMEPROGRESS_UPDATEPLAYER_MOVEREMOTE:
    "Sorry, you are not sitting on the table. Please take a seat",
  ASYNCWATERFALL_ISGAMEPROGRESS_UPDATETABLE_MOVEREMOTE:
    "Updating table for this move failed!",
  ISGAMEPROGRESS_SETNEXTPLAYER_MOVEREMOTE:
    "An error occured while performing move!",
  EMAILTOKENEXPIRE_VALIDATEKEYSETS_VERIFYEMAIL_USERCONTRO2LLER_USER:
    "Sorry, the email verification link has expired. Click here so that we can send it again",
  NOTOKENFOUNDINEMAIL_VALIDATEKEYSETS_VERIFYEMAIL_USERCONTRO2LLER_USER:
    "no token found in verifyEmail",
  VALIDATEINFOFAIL_VALIDATEKEYSETS_VERIFYEMAIL_USERCONTRO2LLER_USER:
    "<.......>",
  WRONGOTP_OTPRESPONSE_VALIDATEKEYSETS_VERIFYOTP_USERCONTRO2LLER_USER:
    "wrong otp",
  OTPEXPIRED_OTPRESPONSE_VALIDATEKEYSETS_VERIFYOTP_USERCONTRO2LLER_USER:
    "otp expired !!!",
  OTPNOTFOUND_OTPRESPONSE_VALIDATEKEYSETS_VERIFYOTP_USERCONTRO2LLER_USER:
    "otp not found or expired !!!",
  OTPNOTSAVED_VALIDATEKEYSETS_VERIFYOTP_USERCONTRO2LLER_USER:
    "Error in saving otp to database",
  CHECKADDONENABLED_ADDONPROCESS_TOURNAMENTSCHEDULER:
    "Addon is disabled for the current tournament room",
  GETADDONTIME_ADDONPROCESS_TOURNAMENTSCHEDULER: "Unable to get addon details!",
  //sakshi
  TOKEN_EXPIRE_RESET_PASSWORD: "password reset token expired !!",
  TOKEN_USER_NOTFOUND: "user not found for this token",
  TOKEN_RESETPASSWORD_REQUIRED: "password reset token is required",
  PASSWORD_CONTAINS:
    "Pssword should contain atleast one capital letter and one number",
  SUCCESS_SENTEMAIL_PASSWORD_LINK: "Pasword link sent to email successfully",
  MANDRILL_ERROR_SEND_EMAIL:
    "Not able to send email due to data error occoured by mandrill",
  SUCCESS_SENT_EMAILVERFICATIONLINK:
    "EmailVerificationLink  sent to email successfully",
  TABLEFULL_JOIN_WAITING_LIST: "Table is full kindly join waiting list.",
  SUCCESS_ADD_FAVOURATELIST: "Successfully added to favourite list",
  SUCCESS_REMOVE: "Successfully removed from list",
  ERROR_INCRYPT_PASSWORD: "Not able to encrypt password crypto error",
  ERROR_DECRYPTING_PASSWORD: "Error in decrypting password",
  EXCEED_FAVOURATELIST_LIMITS:
    "You have exceeded the favourite list limit. Please delete some from list.",
  EXCEED_BOUNDARY_LIMITS:
    "Requesting to get a seatindex that exceed boundary limits!",
  ACTIVE_PLAYER_ADJUSTMENT_FAILED: "Active player adjustment failed! - ",
  INVALID_SEAT_INDEX_REQUEST: "Invalid seat index request ",
  // Amrendra
  ANTIBANKINGPREVENT: "You can sit with at least amount ",
  PLAYERINDEXINMOVEFAIL: "Unable to perform ",
  NOCURRENTPLAYERONMAXRAISE:
    "Lock condition prevented, max raise for no currentPlayer",
  ERROR_CHECKING_WAITINGLIST: "Error while checking waiting list.",
  ERROR_GETTING_SERVER_ID: "ERROR_GETTING_SERVER_ID",
};

const dbQyeryInfo = {
  DB_SENDOTP_SUCCESS_USER: "OTP sent successfully",
  DB_SENDOTPMESSAGE_SUCCESS_USER: "Your One Time Password is ",
  DB_SENDOTPMESSAGE_SUCCESS_USER1:
    "Dear User, OTP for your mobile verification on pokermoogley.com is ",
  DB_SENDOTPMESSAGE_SUCCESS_USER2:
    ". Do not share it with anyone for security reasons. Valid for 5 minutes.",
  DBCOUNTTOURNAMENTUSERSFAIL_CANCELTOURNAMENT:
    "Error in count enrolled players",
  DBUPDATEMULTIPLETOURNAMENTUSERFAIL_CANCELTOURNAMENT:
    "Error in modifyTournamentUsers in deActivateTournamentUsers",
  DBFINDTOURNAMENTUSERFAIL_CANCELTOURNAMENT:
    "Error in findTournamentUser in deActivateTournamentUsers",
  DBADDREALCHIPSTOMULTIPLEPLAYERSFAIL_CANCELTOURNAMENT:
    "Sorry, something went wrong while adding chips. Please try again",
  DBADDFREECHIPSTOMULTIPLEPLAYERSFAIL_CANCELTOURNAMENT:
    "Sorry, something went wrong while adding chips. Please try again",
  DBUPDATETOURNAMENTSTATEANDVERSIONFAIL_CANCELTOURNAMENT:
    "Error in change tournament state",
  DBLISTTABLESFAIL_ENTRYHANDLER:
    "Sorry, something went wrong while downloading table details. Please try again",
  DBGETALLTABLESFAIL_IDLEPLAYERSHANDLER:
    "No tables are found in cache database, not cheking validation of idle players!",
  DBUPSERTACTIVITYFAIL_JOINCHANNELHANDLER:
    "Unable to store player activity record for disconnection handling",
  DBSAVEJOINRECORDFAIL_JOINCHANNELHANDLER:
    "Unable to store player record in join - ",
  DBFINDTOURNAMENTUSER_NOUSERFAIL_LATEREGISTRATIONHANDLER:
    "Sorry, unable to get users information.  Please try again",
  DBFINDTOURNAMENTUSER_USERELIMINATEDFAIL_LATEREGISTRATIONHANDLER:
    "You have been knocked out from this tournament.",
  DBGETALLTABLEBYTOURNAMENTIDFAIL_LATEREGISTRATIONHANDLER:
    "Channel search Failed",
  DBFINDUSERFAIL_LATEREGISTRATIONHANDLER:
    "Please register to play exciting poker game",
  DBPUSHPLAYERSINTABLEFAIL_LATEREGISTRATIONHANDLER:
    "Error in pushing new players in inMemoryDb",
  DBGETTOURNAMENTROOMFAIL_REBUYHANDLER:
    "Sorry, unable to download table data. Please try again",
  DBFINDTOURNAMENTUSERFAIL_REBUYHANDLER: "player is not a part of tournament",
  DBCOUNTREBUYOPTFAIL_REBUYHANDLER: "Error in rebuy count",
  DBGETALLTOURNAMENTBYTOURNAMENTIDGETUSERCHIPS_REBUYHANDLER:
    "Sorry, unable to dowonload data. Please logout and login again",
  DBUPDATEREBUY_REBUYHANDLER: "Error in update rebuy",
  DBUPDATETOURNAMENTUSER_REBUYHANDLER: "Error in updating user state",
  DBUPSERTACTIVITYFAIL_SITHEREHANDLER:
    "'Unable to store player activity record for disconnection handling'",
  DBUPSERTACTIVITYFAIL_STARTGAMEHANDLER:
    "Unable to store player activity record for disconnection handling",
  DBFINDTABLE_DBERROR_STARTTOURNAMENTHANDLER: "error in getting table for db",
  DBFINDTABLE_TABLENOTEXIST_STARTTOURNAMENTHANDLER:
    "Sorry, this table has no active game going on. Please check for othger tables in the tournament",
  DBCREATECHANNELFORTOURNAMENTFAIL_STARTTOURNAMENTHANDLER:
    "Error in channelCreate",
  DBFINDTOURNAMENTUSER_DBERROR_STARTTOURNAMENTHANDLER:
    "Sorry, unable to fetch users information. Please try agin after sometime",
  DBFINDTOURNAMENTUSER_NOUSER_STARTTOURNAMENTHANDLER:
    "No users have registered for this tournament. Please check out other tournaments",
  DBCOUNTREBUYOPTFAIL_STARTTOURNAMENTHANDLER: "Error in rebuy count",
  DBFINDUSERARRAYFAIL_DBERROR_STARTTOURNAMENTHANDLER:
    "Error in getting players",
  DBFINDUSERARRAYFAIL_NOPLAYERS_STARTTOURNAMENTHANDLER:
    "Sorry, unable to get players information.  Please try again",
  GETPLAYERCHANNEL_DBERROR_TOURNAMENTJOINHANDLER:
    "players channel not found in inMemoryDb",
  DBCOUNTTOURNAMENTUSERSFAIL_TOURNAMENTSCHEDULER:
    "Error in count tournament players or less enrolled players",
  DBFINDUSERFAIL_DBERROR_UPDATEPROFILEHANDLER:
    "Error in find user db error occured",
  DBFINDUSEREMAILERROR_UPDATEPROFILEHANDLER:
    "Email id already exists. Please use another email id.",
  DBVALIDATEMOBILENUMBER_DBERROR_UPDATEPROFILEHANDLER:
    "Error in find user db error occured",
  DBVALIDATEMOBILENUMBER_EXISTINGMOBILENUMBER_UPDATEPROFILEHANDLER:
    "mobileNumber already exists",
  DBVALIDATEMOBILENUMBER_INVALIDMOBILENUMBER_UPDATEPROFILEHANDLER:
    "Invalid mobile number.",
  DBUPDATEUSER_DBERROR_UPDATEPROFILEHANDLER: "error in updating user in db",
  DBUPDATEUSER_NOUSERERROR_UPDATEPROFILEHANDLER:
    "error in updating user collection in db",
  DBGETCUSTOMUSERFAIL_UPDATEPROFILEHANDLER:
    "Sorry, unable to get your information.  Please try again",
  GETCONNECTOR_DBERROR_GATEHANDLER: "not able to find data from db",
  GETCONNECTOR_DBERRORSOCIALLOGIN_GATEHANDLER:
    "not able to find data from db for socialLogin",
  GETDECRYPTEDDATA_DBERROR_AUTHHANDLER:
    "Sorry, something went wrong, please logout and login again",
  DBGETDHCCLIENTSECRETKEY_DBERROR_AUTHHANDLER: "unable to get secret key!!",
  DBADDREALCHIPSFAIL_VALIDATEGAMESTART: "Refund on sitout standup failed! - ",
  DBREMOVEACTIVITYFAIL_VALIDATEGAMESTART:
    "Unable to remove player activity from in memory",
  DBDELETETOURNAMENTUSERFAIL_TOURNAMENTREGISTRATION:
    "Sorry, we are unable to register you in this tournament. Please register in another tournament.",
  DBGETCUSTOMUSER_DBERRORCHECKUSERBALANCE_TOURNAMENTREGISTRATION:
    "Sorry, unable to get your information.  Please try again",
  DBGETCUSTOMER_CHECKUSERBALANCENOREALMONEY_TOURNAMENTREGISTRATION:
    "Insufficient real money chips are there in your account to join",
  DBGETCUSTOMER_CHECKUSERBALANCENOSUFFICIENTPLAYCHIPS_TOURNAMENTREGISTRATION:
    "Insufficient play money chips are there in your account to join",
  DBUPSERTTOURNAMENTUSER_DBERROR_TOURNAMENTREGISTRATION:
    "Sorry, unable to dowonload data. Please try again",
  DBUPSERTTOURNAMENTUSER_USERALREADYEXIST_TOURNAMENTREGISTRATION:
    "You have already registered in this tournament.",
  DBCOUNTTOURNAMENTUSERS_VALIDATENCREATEDBERROR_TOURNAMENTREGISTRATION:
    "Sorry, unable to get players information.  Please try again",
  DBCOUNTTOURNAMENTUSERS_VALIDATENCREATE_TOURNAMENTREGISTRATION:
    "We have the maximum no. of players for this tournament. Please play in another.",
  DBGETTOURNAMENTROOMFAIL_TOURNAMENT:
    "Sorry, tournament you are looking for is over. Please play in other tournament",
  DBGETTOURNAMENTROOM_DEREGISTERTOURNAMENTDBERROR_TOURNAMENT:
    "Sorry, you cannot deregister after the start of the tournament",
  DBGETTOURNAMENTROOM_DEREGISTERTOURNAMENT_TOURNAMENT:
    "You are not a part of this tournament.",
  DBGETTOURNAMENTROOM_GETREGISTEREDTOURNAMENTDBERROR_TOURNAMENT:
    "Sorry, we are unable to download tournamnet data. Please register in another tournament. ",
  DBGETRANKSFAIL_TOURNAMENT: "Unable to fetch tournament users infomration",
  DBLASTBLINDRULE_GETBLINDANDPRIZE_TOURNAMENT:
    "Error in getting blind structure from db",
  DBLASTPRIZERULE_GETBLINGPRIZE_TOURNAMENT:
    "Error in getting prize structure from db",
  DBTOURNAMENTROOM_GETBLINDIDDBERROR_TOURNAMENT: "Error in getting blindId",
  DBTOURNAMENTROOMFAIL_TOURNAMENT:
    "Unable to fetch tournament data. Please try again",
  DBFINDBLINDRULE_GETBLINDRULEDBERROR_TOURNAMENT:
    "Unable to fetch tournament data. Please try again",
  DBFINDTIMEBANKRULE_GETTIMEBANKRULEDBERROR_TOURNAMENT:
    "Unable to fetch tournament data. Please try again",
  DBFINDBREAKRULE_GETBREAKRULEDBERROR_TOURNAMENT:
    "Unable to fetch tournament data. Please try again",
  DBLISTPRIZERULE_GETPRIZESTRUCTUREDBERROR_TOURNAMENT:
    "Unable to fetch tournament data. Please try again",
  DBGETTOURNAMENTROOM_FINDTOURNAMENTROOM_TOURNAMENT:
    "Unable to fetch tournament data. Please try again",
  DBGETTOURNAMENTROOM_GETPARENTTOURNAMENT_NOPARENTTOURNAMENT_TOURNAMENT:
    "parent tournament not found",
  DBGETTOURNAMENTROOM_GETPARENTTOURNAMENT_DBERROR_TOURNAMENT:
    "getting parent tournament db error",
  DBGETTOURNAMENTROOM_GETPARENTTOURNAMENT_NOTOURNAMENT_TOURNAMENT:
    "tournament not found",
  DBGETTOURNAMENTROOM_GETPARENTTOURNAMENT_CANTGETTOURNAMENT_TOURNAMENT:
    "getting tournament db error",
  DBGETTOURNAMENTRANKS_GETPLAYERPRIZE_TOURNAMENT: "Error in getting prize",
  DBUPDATETOURNAMENTRANKS_COLLECTPRIZE_TOURNAMENT: "Error in updating prize",
  DBDEDUCTREALCHIPS_DEDUCTCHIPSONSIT_TABLEREMOTE: "Deduct chips on sit failed!",
  DBREMOVETABLEFAIL_TABLEREMOTE: "Error while removing table in db - ",
  DBSAVETABLEFAIL_TABLEREMOTE: "Error while saving table in db - ",
  DBGETTABLE_GETTABLEVIEW_TABLEREMOTE:
    "Unable to fetch tournament table data. Please try again",
  DBGETCUSTOMERUSER_JOINPLAYERINQUEUE_INSUFFICIENTAMOUNT_TABLEMANAGER:
    "You have insufficient chips in your account. Please update your chips balance.",
  DBGETCUSTOMERUSER_JOINPLAYERINQUEUEFAIL_TABLEMANAGER:
    "Sorry, we are unable to fetch your data. Please try again",
  DBGETCUSTOMERUSER_JOINPLAYERINQUEUEALREADYINWAITINGLIST_TABLEMANAGER:
    "You have already joined waiting list for this table.",
  DBGETCUSTOMERUSER_JOINPLAYERINQUEUEEMPTYSEATS_TABLEMANAGER:
    "We have many tables empty. Please join them directly from lobby",
  DBGETTABLE_ASSIGNPLAYERSTOCHANNELFAIL_SIMILARTABLE:
    "Unable to fetch players data. Please try again",
  DBCREATEHANDTAB_FAIL_SETTABLECONFIG:
    "Unable to store initiated hand hostory record for this table! - ",
  //noor
  IMDB_GETALLTABLEBYTOURNAMENTID__FAILED_PLAYERSHUFFLING:
    "Error in getting channels from in inMemoryDb or No channel available",
  IMDBUPDATESEATS_UPDATESEATSANDSHUFFLEID_FAILED_PLAYERSHUFFLING:
    "Error in updateSeats in updateSeatsAndShuffleId",
  DB_CREATENOTES_SUCCESS_PLAYERNOTES: "Notes created _successfully",
  DB_UPDATENOTES_SUCCESS_PLAYERNOTES: "Notes updated _successfully",
  DB_FINDNOTES_FAILED_PLAYERNOTES:
    "Error in getting notes in inserting notes in db",
  DB_FINDNOTES_DUPLICATE_PLAYERNOTES: "notes for this player already exist",
  DB_CREATENOTES_FAILED_PLAYERNOTES: "Error in inserting notes in db",
  DB_UPDATENOTES_FAILED_PLAYERNOTES: "Error in updating notes in db",
  DB_DELETENOTES_FAILED_PLAYERNOTES: "Error in deleting notes in db",
  DB_FINDNOTES_NOTFOUND_PLAYERNOTES: "No notes found",
  DB_GETTOURNAMENTROOM_FAILED_PLAYERSHUFFLING:
    "Sorry, we are unable to download tournamnet data. Please register in another tournament. ",
  DB_LISTTOURNAMENTROOM_NOTFOUND_QUICKSEAT:
    "Sorry, tournament you are looking for has been completed. Please join another",
  DB_LISTTOURNAMENTBYTIMESPAN_FAILED_QUICKSEAT:
    "Error Occured in getting tournaments",
  DB_LISTTOURNAMENTBYTIMESPAN_NOTFOUND_QUICKSEAT:
    "Sorry, tournament you are looking for has been completed. Please join another",
  DB_COUNTTOURNAMENTUSERS_FAILED_QUICKSEAT:
    "Unable to fetch refgistered players data. Please try again",
  DB_UPDATEUSERFORLOYALITY_SUCCESS_REWARDRAKE:
    "Player loyality has been update",
  DB_FUNDTRANSFERHISTROY_SUCCESS_REWARDRAKE:
    "Funds has been successfully transferred to your acocunt",
  DB_FUNDRAKE_SUCCESS_REWARDRAKE: "Rake fund submitted _successfully",
  DB_UPDATETEAFFILIATERAKEBALANCE_SUCCESS_REWARDRAKE:
    "You amount has been transfred to selected user",
  DB_COMPANYRAKEBALANCE_SUCCESS_REWARDRAKE:
    "Company bal is going to decrease after rake commision",
  DB_FUNDTRANSFERHISTROY_FAILED_REWARDRAKE:
    "Sorry, something went wrong, please logout and login again",
  DB_FINDAFFILIATE_FAILED_REWARDRAKE:
    "Sorry, something went wrong, please logout and login again",
  DB_UPDATEUSERFORLOYALITY_FAILED_REWARDRAKE:
    "Sorry, could not update your data. Please try again",
  DB_FINDALLLOYALTYLEVEL_FAILED_REWARDRAKE:
    "Sorry, something went wrong, please logout and login again",
  DB_CHKPLAYERRAKEFORLOYALITY_FAILED_REWARDRAKE:
    "Sorry, something went wrong, please logout and login again",
  DB_FUNDRAKE_FAILED_REWARDRAKE:
    "Sorry, something went wrong, please logout and login again",
  DB_FINDUSER_FAILED_REWARDRAKE:
    "Sorry, something went wrong, please logout and login again",
  DB_UPDATETEAFFILIATERAKEBALANCE_FAILED_REWARDRAKE:
    "Sorry, something went wrong, please logout and login again",
  DB_COMPANYRAKEBALANCE_FAILED_REWARDRAKE:
    "Sorry, something went wrong, please logout and login again",
  DB_GETTOURNAMENTROOM_FAILED_REWARDRAKE: "Error in getting tournament Room",
  DB_FINDTOURNAMENTUSER_FAILED_REWARDRAKE: "Error in getting tournamentUser",
  DB_FINDTOURNAMENTUSER_NOUSER_REWARDRAKE:
    "Unable to fetch tournament players data. Please try again",
  DB_GETTOURNAMENTROOM_FAILED_SATELLITETOURNAMENT:
    "Sorry, we are unable to download tournamnet data. Please register in another tournament. ",
  DB_CREATETOURNAMENTUSERS_FAILED_SATELLITETOURNAMENT:
    "Error in create tournament user",
  DB_GETTRANSACTIONHISTORY_FAILED_USER: "error in find transaction from db",
  DB_GETTRANSACTIONHISTORY_NOTRANSACTION_USER: "no transaction found",
  DB_GETTRANSACTIONHISTORY_DATAREQUIRED_USER:
    "playerId, lowerLimit and upperLimit is required",
  DB_GETWALLETINFO_FAILED_USER: "error in getting wallet data from db",
  DB_GETWALLETINFO_NODATAFOUND_USER:
    "Sorry, unable to fetch your data. Please logout and login again",
  DB_GETWALLETINFO_IDREQUIRED_USER: "Please enter your player id",
  DB_FINDUSER_FAILED_USER: "error in getting user from db",
  DB_UPDATEUSER_FAILED_USER: "error in update chips from db",
  DB_UPDATEUSERCHIPS_SUCCESS_USER:
    "Chips has been successfully added to your account",
  DB_UPDATEUSERCHIPS_FAILED_USER: "no user found for update",
  DB_FINDUSERIDNOTFOUND_USER: "no user found by this Id",
  DB_UPDATECONFIGURATION_FAILED_USER: "unable to update configuration dbError",
  DB_UPDATECONFIGURATION_SUCCESS_USER: "_successfully updated configuration",
  DB_UPDATECONFIGURATION_ERROR_USER: "not able to update config",
  DB_CREATECONFIGURATION_FAILED_USER: "unable to create configuration dbError",
  DB_CREATECONFIGURATION_ERROR_USER: "not able to create config",
  DB_GETCONFIGURATION_FAILED_USER: "unable to find configuration dbError",
  DB_GETCONFIGURATION_ERROR_USER: "not able to find config type",

  //shakshi
  DB_ERROR_GETTING_CHANNEL_MEMORYDB: "Error in getting channel from inMemoryDb",
  DB_ERROR_GETTING_CHANNEL_MEMORY: "Error in  getting channels from in memory",
  DB_ERROR_GETTING_TOURNAMENTROOM: "Error in getting tournamentRoom",
  DB_ERROR_GETTING_TOURNAMENT_CHANNELS: "Error in getting tournament channels",
  DB_ERROR_GETTING_BINDRULE: "Error in getting bind rule",
  DB_ERROR_GETTING_BINDINFO: "Error in getting blind info",
  DB_ERROR_GETTING_INACTIVE_PLAYERS_TOURNAMENT:
    "Sorry, rank cannot be calculated now. Please check back after some time",
  DB_ERROR_GETTING_ENROLLED_PLAYERS_TOURNAMENT:
    "Sorry, rank cannot be calculated now. Please check back after some time",
  DB_ERROR_GETTING_ENROLLED_PLAYERS: "Error in getting enrolled players",
  DB_ERROR_GETTING_FAVOURITE_SEAT_PLAYER:
    "Sorry, unable to fetch your favorite tables. Please try again",
  DB_ERROR_GETTING_RAKE_RULE: "Unable to get rake rule for this table.",
  DB_ERROR_GETTING_MEMORY: "Error in getting in Memory tables",
  DB_ERROR_GETTING_PRIZE: "getting prize db Error !!!",
  DB_ERROR_UPDATE_KEY: "Error in updating isOnBreak key",
  DB_ERROR_UPDATE_TOURNAMENTSTATE: "Error in updating tounrmentState",
  DB_ERROR_UPDATE_PLAYER_CHIPS: "Error in updating player chips",
  DB_ERROR_UPDATE_FAILED_USER: "Failed to update user",
  DB_ERROR_UPDATE_USER_SEND_MAIL:
    "Not able to update user in send email error occoured by db",
  DB_ERROR_COUNT_ENROLLED_USERS: "error in count in enrolled users ",
  DB_ERROR_COUNT_TOURNAMENT_USERS: "error in count in tournament users ",
  DB_ERROR_INSERT_RANKS: "Error in insert ranks",
  DB_ERROR_CREATE_USERDOCUMENT: "Error in creating user document in db",
  DB_ERROR_FINDING_USER: "Error in finding user from db",
  DB_ERROR_PROCESSING_TABLE: "Error in processing tables",
  DB_ERROR_PROCESS_CHANNELDETAILS: "Error in process channelDetails",
  DB_ERROR_SOMETHING_WRONG_TABLE:
    "Sorry, unable to fetch the table. Please try again",
  DB_ERROR_SOMETHING_WRONG_GET_LIST:
    "Something went wrong!! unable to get list",
  DB_ERROR_SOMETHING_WRONG_UPDATE: "Something went wrong!! unable to update",
  DB_ERROR_SOMETHING_WRONG_GETTING_TOURNAMENT:
    "Sorry, unable to fetch the tournament data. Please try again or play another tournament",
  DB_ERROR_SOMETHING_WRONG_CREATE_TABLE_TOURNAMENT:
    "Something went wrong!! unable to create tables for tournament!",
  DB_ERROR_REPORT_ISSUE_FAIL: "Report issue failed !",
  DB_ERROR_GET_ISSUE_FAIL: "Get issue failed!",
  DB_ERROR_RESETTING_AVGPOT_FLOPPERCENT_FAILED:
    "Resetting avg-pot and flop-percent failed",
  DB_ERROR_CHANGE_PASSWORD: "Unable to change passowrd. Please try again",
  DB_TOURNAMENT_ROOM_NOTFOUND:
    "Sorry, we are unable to download tournamnet data. Please register in another tournament. ",
  DB_TOURNAMENT_NOT_RUNING:
    "Sorry, tournament you are looking for is over. Please play in other tournament",
  DB_CHANNEL_NOTFOUND: "Channel not found in database!",
  DB_PLAYER_EMAIL_NOT_VERIFIED:
    "Please verify your Email Id to login. Verification link has been already sent to your registered Email Id.",
  DB_BLOCK_USER_BY_ADMIN:
    "Sorry, you have been blocked to play on our software",
  DB_USERNAME_PASSWORD_INCORRECT: "Please check username/password again.",
  DB_INVALID_PASSWORD: "Please check the password and try again.",
  DB_INVALID_TOURNAMENT:
    "Sorry, tournament you are looking for is over. Please play in other tournament",
  DB_INVALID_USER_INFO:
    "Sorry, unable to fetch the data. Please logout and login again",
  DB_SUCCESS_CHANGE_PASSWORD: "Password successfully updated",

  //nishant
  CALCULATERANKSFORFINISHEDSTATE_DB_DYNAMICRANKS: "Ranks not available",
  GETUSERINFO_DB_DYNAMICRANKS:
    "Sorry, unable to fetch the tournament data. Please try again or play another tournament",
  GETREGISTEREDTOURNAMENTUSERS_DB_DYNAMICRANKS:
    "Sorry, unable to fetch the tournament data. Please try again or play another tournament",
  DB_UPDATESTACKTABLE_FINDTABLEBYID_UPDATEAVGPOT_HANDLEGAMEOVER:
    "Something went wrong!! unable to update avgpot on Game Over !",
  DB_FINDTABLEBYID_UPDATEAVGPOT_HANDLEGAMEOVER:
    "Something went wrong!! unable to update avgpot on Game Over !",
  DB_UPDATEHANDTAB_UPDATEHANDTAB_HANDLEGAMEOVER:
    "Error while updating handtab =  ",
  IMDBREMOTEACTIVITY_REMOTEACTIVITY_LEAVEREMOTE:
    "Unable to remove player activity from in memory",
  IMDBREMOVEPLAYERJOIN_REMOVEFROMTABLE_LEAVEREMOTE:
    "Unable to remove player record in join - ",
  IMDBREMOVEPLAYERJOIN_REMOVEPLAYER_LEAVEREMOTE:
    "Unable to store player record in join - ",
  DBFINDONE_PERFORMACTIONDIVERT_DBFINDANDMODIFY_ASYNCRETRY_ASYNCWATERFALL_KEYVALIDATORS_VALIDATEKEYSETS_LOCKTABLELOCK_LOCKTABLE:
    "Table object missing after response from - ",
  DBFINDANDMODIFY_ASYNCRETRY_ASYNCWATERFALL_KEYVALIDATORS_VALIDATEKEYSETS_LOCKTABLELOCK_LOCKTABLE:
    "Sorry, table you are looking for does not exist. Please play on other table",
  DBFINDANDMODIFY_ASYNCRETRY_ASYNCWATERFALL_KEYVALIDATORS_VALIDATEKEYSETS_LOCKTABLELOCK_LOCKTABLE2:
    "Error while fetching cache table from database!",
  DBFINDUSER_VALIDATEKEYSETS_VERIFYEMAIL_USERCONTROLLER_USER:
    "error from db in findUser",
  DBUPDATEUSER_VALIDATEKEYSETS_VERIFYEMAIL_USERCONTROLLER_USER:
    "DB error in update user",
  DBUPDATEDUSER_VALIDATEKEYSETS_VERIFYEMAIL_USERCONTROLLER_USER:
    "Congratulations, your email is successfully verified",
  DBNOTUPDATEDUSER_VALIDATEKEYSETS_VERIFYEMAIL_USERCONTROLLER_USER:
    "Sorry, please try to login again",
  DBFINDUSER_VALIDATEKEYSETS_SENDOTP_USERCONTROLLER_USER:
    "error in find user by db",
  DBCREATEOTP_VALIDATEKEYSETS_SENDOTP_USERCONTROLLER_USER:
    "Error in saving OTP to database",
  OTPERROR_DBCREATEOTP_VALIDATEKEYSETS_SENDOTP_USERCONTROLLER_USER:
    "Error in sending OTP",
  OTPSUCCESS_DBCREATEOTP_VALIDATEKEYSETS_SENDOTP_USERCONTROLLER_USER:
    "OTP sent successfully",
  WRONGCREDENTIALSOTP_DBCREATEOTP_VALIDATEKEYSETS_SENDOTP_USERCONTROLLER_USER:
    "some credentials are wrong in sending OTP",
  NOTSENTOTP_DBCREATEOTP_VALIDATEKEYSETS_SENDOTP_USERCONTROLLER_USER:
    "not able to send OTP sms service error",
  MOBILENUMBERERROR_DBFINDUSER_VALIDATEKEYSETS_SENDOTP_USERCONTROLLER_USER:
    "invalid Mobile Number or mobileNumber not updated in user profile",
  NOTUSER_DBFINDUSER_VALIDATEKEYSETS_SENDOTP_USERCONTROLLER_USER:
    "invalid playerId",
  DBFINDOTP_VALIDATEKEYSETS_VERIFYOTP_USERCONTROLLER_USER:
    "Error in finding OTP in database",
  DBUPDATEDUSER_VALIDATEKEYSETS_VERIFYOTP_USERCONTROLLER_USER:
    "Error in updating mobile number in db",
  UPDATEDUSER_DBUPDATEDUSER_VALIDATEKEYSETS_VERIFYOTP_USERCONTROLLER_USER:
    "OTP verified successfully",
  NOTUPDATEDUSER_DBUPDATEDUSER_VALIDATEKEYSETS_VERIFYOTP_USERCONTROLLER_USER:
    "not able to update user object OTP not verified successfully",
  B_GETTOURNAMENTROOM_GTDENABLED_GTDAMOUNT: "Unable to get GTD amount",
  DB_GETTOURNAMENTROOM_GETTOURNAMENTUSERS: "Unable to get tournament users!",
  DB_GETTOURNAMENTROOM_TOURNAMENTID:
    "Tournament ID or game version count missing!",
  // Amrendra
  DB_INSERTANTIBANKING_FAIL:
    "Unable to insert anti banking details in database.",
  DB_REMOVEANTIBANKING_FAIL:
    "Unable to remove anti banking details from database.",
  DB_GETANTIBANKING_FAIL: "Unable to get anti banking details from database.",
  DB_UPDATEOBSERVERRECORD_FAIL:
    "Unable to update observer record from database.",
  DB_SAVETABLESPECTATOR_FAIL: "Unable to save player as spectator for table.",
  DB_REMOVETABLESPECTATOR_FAIL:
    "Unable to remove spectator record from database.",
  DB_GETUSERSETTINGS_FAIL:
    "Unable to get players setting details from databse.",
  DB_GETVIDEO_FAIL: "Unable to get video details from databse.",
  DB_NOVIDEOEXISTS: "No video details found for this game.",
  DB_GETHISTORYBYVIDEO_FAIL:
    "Unable to get hand history details for this video.",

  //kamal
  DB_GETSPACTATOR_SETTING_FAIL: "Unable to get spectator for table setting.",
  DB_PLAYER_TABLESETTING_UPDATE_FAIL:
    "Unable to get spectator for table setting.",
};

export const popupTextManager = {
  falseMessages,
  dbQyeryInfo,
};

export default popupTextManager;