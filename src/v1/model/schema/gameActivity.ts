import { LogDBModel } from '@/database/connections/constants';
import { getLogModel } from '@/database/connections/helpers';
import { Schema, model } from 'mongoose';

export const gameActivitySchema = new Schema(
  {
    category: {
      type: String,
    },
    subCategory: {
      type: String,
    },
    logType: {
      type: String,
    },
    channelId: {
      type: Schema.Types.ObjectId,
    },
    comment: {
      type: String,
    },
    rawResponse: {
      channelId: {
        type: Schema.Types.ObjectId,
      },
      actionName: {
        type: String,
      },
      data: {
        activePlayers: {
          type: Array,
        },
        delaerFound: {
          type: Boolean,
        },
        currentDealerSeatIndex: {
          type: Number,
        },
        dealerOrSmallBlindLeft: {
          type: Boolean,
        },
        smallBlindLeft: {
          type: Boolean,
        },
        dealerLeft: {
          type: Boolean,
        },
        sameDealerSmallBlind: {
          type: Boolean,
        },
        totalSeatIndexOccupied: {
          type: [Number],
        },
        smallBlindSet: {
          type: Boolean,
        },
        forceBlind: {},
        dbResponse: {
          success: {
            type: Boolean,
          },
          channelId: {
            type: Schema.Types.ObjectId,
          },
          smallBlindChips: {
            type: Number,
          },
          bigBlindChips: {
            type: Number,
          },
          straddleChips: {
            type: Number,
          },
          smallBlindIndex: {
            type: Number,
          },
          bigBlindIndex: {
            type: Number,
          },
          straddleIndex: {
            type: Number,
          },
          smallBlind: {
            type: Number,
          },
          bigBlind: {
            type: Number,
          },
          pot: {
            type: Array,
          },
          totalPot: {
            type: Number,
          },
          moves: {
            type: [Number],
          },
          forceBlind: {},
          tableSmallBlind: {
            type: Number,
          },
          tableBigBlind: {
            type: Number,
          },
        },
        dcResponse: {
          players: {
            type: [
              {
                playerId: {
                  type: String,
                },
                channelId: {
                  type: Schema.Types.ObjectId,
                },
                playerName: {
                  type: String,
                },
                networkIp: {
                  type: String,
                },
                deviceType: {
                  type: String,
                },
                active: {
                  type: Boolean,
                },
                chips: {
                  type: Number,
                },
                instantBonusAmount: {
                  type: Number,
                },
                chipsToBeAdded: {
                  type: Number,
                },
                seatIndex: {
                  type: Number,
                },
                imageAvtar: {
                  type: String,
                },
                cards: {
                  type: [
                    {
                      type: {
                        type: String,
                      },
                      rank: {
                        type: Number,
                      },
                      name: {
                        type: String,
                      },
                      priority: {
                        type: Number,
                      },
                    },
                  ],
                },
                moves: {
                  type: Array,
                },
                preCheck: {
                  type: Number,
                },
                bestHands: {
                  type: String,
                },
                state: {
                  type: String,
                },
                lastBet: {
                  type: Number,
                },
                lastMove: {
                  type: String,
                },
                totalRoundBet: {
                  type: Number,
                },
                totalGameBet: {
                  type: Number,
                },
                isMuckHand: {
                  type: Boolean,
                },
                lastRoundPlayed: {
                  type: String,
                },
                preActiveIndex: {
                  type: Number,
                },
                nextActiveIndex: {
                  type: Number,
                },
                isDisconnected: {
                  type: Boolean,
                },
                bigBlindMissed: {
                  type: Number,
                },
                isAutoReBuy: {
                  type: Boolean,
                },
                isRunItTwice: {
                  type: Boolean,
                },
                autoReBuyAmount: {
                  type: Number,
                },
                isPlayed: {
                  type: Boolean,
                },
                sitoutNextHand: {
                  type: Boolean,
                },
                sitoutNextBigBlind: {
                  type: Boolean,
                },
                autoSitout: {
                  type: Boolean,
                },
                sitoutGameMissed: {
                  type: Number,
                },
                disconnectedMissed: {
                  type: Number,
                },
                hasPlayedOnceOnTable: {
                  type: Boolean,
                },
                isForceBlindEnable: {
                  type: Boolean,
                },
                isWaitingPlayer: {
                  type: Boolean,
                },
                isStraddleOpted: {
                  type: Boolean,
                },
                isJoinedOnce: {
                  type: Boolean,
                },
                isAutoReBuyEnabled: {
                  type: Boolean,
                },
                isAutoAddOnEnabled: {
                  type: Boolean,
                },
                onGameStartBuyIn: {
                  type: Number,
                },
                onSitBuyIn: {
                  type: Number,
                },
                roundId: {
                  type: String,
                },
                totalGames: {
                  type: Number,
                },
                timeBankSec: {
                  type: Number,
                },
                autoFoldCount: {
                  type: Number,
                },
                activityRecord: {
                  seatReservedAt: {
                    type: Date,
                  },
                  lastMovePlayerAt: {
                    type: Date,
                  },
                  disconnectedAt: {
                    type: Date,
                  },
                  lastActivityAction: {
                    type: String,
                  },
                  lastActivityTime: {
                    type: Number,
                  },
                },
                tournamentData: {
                  userName: {
                    type: String,
                  },
                  isTournamentSitout: {
                    type: Boolean,
                  },
                  isTimeBankUsed: {
                    type: Boolean,
                  },
                  timeBankStartedAt: {
                    type: Date,
                  },
                  totalTimeBank: {
                    type: String,
                  },
                  timeBankLeft: {
                    type: String,
                  },
                  rebuyChips: {
                    type: Number,
                  },
                },
                precheckValue: {
                  type: String,
                },
              },
            ],
          },
        },
        dataPlayers: {
          type: [
            {
              playerId: {
                type: String,
              },
              playerName: {
                type: String,
              },
              chips: {
                type: Number,
              },
              state: {
                type: String,
              },
              moves: {
                type: Array,
              },
            },
          ],
        },
        vgsResponse: {
          removed: {
            type: Array,
          },
          players: {
            type: [
              {
                playerId: {
                  type: String,
                },
                channelId: {
                  type: Schema.Types.ObjectId,
                },
                playerName: {
                  type: String,
                },
                networkIp: {
                  type: String,
                },
                deviceType: {
                  type: String,
                },
                active: {
                  type: Boolean,
                },
                chips: {
                  type: Number,
                },
                instantBonusAmount: {
                  type: Number,
                },
                chipsToBeAdded: {
                  type: Number,
                },
                seatIndex: {
                  type: Number,
                },
                imageAvtar: {
                  type: String,
                },
                cards: {
                  type: [
                    {
                      type: {
                        type: String,
                      },
                      rank: {
                        type: Number,
                      },
                      name: {
                        type: String,
                      },
                      priority: {
                        type: Number,
                      },
                    },
                  ],
                },
                moves: {
                  type: Array,
                },
                preCheck: {
                  type: Number,
                },
                bestHands: {
                  type: String,
                },
                state: {
                  type: String,
                },
                lastBet: {
                  type: Number,
                },
                lastMove: {
                  type: String,
                },
                totalRoundBet: {
                  type: Number,
                },
                totalGameBet: {
                  type: Number,
                },
                isMuckHand: {
                  type: Boolean,
                },
                lastRoundPlayed: {
                  type: String,
                },
                preActiveIndex: {
                  type: Number,
                },
                nextActiveIndex: {
                  type: Number,
                },
                isDisconnected: {
                  type: Boolean,
                },
                bigBlindMissed: {
                  type: Number,
                },
                isAutoReBuy: {
                  type: Boolean,
                },
                isRunItTwice: {
                  type: Boolean,
                },
                autoReBuyAmount: {
                  type: Number,
                },
                isPlayed: {
                  type: Boolean,
                },
                sitoutNextHand: {
                  type: Boolean,
                },
                sitoutNextBigBlind: {
                  type: Boolean,
                },
                autoSitout: {
                  type: Boolean,
                },
                sitoutGameMissed: {
                  type: Number,
                },
                disconnectedMissed: {
                  type: Number,
                },
                hasPlayedOnceOnTable: {
                  type: Boolean,
                },
                isForceBlindEnable: {
                  type: Boolean,
                },
                isWaitingPlayer: {
                  type: Boolean,
                },
                isStraddleOpted: {
                  type: Boolean,
                },
                isJoinedOnce: {
                  type: Boolean,
                },
                isAutoReBuyEnabled: {
                  type: Boolean,
                },
                isAutoAddOnEnabled: {
                  type: Boolean,
                },
                onGameStartBuyIn: {
                  type: Number,
                },
                onSitBuyIn: {
                  type: Number,
                },
                roundId: {
                  type: String,
                },
                totalGames: {
                  type: Number,
                },
                timeBankSec: {
                  type: Number,
                },
                autoFoldCount: {
                  type: Number,
                },
                activityRecord: {
                  seatReservedAt: {
                    type: Date,
                  },
                  lastMovePlayerAt: {
                    type: Date,
                  },
                  disconnectedAt: {
                    type: Date,
                  },
                  lastActivityAction: {
                    type: String,
                  },
                  lastActivityTime: {
                    type: Number,
                  },
                },
                tournamentData: {
                  userName: {
                    type: String,
                  },
                  isTournamentSitout: {
                    type: Boolean,
                  },
                  isTimeBankUsed: {
                    type: Boolean,
                  },
                  timeBankStartedAt: {
                    type: Date,
                  },
                  totalTimeBank: {
                    type: String,
                  },
                  timeBankLeft: {
                    type: String,
                  },
                  rebuyChips: {
                    type: Number,
                  },
                },
                precheckValue: {
                  type: String,
                },
              },
            ],
          },
          startGame: {
            type: Boolean,
          },
          state: {
            type: String,
          },
          preGameState: {
            type: String,
          },
        },
      },
      serverType: {
        type: String,
      },
      table: {
        _id: {
          type: String,
        },
        channelId: {
          type: Schema.Types.ObjectId,
        },
        channelType: {
          type: String,
        },
        channelName: {
          type: Date,
        },
        serverId: {
          type: Date,
        },
        channelVariation: {
          type: String,
        },
        turnTime: {
          type: Number,
        },
        isPotLimit: {
          type: Boolean,
        },
        maxPlayers: {
          type: Number,
        },
        minPlayers: {
          type: Number,
        },
        smallBlind: {
          type: Number,
        },
        bigBlind: {
          type: Number,
        },
        isStraddleEnable: {
          type: Boolean,
        },
        minBuyIn: {
          type: Number,
        },
        maxBuyIn: {
          type: Number,
        },
        numberOfRebuyAllowed: {
          type: Number,
        },
        hourLimitForRebuy: {
          type: Number,
        },
        gameInfo: {
          TableName: {
            type: String,
          },
          GameVariation: {
            type: String,
          },
          ChipsType: {
            type: String,
          },
          BuyIn: {
            type: String,
          },
          Stakes: {
            type: String,
          },
          Rake: {
            type: Date,
          },
          RakeMultiPlayer: {
            type: Date,
          },
          RakeHeadsUp: {
            type: Date,
          },
          CapAmount: {
            type: Number,
          },
          MaxPlayers: {
            type: Number,
          },
          Straddle: {
            type: String,
          },
          TurnTime: {
            type: String,
          },
          AntiBanking: {
            type: String,
          },
        },
        rakeRules: {
          type: String,
        },
        rake: {
          rakePercentTwo: {
            type: Number,
          },
          rakePercentThreeFour: {
            type: Number,
          },
          rakePercentMoreThanFive: {
            type: Number,
          },
          capTwo: {
            type: Number,
          },
          capThreeFour: {
            type: Number,
          },
          capMoreThanFive: {
            type: Number,
          },
          minStake: {
            type: Number,
          },
          maxStake: {
            type: Number,
          },
        },
        gameInterval: {
          type: Number,
        },
        isRealMoney: {
          type: Boolean,
        },
        rebuyHourFactor: {
          type: Number,
        },
        isPrivate: {
          type: Boolean,
        },
        password: {
          type: Date,
        },
        blindMissed: {
          type: Number,
        },
        tournamentRules: {},
        roundId: {
          type: String,
        },
        videoLogId: {
          type: String,
        },
        state: {
          type: String,
        },
        stateInternal: {
          type: String,
        },
        roundCount: {
          type: Number,
        },
        deck: {
          type: [
            {
              type: {
                type: String,
              },
              rank: {
                type: Number,
              },
              name: {
                type: String,
              },
              priority: {
                type: Number,
              },
            },
          ],
        },
        players: {
          type: [
            {
              playerId: {
                type: String,
              },
              channelId: {
                type: Schema.Types.ObjectId,
              },
              playerName: {
                type: String,
              },
              networkIp: {
                type: String,
              },
              deviceType: {
                type: String,
              },
              active: {
                type: Boolean,
              },
              chips: {
                type: Number,
              },
              instantBonusAmount: {
                type: Number,
              },
              chipsToBeAdded: {
                type: Number,
              },
              seatIndex: {
                type: Number,
              },
              imageAvtar: {
                type: String,
              },
              cards: {
                type: [
                  {
                    type: {
                      type: String,
                    },
                    rank: {
                      type: Number,
                    },
                    name: {
                      type: String,
                    },
                    priority: {
                      type: Number,
                    },
                  },
                ],
              },
              moves: {
                type: Array,
              },
              preCheck: {
                type: Number,
              },
              bestHands: {
                type: String,
              },
              state: {
                type: String,
              },
              lastBet: {
                type: Number,
              },
              lastMove: {
                type: String,
              },
              totalRoundBet: {
                type: Number,
              },
              totalGameBet: {
                type: Number,
              },
              isMuckHand: {
                type: Boolean,
              },
              lastRoundPlayed: {
                type: String,
              },
              preActiveIndex: {
                type: Number,
              },
              nextActiveIndex: {
                type: Number,
              },
              isDisconnected: {
                type: Boolean,
              },
              bigBlindMissed: {
                type: Number,
              },
              isAutoReBuy: {
                type: Boolean,
              },
              isRunItTwice: {
                type: Boolean,
              },
              autoReBuyAmount: {
                type: Number,
              },
              isPlayed: {
                type: Boolean,
              },
              sitoutNextHand: {
                type: Boolean,
              },
              sitoutNextBigBlind: {
                type: Boolean,
              },
              autoSitout: {
                type: Boolean,
              },
              sitoutGameMissed: {
                type: Number,
              },
              disconnectedMissed: {
                type: Number,
              },
              hasPlayedOnceOnTable: {
                type: Boolean,
              },
              isForceBlindEnable: {
                type: Boolean,
              },
              isWaitingPlayer: {
                type: Boolean,
              },
              isStraddleOpted: {
                type: Boolean,
              },
              isJoinedOnce: {
                type: Boolean,
              },
              isAutoReBuyEnabled: {
                type: Boolean,
              },
              isAutoAddOnEnabled: {
                type: Boolean,
              },
              onGameStartBuyIn: {
                type: Number,
              },
              onSitBuyIn: {
                type: Number,
              },
              roundId: {
                type: String,
              },
              totalGames: {
                type: Number,
              },
              timeBankSec: {
                type: Number,
              },
              autoFoldCount: {
                type: Number,
              },
              activityRecord: {
                seatReservedAt: {
                  type: Date,
                },
                lastMovePlayerAt: {
                  type: Date,
                },
                disconnectedAt: {
                  type: Date,
                },
                lastActivityAction: {
                  type: String,
                },
                lastActivityTime: {
                  type: Number,
                },
              },
              tournamentData: {
                userName: {
                  type: String,
                },
                isTournamentSitout: {
                  type: Boolean,
                },
                isTimeBankUsed: {
                  type: Boolean,
                },
                timeBankStartedAt: {
                  type: Date,
                },
                totalTimeBank: {
                  type: String,
                },
                timeBankLeft: {
                  type: String,
                },
                rebuyChips: {
                  type: Number,
                },
              },
              precheckValue: {
                type: String,
              },
              isTimeBankUsed: {
                type: Boolean,
              },
              timeBankStartedAt: {
                type: Date,
              },
            },
          ],
        },
        onStartPlayers: {
          type: [String],
        },
        queueList: {
          type: Array,
        },
        handHistory: {
          type: Array,
        },
        roundName: {
          type: String,
        },
        roundBets: {
          type: [Number],
        },
        roundMaxBet: {
          type: Number,
        },
        lastBetOnTable: {
          type: Number,
        },
        minRaiseAmount: {
          type: Number,
        },
        maxRaiseAmount: {
          type: Number,
        },
        raiseDifference: {
          type: Number,
        },
        considerRaiseToMax: {
          type: Number,
        },
        lastRaiseAmount: {
          type: Number,
        },
        isBettingRoundLocked: {
          type: Boolean,
        },
        isRunItTwiceApplied: {
          type: Boolean,
        },
        isForceRit: {
          type: Boolean,
        },
        maxBetAllowed: {
          type: Number,
        },
        pot: {
          type: Array,
        },
        contributors: {
          type: [
            {
              playerId: {
                type: String,
              },
              amount: {
                type: Number,
              },
              tempAmount: {
                type: Number,
              },
            },
          ],
        },
        roundContributors: {
          type: [
            {
              playerId: {
                type: String,
              },
              amount: {
                type: Number,
              },
              tempAmount: {
                type: Number,
              },
            },
          ],
        },
        boardCard: {
          type: [Array],
        },
        preChecks: {
          type: [
            {
              playerId: {
                type: String,
              },
              set: {
                type: Number,
              },
              precheckValue: {
                type: String,
              },
            },
          ],
        },
        bestHands: {
          type: [
            {
              playerId: {
                type: String,
              },
              bestHand: {
                type: String,
              },
            },
          ],
        },
        dealerSeatIndex: {
          type: Number,
        },
        nextDealerSeatIndex: {
          type: Number,
        },
        smallBlindSeatIndex: {
          type: Number,
        },
        nextSmallBlindSeatIndex: {
          type: Number,
        },
        bigBlindSeatIndex: {
          type: Number,
        },
        dealerIndex: {
          type: Number,
        },
        smallBlindIndex: {
          type: Number,
        },
        bigBlindIndex: {
          type: Number,
        },
        straddleIndex: {
          type: Number,
        },
        currentMoveIndex: {
          type: Number,
        },
        firstActiveIndex: {
          type: Number,
        },
        turnTimeStartAt: {
          type: Number,
        },
        timeBankStartedAt: {
          type: Number,
        },
        isAllInOcccured: {
          type: Boolean,
        },
        isOperationOn: {
          type: Boolean,
        },
        actionName: {
          type: String,
        },
        operationStartTime: {
          type: String,
        },
        operationEndTime: {
          type: String,
        },
        createdAt: {
          type: Number,
        },
        gameStartTime: {
          type: Number,
        },
        lastBlindUpdate: {
          type: Number,
        },
        blindLevel: {
          type: Number,
        },
        vacantSeats: {
          type: Number,
        },
        occupiedSeats: {
          type: Number,
        },
        _v: {
          type: Number,
        },
        gamePlayers: {
          type: Array,
        },
        removedPlayers: {
          type: Array,
        },
        summaryOfAllPlayers: {
          1: {
            type: String,
          },
          2: {
            type: String,
          },
          7: {
            type: String,
          },
        },
        raiseBy: {
          type: String,
        },
        roundNumber: {
          type: String,
        },
        totalPotForRound: {
          type: Number,
        },
      },
      response: {
        data: {
          removed: {
            type: Array,
          },
          players: {
            type: [
              {
                playerId: {
                  type: String,
                },
                channelId: {
                  type: Schema.Types.ObjectId,
                },
                playerName: {
                  type: String,
                },
                networkIp: {
                  type: String,
                },
                deviceType: {
                  type: String,
                },
                active: {
                  type: Boolean,
                },
                chips: {
                  type: Number,
                },
                instantBonusAmount: {
                  type: Number,
                },
                chipsToBeAdded: {
                  type: Number,
                },
                seatIndex: {
                  type: Number,
                },
                imageAvtar: {
                  type: String,
                },
                cards: {
                  type: [
                    {
                      type: {
                        type: String,
                      },
                      rank: {
                        type: Number,
                      },
                      name: {
                        type: Date,
                      },
                      priority: {
                        type: Number,
                      },
                    },
                  ],
                },
                moves: {
                  type: Array,
                },
                preCheck: {
                  type: Number,
                },
                bestHands: {
                  type: String,
                },
                state: {
                  type: String,
                },
                lastBet: {
                  type: Number,
                },
                lastMove: {
                  type: String,
                },
                totalRoundBet: {
                  type: Number,
                },
                totalGameBet: {
                  type: Number,
                },
                isMuckHand: {
                  type: Boolean,
                },
                lastRoundPlayed: {
                  type: String,
                },
                preActiveIndex: {
                  type: Number,
                },
                nextActiveIndex: {
                  type: Number,
                },
                isDisconnected: {
                  type: Boolean,
                },
                bigBlindMissed: {
                  type: Number,
                },
                isAutoReBuy: {
                  type: Boolean,
                },
                isRunItTwice: {
                  type: Boolean,
                },
                autoReBuyAmount: {
                  type: Number,
                },
                isPlayed: {
                  type: Boolean,
                },
                sitoutNextHand: {
                  type: Boolean,
                },
                sitoutNextBigBlind: {
                  type: Boolean,
                },
                autoSitout: {
                  type: Boolean,
                },
                sitoutGameMissed: {
                  type: Number,
                },
                disconnectedMissed: {
                  type: Number,
                },
                hasPlayedOnceOnTable: {
                  type: Boolean,
                },
                isForceBlindEnable: {
                  type: Boolean,
                },
                isWaitingPlayer: {
                  type: Boolean,
                },
                isStraddleOpted: {
                  type: Boolean,
                },
                isJoinedOnce: {
                  type: Boolean,
                },
                isAutoReBuyEnabled: {
                  type: Boolean,
                },
                isAutoAddOnEnabled: {
                  type: Boolean,
                },
                onGameStartBuyIn: {
                  type: Number,
                },
                onSitBuyIn: {
                  type: Number,
                },
                roundId: {
                  type: String,
                },
                totalGames: {
                  type: Number,
                },
                timeBankSec: {
                  type: Number,
                },
                autoFoldCount: {
                  type: Number,
                },
                activityRecord: {
                  seatReservedAt: {
                    type: Date,
                  },
                  lastMovePlayerAt: {
                    type: Date,
                  },
                  disconnectedAt: {
                    type: Date,
                  },
                  lastActivityAction: {
                    type: String,
                  },
                  lastActivityTime: {
                    type: Number,
                  },
                },
                tournamentData: {
                  userName: {
                    type: String,
                  },
                  isTournamentSitout: {
                    type: Boolean,
                  },
                  isTimeBankUsed: {
                    type: Boolean,
                  },
                  timeBankStartedAt: {
                    type: Date,
                  },
                  totalTimeBank: {
                    type: String,
                  },
                  timeBankLeft: {
                    type: String,
                  },
                  rebuyChips: {
                    type: Number,
                  },
                },
                precheckValue: {
                  type: String,
                },
                isTimeBankUsed: {
                  type: Boolean,
                },
                timeBankStartedAt: {
                  type: Date,
                },
              },
            ],
          },
          startGame: {
            type: Boolean,
          },
          state: {
            type: String,
          },
          preGameState: {
            type: String,
          },
        },
        state: {
          type: String,
        },
        success: {
          type: Boolean,
        },
        table: {
          _id: {
            type: String,
          },
          channelId: {
            type: Schema.Types.ObjectId,
          },
          channelType: {
            type: String,
          },
          channelName: {
            type: Date,
          },
          serverId: {
            type: Date,
          },
          channelVariation: {
            type: String,
          },
          turnTime: {
            type: Number,
          },
          isPotLimit: {
            type: Boolean,
          },
          maxPlayers: {
            type: Number,
          },
          minPlayers: {
            type: Number,
          },
          smallBlind: {
            type: Number,
          },
          bigBlind: {
            type: Number,
          },
          isStraddleEnable: {
            type: Boolean,
          },
          minBuyIn: {
            type: Number,
          },
          maxBuyIn: {
            type: Number,
          },
          numberOfRebuyAllowed: {
            type: Number,
          },
          hourLimitForRebuy: {
            type: Number,
          },
          gameInfo: {
            TableName: {
              type: Date,
            },
            GameVariation: {
              type: String,
            },
            ChipsType: {
              type: String,
            },
            BuyIn: {
              type: String,
            },
            Stakes: {
              type: String,
            },
            Rake: {
              type: Date,
            },
            RakeMultiPlayers: {
              type: Date,
            },
            RakeHeadsUp: {
              type: Date,
            },
            CapAmount: {
              type: Number,
            },
            MaxPlayers: {
              type: Number,
            },
            Straddle: {
              type: String,
            },
            TurnTime: {
              type: String,
            },
            AntiBanking: {
              type: String,
            },
          },
          rakeRules: {
            type: String,
          },
          rake: {
            rakePercentTwo: {
              type: Number,
            },
            rakePercentThreeFour: {
              type: Number,
            },
            rakePercentMoreThanFive: {
              type: Number,
            },
            capTwo: {
              type: Number,
            },
            capThreeFour: {
              type: Number,
            },
            capMoreThanFive: {
              type: Number,
            },
            minStake: {
              type: Number,
            },
            maxStake: {
              type: Number,
            },
          },
          gameInterval: {
            type: Number,
          },
          isRealMoney: {
            type: Boolean,
          },
          rebuyHourFactor: {
            type: Number,
          },
          isPrivate: {
            type: Boolean,
          },
          password: {
            type: Date,
          },
          blindMissed: {
            type: Number,
          },
          tournamentRules: {},
          roundId: {
            type: String,
          },
          videoLogId: {
            type: String,
          },
          state: {
            type: String,
          },
          stateInternal: {
            type: String,
          },
          roundCount: {
            type: Number,
          },
          deck: {
            type: [
              {
                type: {
                  type: String,
                },
                rank: {
                  type: Number,
                },
                name: {
                  type: String,
                },
                priority: {
                  type: Number,
                },
              },
            ],
          },
          players: {
            type: [
              {
                playerId: {
                  type: String,
                },
                channelId: {
                  type: Schema.Types.ObjectId,
                },
                playerName: {
                  type: String,
                },
                networkIp: {
                  type: String,
                },
                deviceType: {
                  type: String,
                },
                active: {
                  type: Boolean,
                },
                chips: {
                  type: Number,
                },
                instantBonusAmount: {
                  type: Number,
                },
                chipsToBeAdded: {
                  type: Number,
                },
                seatIndex: {
                  type: Number,
                },
                imageAvtar: {
                  type: String,
                },
                cards: {
                  type: [
                    {
                      type: {
                        type: String,
                      },
                      rank: {
                        type: Number,
                      },
                      name: {
                        type: Date,
                      },
                      priority: {
                        type: Number,
                      },
                    },
                  ],
                },
                moves: {
                  type: Array,
                },
                preCheck: {
                  type: Number,
                },
                bestHands: {
                  type: String,
                },
                state: {
                  type: String,
                },
                lastBet: {
                  type: Number,
                },
                lastMove: {
                  type: String,
                },
                totalRoundBet: {
                  type: Number,
                },
                totalGameBet: {
                  type: Number,
                },
                isMuckHand: {
                  type: Boolean,
                },
                lastRoundPlayed: {
                  type: String,
                },
                preActiveIndex: {
                  type: Number,
                },
                nextActiveIndex: {
                  type: Number,
                },
                isDisconnected: {
                  type: Boolean,
                },
                bigBlindMissed: {
                  type: Number,
                },
                isAutoReBuy: {
                  type: Boolean,
                },
                isRunItTwice: {
                  type: Boolean,
                },
                autoReBuyAmount: {
                  type: Number,
                },
                isPlayed: {
                  type: Boolean,
                },
                sitoutNextHand: {
                  type: Boolean,
                },
                sitoutNextBigBlind: {
                  type: Boolean,
                },
                autoSitout: {
                  type: Boolean,
                },
                sitoutGameMissed: {
                  type: Number,
                },
                disconnectedMissed: {
                  type: Number,
                },
                hasPlayedOnceOnTable: {
                  type: Boolean,
                },
                isForceBlindEnable: {
                  type: Boolean,
                },
                isWaitingPlayer: {
                  type: Boolean,
                },
                isStraddleOpted: {
                  type: Boolean,
                },
                isJoinedOnce: {
                  type: Boolean,
                },
                isAutoReBuyEnabled: {
                  type: Boolean,
                },
                isAutoAddOnEnabled: {
                  type: Boolean,
                },
                onGameStartBuyIn: {
                  type: Number,
                },
                onSitBuyIn: {
                  type: Number,
                },
                roundId: {
                  type: String,
                },
                totalGames: {
                  type: Number,
                },
                timeBankSec: {
                  type: Number,
                },
                autoFoldCount: {
                  type: Number,
                },
                activityRecord: {
                  seatReservedAt: {
                    type: Date,
                  },
                  lastMovePlayerAt: {
                    type: Date,
                  },
                  disconnectedAt: {
                    type: Date,
                  },
                  lastActivityAction: {
                    type: String,
                  },
                  lastActivityTime: {
                    type: Number,
                  },
                },
                tournamentData: {
                  userName: {
                    type: String,
                  },
                  isTournamentSitout: {
                    type: Boolean,
                  },
                  isTimeBankUsed: {
                    type: Boolean,
                  },
                  timeBankStartedAt: {
                    type: Date,
                  },
                  totalTimeBank: {
                    type: String,
                  },
                  timeBankLeft: {
                    type: String,
                  },
                  rebuyChips: {
                    type: Number,
                  },
                },
                precheckValue: {
                  type: String,
                },
                isTimeBankUsed: {
                  type: Boolean,
                },
                timeBankStartedAt: {
                  type: Date,
                },
              },
            ],
          },
          onStartPlayers: {
            type: [String],
          },
          queueList: {
            type: Array,
          },
          handHistory: {
            type: Array,
          },
          roundName: {
            type: String,
          },
          roundBets: {
            type: [Number],
          },
          roundMaxBet: {
            type: Number,
          },
          lastBetOnTable: {
            type: Number,
          },
          minRaiseAmount: {
            type: Number,
          },
          maxRaiseAmount: {
            type: Number,
          },
          raiseDifference: {
            type: Number,
          },
          considerRaiseToMax: {
            type: Number,
          },
          lastRaiseAmount: {
            type: Number,
          },
          isBettingRoundLocked: {
            type: Boolean,
          },
          isRunItTwiceApplied: {
            type: Boolean,
          },
          isForceRit: {
            type: Boolean,
          },
          maxBetAllowed: {
            type: Number,
          },
          pot: {
            type: Array,
          },
          contributors: {
            type: [
              {
                playerId: {
                  type: String,
                },
                amount: {
                  type: Number,
                },
                tempAmount: {
                  type: Number,
                },
              },
            ],
          },
          roundContributors: {
            type: [
              {
                playerId: {
                  type: String,
                },
                amount: {
                  type: Number,
                },
                tempAmount: {
                  type: Number,
                },
              },
            ],
          },
          boardCard: {
            type: [Array],
          },
          preChecks: {
            type: [
              {
                playerId: {
                  type: String,
                },
                set: {
                  type: Number,
                },
                precheckValue: {
                  type: String,
                },
              },
            ],
          },
          bestHands: {
            type: [
              {
                playerId: {
                  type: String,
                },
                bestHand: {
                  type: String,
                },
              },
            ],
          },
          dealerSeatIndex: {
            type: Number,
          },
          nextDealerSeatIndex: {
            type: Number,
          },
          smallBlindSeatIndex: {
            type: Number,
          },
          nextSmallBlindSeatIndex: {
            type: Number,
          },
          bigBlindSeatIndex: {
            type: Number,
          },
          dealerIndex: {
            type: Number,
          },
          smallBlindIndex: {
            type: Number,
          },
          bigBlindIndex: {
            type: Number,
          },
          straddleIndex: {
            type: Number,
          },
          currentMoveIndex: {
            type: Number,
          },
          firstActiveIndex: {
            type: Number,
          },
          turnTimeStartAt: {
            type: Number,
          },
          timeBankStartedAt: {
            type: Number,
          },
          isAllInOcccured: {
            type: Boolean,
          },
          isOperationOn: {
            type: Boolean,
          },
          actionName: {
            type: String,
          },
          operationStartTime: {
            type: String,
          },
          operationEndTime: {
            type: String,
          },
          createdAt: {
            type: Number,
          },
          gameStartTime: {
            type: Number,
          },
          lastBlindUpdate: {
            type: Number,
          },
          blindLevel: {
            type: Number,
          },
          vacantSeats: {
            type: Number,
          },
          occupiedSeats: {
            type: Number,
          },
          _v: {
            type: Number,
          },
          gamePlayers: {
            type: Array,
          },
          removedPlayers: {
            type: Array,
          },
          summaryOfAllPlayers: {
            1: {
              type: String,
            },
            2: {
              type: String,
            },
            7: {
              type: String,
            },
          },
          raiseBy: {
            type: String,
          },
          roundNumber: {
            type: String,
          },
          totalPotForRound: {
            type: Number,
          },
        },
      },
      tempData: {
        startConsiderPlayer: {
          type: Boolean,
        },
        allowedIndexes: {
          type: Boolean,
        },
        skipIndexes: {
          type: Boolean,
        },
        preGameState: {
          type: String,
        },
      },
      vgsResponse: {
        removed: {
          type: Array,
        },
        players: {
          type: [
            {
              playerId: {
                type: String,
              },
              channelId: {
                type: Schema.Types.ObjectId,
              },
              playerName: {
                type: String,
              },
              networkIp: {
                type: String,
              },
              deviceType: {
                type: String,
              },
              active: {
                type: Boolean,
              },
              chips: {
                type: Number,
              },
              instantBonusAmount: {
                type: Number,
              },
              chipsToBeAdded: {
                type: Number,
              },
              seatIndex: {
                type: Number,
              },
              imageAvtar: {
                type: String,
              },
              cards: {
                type: [
                  {
                    type: {
                      type: String,
                    },
                    rank: {
                      type: Number,
                    },
                    name: {
                      type: Date,
                    },
                    priority: {
                      type: Number,
                    },
                  },
                ],
              },
              moves: {
                type: Array,
              },
              preCheck: {
                type: Number,
              },
              bestHands: {
                type: String,
              },
              state: {
                type: String,
              },
              lastBet: {
                type: Number,
              },
              lastMove: {
                type: String,
              },
              totalRoundBet: {
                type: Number,
              },
              totalGameBet: {
                type: Number,
              },
              isMuckHand: {
                type: Boolean,
              },
              lastRoundPlayed: {
                type: String,
              },
              preActiveIndex: {
                type: Number,
              },
              nextActiveIndex: {
                type: Number,
              },
              isDisconnected: {
                type: Boolean,
              },
              bigBlindMissed: {
                type: Number,
              },
              isAutoReBuy: {
                type: Boolean,
              },
              isRunItTwice: {
                type: Boolean,
              },
              autoReBuyAmount: {
                type: Number,
              },
              isPlayed: {
                type: Boolean,
              },
              sitoutNextHand: {
                type: Boolean,
              },
              sitoutNextBigBlind: {
                type: Boolean,
              },
              autoSitout: {
                type: Boolean,
              },
              sitoutGameMissed: {
                type: Number,
              },
              disconnectedMissed: {
                type: Number,
              },
              hasPlayedOnceOnTable: {
                type: Boolean,
              },
              isForceBlindEnable: {
                type: Boolean,
              },
              isWaitingPlayer: {
                type: Boolean,
              },
              isStraddleOpted: {
                type: Boolean,
              },
              isJoinedOnce: {
                type: Boolean,
              },
              isAutoReBuyEnabled: {
                type: Boolean,
              },
              isAutoAddOnEnabled: {
                type: Boolean,
              },
              onGameStartBuyIn: {
                type: Number,
              },
              onSitBuyIn: {
                type: Number,
              },
              roundId: {
                type: String,
              },
              totalGames: {
                type: Number,
              },
              timeBankSec: {
                type: Number,
              },
              autoFoldCount: {
                type: Number,
              },
              activityRecord: {
                seatReservedAt: {
                  type: Date,
                },
                lastMovePlayerAt: {
                  type: Date,
                },
                disconnectedAt: {
                  type: Date,
                },
                lastActivityAction: {
                  type: String,
                },
                lastActivityTime: {
                  type: Number,
                },
              },
              tournamentData: {
                userName: {
                  type: String,
                },
                isTournamentSitout: {
                  type: Boolean,
                },
                isTimeBankUsed: {
                  type: Boolean,
                },
                timeBankStartedAt: {
                  type: Date,
                },
                totalTimeBank: {
                  type: String,
                },
                timeBankLeft: {
                  type: String,
                },
                rebuyChips: {
                  type: Number,
                },
              },
              precheckValue: {
                type: String,
              },
              isTimeBankUsed: {
                type: Boolean,
              },
              timeBankStartedAt: {
                type: Date,
              },
            },
          ],
        },
        startGame: {
          type: Boolean,
        },
        state: {
          type: String,
        },
        preGameState: {
          type: String,
        },
      },
      dataPlayers: {
        type: [
          {
            playerId: {
              type: String,
            },
            playerName: {
              type: String,
            },
            chips: {
              type: Number,
            },
            state: {
              type: String,
            },
            moves: {
              type: Array,
            },
          },
        ],
      },
      seatIndex: {
        type: Number,
      },
      count: {
        type: Number,
      },
    },
    createdAt: {
      type: Number,
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true },
    strict: false,
  },
);
export const getModel = () => getLogModel(LogDBModel.GameActivity);
export default getModel;
// export default model('GameActivity', gameActivitySchema, 'gameActivity');
