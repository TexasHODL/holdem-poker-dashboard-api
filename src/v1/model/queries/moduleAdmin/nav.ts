export const moduleArrayAdmin = [{
    name: 'Accounts',
    code: 1401,
    iconClass: 'icon-home',
    status: true,
    subModule: [
        {
            name: 'Account Details',
            code: 1402,
            route: 'accountDetails',
            iconClass: 'icon-puzzle',
            status: true

        },{
            name: 'Balance Sheet',
            code: 1403,
            route: 'balanceSheet',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
},
{
    name: 'Activity',
    code: 2201,
    iconClass: 'icon-home',
    status: true,
    subModule: [
        {
            name: 'Activity Details',
            code: 2202,
            route: 'activityDetails',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
},
{
    name: 'Rake Back Report',
    code: 4001,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Rakeback Player Report',
            code: 4002,
            route: 'rakeBackPlayerReport',
            iconClass: 'icon-puzzle',
            status: true
        },
        // {
        // 	name: 'Rakeback Transaction History',
        // 	code: 4002,
        // 	route: 'rakeBackTransactionHistory',
        // 	iconClass: 'icon-puzzle',
        // 	status: true
        // },
        {
            name: 'Rake Commission Report',
            code: 4002,
            route: 'rakeReport',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Rake History',
            code: 1505,
            route: 'rakeHistory',
            iconClass: 'icon-puzzle',
            status: true
        },
    ]
},
// {
// 	name: 'Tournament Reports',
// 	code: 2900,
// 	iconClass: 'icon-settings',
// 	status: true,
// 	subModule: [
// 		{
// 			name: 'Tournament Hand History',
// 			code: 2901,
// 			route: "",
// 			iconClass: "icon-puzzle",
// 			status: true
// 		},
// 		{
// 			name: 'Tournament Registration Report',
// 			code: 2901,
// 			route: "tournamentRegistrationReport",
// 			iconClass: "icon-puzzle",
// 			status: true
// 		},
// 		{
// 			name: 'Tournament Prize History',
// 			code: 2901,
// 			route: "tournamentPrizeHistory",
// 			iconClass: "icon-puzzle",
// 			status: true
// 		},
// 		{
// 			name: 'Tournament Game Report',
// 			code: 2901,
// 			route: "tournamentGameReport",
// 			iconClass: "icon-puzzle",
// 			status: true
// 		}
// 	]
// },
{
    name: 'Game Management',
    code: 101,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Table View & Creation',
            code: 102,
            route: 'listTable',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
}, {
    name: 'Spam Management',
    code: 502,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Spam Words Addition',
            code: 501,
            route: 'spamWords',
            iconClass: 'icon-home',
            status: true

        }]
},
{
    name: 'Bonus Code Management',
    code: 401,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Generate Bonus Code',
            code: 402,
            route: 'generateBonusCode',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Bonus Code List',
            code: 403,
            route: 'listBonusDeposit',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Promotional Bonus ',
            code: 404,
            route: 'promotionalBonusCode',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
},
{
    name: 'Bonus Chips Management',
    code: 810,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Bonus Transfer',
            code: 811,
            route: 'instantBonusTransfer',
            iconClass: 'icon-puzzle',
            status: true

        }, {
            name: 'Bonus Transfer History',
            code: 812,
            route: 'instantBonusHistory',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
},
{
    name: 'Scratch Card Management',
    code: 701,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Generate Scratch Card',
            code: 702,
            route: 'generateCardAffiliate',
            iconClass: 'icon-puzzle',
            status: true,
            subModule: [
                {
                    name: 'Agent/Sub-Agent',
                    code: 7021,
                    route: 'generateCardAffiliate',
                    iconClass: 'icon-puzzle',
                    status: true
                }, {
                    name: 'Emergency',
                    code: 7022,
                    route: 'generateCardEmergency',
                    iconClass: 'icon-puzzle',
                    status: true
                },
                {
                    name: 'Promotions',
                    code: 7023,
                    route: 'generateCardPromotions',
                    iconClass: 'icon-puzzle',
                    status: true
                },
                {
                    name: 'High-Rollers',
                    code: 7024,
                    route: 'generateCardHighRollers',
                    iconClass: 'icon-puzzle',
                    status: true
                }
            ]

        },
        {
            name: 'Approve Scratch Card',
            code: 703,
            route: 'approveScratchCard',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Scratch Card History',
            code: 704,
            route: 'scratchCardHistory',
            iconClass: 'icon-puzzle',
            status: true

        }]
},
{
    name: 'Loyalty Points Management',
    code: 801,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Set Loyalty Points by Level',
            code: 802,
            route: 'createLoyaltyPoints',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'List Loyalty Points',
            code: 803,
            route: 'listLoyaltyPoints',
            iconClass: 'icon-puzzle',
            status: true

        }]
},
 {
     name: 'Leader Board Management',
     code: 804,
     iconClass: 'icon-badge',
     status: true,
     subModule: [
         {
             name: 'Create Leaderboard',
             code: 805,
             route: 'createLeaderboard',
             iconClass: 'icon-badge',
             status: true

         },
         {
             name: 'List Leaderboard ',
             code: 806,
             route: 'viewLeaderboard',
             iconClass: 'icon-badge',
             status: true

         },
         {
             name: 'Current Leaderboard Participants',
             code: 807,
             route: 'currentLeaderboardParticipants',
             iconClass: 'icon-badge',
             status: true

         },
         {
             name: "Direct Leaderboard Entry",
             code: 808,
             route: 'directEntry',
             iconClass: 'icon-badge',
             status: true
         },
         {
             name: "Direct Entry History",
             code: 809,
             route: 'directEntryHistory',
             iconClass: 'icon-badge',
             status: true
         }
     ]
 },
 {
     name: 'Leaderboard Set Management',
     code: 8100,
     iconClass: 'icon-badge',
     status: true,
     subModule: [
         {
             name: 'Create Leaderboard Set',
             code: 8110,
             route: 'createLeaderboardCategory',
             iconClass: 'icon-puzzle',
             status: true

         }, {
             name: 'List Leaderboard Set',
             code: 8120,
             route: 'listLeaderboardCategory',
             iconClass: 'icon-puzzle',
             status: true

         }
     ]
 },
 {
     name: 'Leaderboard Reports',
     code: 1707,
     iconClass: 'icon-badge',
     status: true,
     subModule: [

         {
             name: 'Leaderboard Report',
             code: 1708,
             route: 'LeaderboardReport',
             iconClass: 'icon-badge',
             status: true

         },
         {
             name: 'Leaderboard Chart',
             code: 1709,
             route: 'leaderboardChart',
             iconClass: 'bi-bar-chart',
             status: true

         }
     ]
 },
{
    name: 'Chips Management',
    code: 1000,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Transfer To Player',
            code: 1001,
            route: 'transferFund',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Transfer To Agent',
            code: 1002,
            route: 'transferFundToAffiliate',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Transfer History Player',
            code: 1005,
            route: 'transferHistoryPlayer',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Transfer History Agent/Sub-Agent',
            code: 1006,
            route: 'transferHistoryAffiliate',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
},
{
    name: 'Transaction History Report',
    code: 1101,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Deposit Invoice',
            code: 1102,
            route: 'depositInvoice',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'View Transaction History',
            code: 1102,
            route: 'transactionHistoryReport',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
},

