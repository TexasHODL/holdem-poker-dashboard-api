import { Schema, model } from 'mongoose';

export const dailyBalanceSheetSchema = new Schema(
  {
    doc: {
      totalFundTranferredToAgent: {
        type: Number,
      },
      totalTranferToPlayerByAgent: {
        type: Number,
      },
      totalTranferToPlayerBySubagent: {
        type: Number,
      },
      totalTranferToPlayerByAdmin: {
        type: Number,
      },
      totalRakeAvailableAgent: {
        type: Number,
      },
      totalRakeAvailablesSubAgent: {
        type: Number,
      },
      totalRakeAvailableAffiliate: {
        type: Number,
      },
      totalRakeAvailableSubAffiliate: {
        type: Number,
      },
      subagentArr: {
        type: [String],
      },
      totalRakeGeneratedByAgent: {
        type: Number,
      },
      totalRakeGeneratedByAffiliate: {
        type: Number,
      },
      totalRakeGeneratedBySubaff: {
        type: Number,
      },
      totalRakeGeneratedBySubagent: {
        type: Number,
      },
      subAgentPendingRakeCashoutToAgent: {
        type: Number,
      },
      subAgentPendingRealCashoutToAgent: {
        type: Number,
      },
      playerPendingCashoutToAgent: {
        type: Number,
      },
      playerPendingCashoutToSubAgent: {
        type: Number,
      },
      totalSubAgentRakeCashoutSucess: {
        type: Number,
      },
      totalSubAgentRealCashoutSucess: {
        type: Number,
      },
      totalPlayerSucessCashoutsToAgent: {
        type: Number,
      },
      totalPlayerSucessCashoutsToSubagent: {
        type: Number,
      },
      totalTransferToSubAgentByAgent: {
        type: Number,
      },
      leaderboardWinning: {
        type: Number,
      },
      instantChipsPulled: {
        type: Number,
      },
      lockedBonusReleased: {
        type: Number,
      },
      instantBonusReleased: {
        type: Number,
      },
      lockedBonusAmountGenerated: {
        type: Number,
      },
      instantBonusAmountGenerated: {
        type: Number,
      },
      totalTds: {
        type: Number,
      },
      totalPromotionalChips: {
        type: Number,
      },
      totalPlayerScratchCardAmount: {
        type: Number,
      },
      totalRakeGeneratedByPlayers: {
        type: Number,
      },
      totalGST: {
        type: Number,
      },
      totalPlayerRakeBack: {
        type: Number,
      },
      totalPlayerInstantChipsAvailable: {
        type: Number,
      },
      totalPlayerRealChipsAvailable: {
        type: Number,
      },
      playerTotalRakebackReleased: {
        type: Number,
      },
      playerTotalChipsOnTable: {
        type: Number,
      },
      playerTotalInstantChipsOnTable: {
        type: Number,
      },
      totalPotAmountOnTable: {
        type: Number,
      },
      totalRoundBetAmountInGame: {
        type: Number,
      },
      totalOnlineChipsAdded: {
        type: Number,
      },
      totalRakeGeneratedByAdmin: {
        type: Number,
      },
      totalPlayerCashoutSuccessToAdmin: {
        type: Number,
      },
      playerCashoutSuccessNetAmtToAdmin: {
        type: Number,
      },
      playerCashoutSuccessTdsAmtToAdmin: {
        type: Number,
      },
      playerCashoutSuccessProcessingFeesToAdmin: {
        type: Number,
      },
      totalAgentCashoutRealSuccessToAdmin: {
        type: Number,
      },
      agentCashoutRealSuccessNetAmtToAdmin: {
        type: Number,
      },
      agentCashoutRealSuccessTdsAmtToAdmin: {
        type: Number,
      },
      agentCashoutRealSuccessProcessingFeesToAdmin: {
        type: Number,
      },
      totalAgentCashoutRakeSuccessToAdmin: {
        type: Number,
      },
      agentCashoutRakeSuccessNetAmtToAdmin: {
        type: Number,
      },
      agentCashoutRakeSuccessTdsAmtToAdmin: {
        type: Number,
      },
      agentCashoutRakeSuccessProcessingFeesToAdmin: {
        type: Number,
      },
      totalAffCashoutSuccessToAdmin: {
        type: Number,
      },
      affCashoutSuccessNetAmtToAdmin: {
        type: Number,
      },
      affCashoutSuccessTdsAmtToAdmin: {
        type: Number,
      },
      affCashoutSuccessProcessingFeesToAdmin: {
        type: Number,
      },
      totalSubAffCashoutSuccessToAdmin: {
        type: Number,
      },
      subAffCashoutSuccessNetAmtToAdmin: {
        type: Number,
      },
      subAffCashoutSuccessTdsAmtToAdmin: {
        type: Number,
      },
      subAffCashoutSuccessProcessingFeesToAdmin: {
        type: Number,
      },
      totalRealAgentCashoutInApproved: {
        type: Number,
      },
      agentRealCashoutNetAmtInApproved: {
        type: Number,
      },
      affRakeCashoutTdsAmtInApproved: {
        type: Number,
      },
      totalPlayerCashoutAmtPending: {
        type: Number,
      },
      playerCashoutNetAmtPending: {
        type: Number,
      },
      playerCashoutTdsAmtPending: {
        type: Number,
      },
      playerCashoutProcessingFeesAmtPending: {
        type: Number,
      },
      totalAgentCashoutRealAmtPending: {
        type: Number,
      },
      agentCashoutRealNetAmtPending: {
        type: Number,
      },
      agentCashoutRealTdsAmtPending: {
        type: Number,
      },
      totalAgentCashoutRealProcessingFeesAmtPending: {
        type: Number,
      },
      totalAgentCashoutRakeAmtPending: {
        type: Number,
      },
      agentCashoutRakeNetAmtPending: {
        type: Number,
      },
      agentCashoutRakeTdsAmtPending: {
        type: Number,
      },
      totalAgentCashoutRakeProcessingFeesAmtPending: {
        type: Number,
      },
      totalAffCashoutRakeAmtPending: {
        type: Number,
      },
      affCashoutRakeNetAmtPending: {
        type: Number,
      },
      affCashoutRakeTdsAmtPending: {
        type: Number,
      },
      totalAffCashoutRakeProcessingFeesAmtPending: {
        type: Number,
      },
      totalSubaffCashoutRakeAmtPending: {
        type: Number,
      },
      subaffCashoutRakeNetAmtPending: {
        type: Number,
      },
      subaffCashoutRakeTdsAmtPending: {
        type: Number,
      },
      totalsubAffCashoutRakeProcessingFeesAmtPending: {
        type: Number,
      },
      chipsPulledSubAgentByAdminRealInPending: {
        type: Number,
      },
      chipsPulledSubAgentByAdminRakelInPending: {
        type: Number,
      },
      chipsPulledSubAgentByAdminRealInApproved: {
        type: Number,
      },
      chipsPulledSubAgentByAdminRakeInApproved: {
        type: Number,
      },
      chipsPulledSubAgentByAdminRealApproved: {
        type: Number,
      },
      chipsPulledSubAgentByAdminRakeApproved: {
        type: Number,
      },
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);

export default model(
  'DailyBalanceSheet',
  dailyBalanceSheetSchema,
  'dailyBalanceSheet',
);
