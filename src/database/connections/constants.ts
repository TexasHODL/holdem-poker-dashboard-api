export enum PokerDBModel {
  User = 'users',
  InstantBonusHistory = 'instantBonusHistory',
  BonusData = 'bonusdata',

  MobileOtp = 'mobileOtp',
  Table = 'tables',
  VipAccumulation = 'vipAccumulation',
  SpamWord = 'spamWords',
  VipRelease = 'vipRelease',

  Antibanking = 'antibanking',
  UserSession = 'userSession',
  PendingPasswordReset = 'pendingPasswordResets',
  ScheduleTask = 'scheduleTasks',
  LeaderboardWinners = 'leaderboardWinners',
  LeaderboardParticipant = 'leaderboardParticipant',

  PlayerChat = 'playerChat',
  Friend = 'friends',
  ScheduledExpiry = 'scheduledExpiry',
  PalyerBankDetails = 'palyerBankDetails',
}

export enum AdminDBModel {
  Passbook = 'passbook',
  // PlayerRakeBack = 'playerRakeBack',
  LoyaltyPoint = 'loyaltyPoints',
  // Fundrake = 'fundrake',
  Affiliates = 'affiliates',
  TransactionHistory = 'transactionHistory',
  ChipstransferToPlayerHistory = 'chipstransferToPlayerHistory',
  ChipsTransferToAffiliateHistory = 'chipsTransferToAffiliateHistory',
  ModuleAdmin = 'moduleAdmin',
  ModuleAffiliate = 'moduleAffiliates',
  LoggedInAffiliate = 'loggedInAffiliates',
  PlayerParentHistory = 'playerParentHistory',
  DirectCashout = 'cashoutDirect',
  DirectCashoutHistory = 'directCashoutHistory',
  CashoutHistory = 'cashoutHistory',
  PendingCashOutRequest = 'pendingCashOutRequest',
  ApproveCashOutRequest = 'approveCashOutRequest',
  Leaderboard = 'leaderboard',
  LeaderboardSet = 'leaderboardSet',
  ScratchCardHistory = 'scratchCardHistory',
  BonusCollection = 'bonusCollection',

  ScratchCardPending = 'scratchCardPending',
  PromoBonus = 'promoBonus',
  InstantChipsPulledHistory = 'instantChipsPulledHistory',
  Deposit = 'deposit',
  RakeReport = 'rakeReport',
  RakebackPlayerHistory = 'rakebackPlayerHistory',
  RakebackConfiguration = 'rakebackConfiguration',
  RakebackHistory = 'rakebackHistory',
}

export enum LogDBModel {
  PlayerBlockedRecord = 'playerBlockedRecords',
  PlayerArchive = 'playerArchive',
  HandHistory = 'handHistory',
  PlayerLoginData = 'playerLoginData',
  GameActivity = 'gameActivity',
  HandTab = 'handTab',
  TableUpdateRecord = 'tableUpdateRecords',
}

export enum InMemoryDBModel {
  Table = 'tables',
  TableJoinRecord = 'tableJoinRecord',
}

export enum FinanceDbModel {
  DailyBalanceSheet = 'dailyBalanceSheet',
  Fundrake = 'fundrake',
  BalanceSheet = 'balanceSheet',
  PlayerRakeBack = 'playerRakeBack',
}