{
    name: 'User Management',
    code: 1201,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Create user',
            code: 1202,
            route: 'createUser',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'List Users',
            code: 1203,
            route: 'listUsers',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Create Agent',
            code: 1204,
            route: 'createAffiliate',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Create Sub-Agent',
            code: 1207,
            route: 'createSubAffiliateByAdmin',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'List Agent',
            code: 1205,
            route: 'listOfAffiliate',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'List Sub-Agent',
            code: 1209,
            route: 'listSubAffiliate',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Create Player',
            code: 1210,
            route: 'createPlayer',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'List Players',
            code: 1206,
            route: 'listPlayer',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Create Aff',
            code: 1211,
            route: 'createAff',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'List Aff',
            code: 1212,
            route: 'listAff',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Create Sub-Aff',
            code: 1213,
            route: 'createSubaff',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'List Sub-Aff',
            code: 1214,
            route: 'listSubaff',
            iconClass: 'icon-puzzle',
            status: true
        }

    ]
},
{
    name: 'Cashout Dashboard',
    code: 1301,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Pending Cashout Requests',
            code: 1303,
            route: 'pendingCashOut',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Cashout Payment',
            code: 1304,
            route: 'approveCashout',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Cashout History',
            code: 1305,
            route: 'cashoutHistory',
            iconClass: 'icon-puzzle',
            status: true

        }

    ]
},
{
    name: 'Rake Analytics',
    code: 1501,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
        	name: 'Rake Commission Report',
        	code: 1505,
        	route: 'rakeReportCommission',
        	iconClass: 'icon-puzzle',
        	status: true
        },
        {
            name: 'Daily Rake Commission Chart for the month',
            code: 1508,
            route: 'dailyRakeChart',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Rake Commission Summary by Date',
            code: 1502,
            route: 'rakeByDate',
            iconClass: 'icon-puzzle',
            status: true
            
        },
        {
            name: 'Rake Commission Summary by Agent/Player',
            code: 1503,
            route: 'rakeByAffiliateOrPlayer',
            iconClass: 'icon-puzzle',
            status: true
            
        },
        {
            name: 'Rake Commission Summary by Cash Table',
            code: 1506,
            route: 'rakeByCashTable',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Rake Commission Summary by Game Variants',
            code: 1510,
            route: 'gameVariantsRakeReport',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Rake Commission Chart by Time of day',
            code: 1509,
            route: 'rakeByTimeOfDay',
            iconClass: 'icon-puzzle',
            status: true
            
        },
        {
            name: 'Rake Commission Summary Datewise',
            code: 1504,
            route: 'rakeDatewise',
            iconClass: 'icon-puzzle',
            status: true
            
        },
        {
            name: 'Table Rake Commission Report',
            code: 1512,
            route: 'tableRakeReport',
            iconClass: 'icon-puzzle',
            status: true
            
        },
        {
            name: 'Monthly Rake Report',
            code: 1511,
            route: 'RakeBackMonthlyReport',
            iconClass: 'icon-puzzle',
            status: true
            
        },
        // {
        // 	name: 'Rake History',
        // 	code: 1505,
        // 	route: 'rakeHistory',
        // 	iconClass: 'icon-puzzle',
        // 	status: true
        // },
        // {
        //     name:"Rake Summary by Cash Table",
        //     code:1505,
        //     route:"dashboard1",
        //     iconClass:"icon-puzzle",
        //     status:true
        
        // },
        // {
            //     name:"Rake Summary by Time Of Day",
            //     code:1506,
            //     route:"dashboard1",
            //     iconClass:"icon-puzzle",
        //     status:true

        // }

    ]
},
{
    name: 'Player Report Management',
    code: 1601,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Player Report',
            code: 1603,
            route: 'findPlayerReport',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Player Rake Chart',
            code: 1604,
            route: 'findPlayerChart',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Player Games Played Chart',
            code: 1605,
            route: 'findPlayerChartGamesPlayed',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Player Banned Report',
            code: 1606,
            route: 'findMonthlyPlayerBannedReport',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Player Chips Report',
            code: 1607,
            route: 'playerChipsReport',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Player Loyality Points Report',
            code: 1608,
            route: 'playerLoyalityPointsReport',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Player Bonus Report',
            code: 1609,
            route: 'playerBonusReport',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Player Info Report',
            code: 1610,
            route: 'playerInfoReport',
            iconClass: 'icon-puzzle',
            status: true
        }, {
            name: 'Player Parent History',
            code: 1611,
            route: 'playerParentHistory',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Player Locked Bonus Report',
            code: 1612,
            route: 'playerLockedBonus',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Locked Bonus Claimed History',
            code: 1613,
            route: 'lockedBonusClaimedHistory',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
        	name: 'Player Hand History',
        	code: 1614,
        	route: 'playerHandHistory',
        	iconClass: 'icon-puzzle',
        	status: true
        },
        // {
        // 	name: 'Player Tournament History',
        // 	code: 1614,
        // 	route: 'playerTournamentHistory',
        // 	iconClass: 'icon-puzzle',
        // 	status: true
        // },
        // {
        // 	name: 'Player Tournament Stats',
        // 	code: 1614,
        // 	route: 'playerTournamentStats',
        // 	iconClass: 'icon-puzzle',
        // 	status: true
        // }

    ]
},
{
    name: 'Chips Reports',
    code: 1701,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Daily Add Chips Report',
            code: 1703,
            route: 'dailyChipsReport',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Monthly Add Chips Report',
            code: 1704,
            route: 'monthlyChipsReport',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Daily Add Chips Chart',
            code: 1705,
            route: 'dailyChipsChart',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Monthly Bonus Chips Report',
            code: 1706,
            route: 'monthlyBonusChipsReport',
            iconClass: 'icon-puzzle',
            status: true

        }

    ]
},

{
    name: 'Customer Support Management',
    code: 1801,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Profile Details',
            code: 1803,
            route: 'profileDetailsPlayer',
            iconClass: 'icon-puzzle',
            status: true

        },
        // ,{
        // 	name: 'Account Details',
        // 	code: 1804,
        // 	route: 'gameProfileDataCustomerSupport',
        // 	iconClass: 'icon-puzzle',
        // 	status: true

        // },
        {
            name: 'Transaction History',
            code: 1805,
            route: 'transactionHistoryCustomerSupport',
            iconClass: 'icon-puzzle',
            status: true

        },
        // {
        //     name:"Cash Game History",
        //     code:1806,
        //     route:"gameHistoryCustomerSupport",
        //     iconClass:"icon-puzzle",
        //     status:true

        // },
        {
            name: 'Player Game History',
            code: 1807,
            route: 'playerGameHistoryCustomerSupport',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Player Loyality Points History',
            code: 1808,
            route: 'playerMagnetChipsHistoryCustomerSupport',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Player Info Report',
            code: 1809,
            route: 'playerInfoReportCustomerSupport',
            iconClass: 'icon-puzzle',
            status: true
        }

    ]
},
{
    name: 'Cashout Report',
    code: 2101,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Daily Cashout Report',
            code: 2103,
            route: 'dailyCashoutDataReport',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Monthly Cashout',
            code: 2104,
            route: 'monthlyCashoutDataReport',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Daily Cashout Chart',
            code: 2105,
            route: 'dailyCashoutChart',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
},
{
    name: 'Broadcast Management',
    code: 2301,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Broadcast to game',
            code: 2303,
            route: 'broadcastToGame',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
},
{
    name: 'Pull Chips',
    code: 3001,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Pull Chips Agent/Sub-Agent',
            code: 3002,
            route: 'pullChipsAffiliate',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Pull Chips Player',
            code: 3006,
            route: 'pullChipsPlayerByAdmin',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Pull Instant Chips Player',
            code: 3007,
            route: 'pullInstantChipsPlayerByAdmin',
            iconClass: 'icon-puzzle',
            status: true
        },
        {
            name: 'Instant Chips Pull History',
            code: 3008,
            route: 'instantChipsPullHistory',
            iconClass: 'icon-puzzle',
            status: true
        }

    ]
},
{
    name: 'Passbook',
    code: 5001,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Player Passbook',
            code: 5002,
            route: 'playerPassbook',
            iconClass: 'icon-puzzle',
            status: true
        }
    ]
},
{
    name: 'Chat Management',
    code: 8001,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Player Chat Management',
            code: 8002,
            route: 'playerChatManagement',
            iconClass: 'icon-puzzle',
            status: true

        },
        {
            name: 'Chat History',
            code: 8003,
            route: 'chatHistory',
            iconClass: 'icon-puzzle',
            status: true

        }
    ]
},{
    name: 'Player Build Access Management',
    code: 2900,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
        {
            name: 'Player Build Access',
            code: 2901,
            route: 'playerBuildAcess',
            iconClass: 'icon-puzzle',
            status: true
        }
    ]
    },
    {
    name : "Rakeback management",
    code : 2902,
    iconClass : "icon-settings",
    status : true,
    subModule : [
        {
            name : "Rakeback Config",
            code : 2903,
            route : "rakebackConfig",
            iconClass : "icon-puzzle",
            status : true
        }
    ]
    }

];

export const moduleArrayListAdmin = [
    {
      name: 'Scratch Card Management',
      code: 701,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
        {
          name: 'Generate Scratch Card',
          code: 702,
          route: 'generateCardAffiliate',
          iconClass: 'icon-puzzle',
          status: true,
          subModule: [
            {
              name: 'Agent/Sub-agent',
              code: 7021,
              route: 'generateCardAffiliate',
              iconClass: 'icon-puzzle',
              status: true
            }
          ]
        },
        {
          name: 'Scratch Card History',
          code: 704,
          route: 'scratchCardHistoryAffiliate',
          iconClass: 'icon-puzzle',
          status: true
  
        }]
    },
    {
      name: 'Chips Management',
      code: 1000,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
        {
          name: 'Transfer To Player',
          code: 1001,
          route: 'transferFund',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Transfer To Sub-Agent',
          code: 1007,
          route: 'transferFundToSubAffiliate',
          iconClass: 'icon-puzzle',
          status: true
        },
        {
          name: 'Transfer History Player',
          code: 1005,
          route: 'transferHistoryPlayer',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Transfer History Agent/Sub-Agent',
          code: 1006,
          route: 'transferHistoryAffiliate',
          iconClass: 'icon-puzzle',
          status: true
  
        }]
    },
    {
      name: 'Transaction History Report',
      code: 1101,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
        {
          name: 'View Transaction History',
          code: 1102,
          route: 'transactionHistoryReport',
          iconClass: 'icon-puzzle',
          status: true
  
        }]
    },
  
    {
      name: 'User Management',
      code: 1201,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
  
        {
          name: 'Create Sub-Agent',
          code: 1208,
          route: 'createSubAffiliateByAffiliate',
          iconClass: 'icon-puzzle',
          status: false
  
        },
        {
          name: 'List Sub-Agents',
          code: 1209,
          route: 'listSubAffiliate',
          iconClass: 'icon-puzzle',
          status: false
  
        },
        {
          name: 'Create Player',
          code: 1211,
          route: 'createPlayerByAffiliate',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'List Players',
          code: 1206,
          route: 'listPlayer',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Create Sub-Aff',
          code: 1213,
          route: 'createSubaffByAff',
          iconClass: 'icon-puzzle',
          status: false
        },
        {
          name: 'List Sub-Aff',
          code: 1214,
          route: 'listSubaff',
          iconClass: 'icon-puzzle',
          status: false
        }
      ]
    },
    {
      name: 'Cashout Dashboard',
      code: 1301,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
        {
          name: 'Cashout',
          code: 1302,
          route: 'cashoutRequest',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Pending Cashout Requests',
          code: 1303,
          route: 'pendingCashOutAffiliate',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Cashout History',
          code: 1305,
          route: 'cashoutHistory',
          iconClass: 'icon-puzzle',
          status: true
  
        }
  
      ]
    },
    {
      name: 'Rake Analytics',
      code: 1501,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
        {
          name: 'Rake Commission Report',
          code: 1506,
          route: 'rakeReportAffiliate',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Rake Commission Summary by Date',
          code: 1502,
          route: 'rakeByDateAffMod',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Rake Commission Summary by Agent/Player',
          code: 1503,
          route: 'rakeByAffiliateOrPlayerAffMod',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Rake Commission Summary Datewise',
          code: 1504,
          route: 'rakeDatewiseAffMod',
          iconClass: 'icon-puzzle',
          status: true
  
        }
              
  
      ]
    },
    {
      name: 'Player Report Management',
      code: 1601,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
        {
          name: 'Player Report',
          code: 1603,
          route: 'findPlayerReport',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Player Rake Chart',
          code: 1604,
          route: 'findPlayerChart',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Player Games Played Chart',
          code: 1605,
          route: 'findPlayerChartGamesPlayed',
          iconClass: 'icon-puzzle',
          status: true
  
        }
  
      ]
    },
  
    {
      name: 'Direct Cashout Management',
      code: 2101,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
        {
          name: 'Cashout Direct',
          code: 2103,
          route: 'cashoutDirect',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Direct Cashout History',
          code: 2104,
          route: 'directCashoutHistory',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Cashout Sub-Agent',
          code: 2105,
          route: 'cashoutSubAffiliate',
          iconClass: 'icon-puzzle',
          status: true
  
        }
  
      ]
    },
    {
      name: 'Cashout Report',
      code: 2106,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
        {
          name: 'Daily Cashout Report',
          code: 2107,
          route: 'dailyCashoutDataReport',
          iconClass: 'icon-puzzle',
          status: true
  
        },
        {
          name: 'Monthly Cashout',
          code: 2108,
          route: 'monthlyCashoutDataReport',
          iconClass: 'icon-puzzle',
          status: true
        },
        {
          name: 'Daily Cashout Chart',
          code: 2109,
          route: 'dailyCashoutChart',
          iconClass: 'icon-puzzle',
          status: true
  
        }
  
      ]
    },
    {
      name: 'Pull Chips',
      code: 3001,
      iconClass: 'icon-settings',
      status: true,
      subModule: [
       
        {
          name: 'Pull Chips Player',
          code: 3010,
          route: 'pullChipsPlayerByAff',
          iconClass: 'icon-puzzle',
          status: true
        }
      ]
      },
];