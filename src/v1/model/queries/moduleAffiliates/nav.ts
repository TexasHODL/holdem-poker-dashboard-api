export const moduleArrayAff = [
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
          status: true
  
        },
        {
          name: 'List Sub-Agents',
          code: 1209,
          route: 'listSubAffiliate',
          iconClass: 'icon-puzzle',
          status: true
  
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
  
export const moduleArraySubAff = [
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
          status: false
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
          status: false
  
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
    // {
    //   name: 'Cashout Report',
    //   code: 2101,
    //   iconClass: 'icon-settings',
    //   status: true,
    //   subModule: [
    //     {
    //       name: 'Daily Cashout Report',
    //       code: 2103,
    //       route: 'dailyCashoutDataReport',
    //       iconClass: 'icon-puzzle',
    //       status: true
  
    //     },
    //     {
    //       name: 'Monthly Cashout',
    //       code: 2104,
    //       route: 'monthlyCashoutDataReport',
    //       iconClass: 'icon-puzzle',
    //       status: true
  
    //     },
    //     {
    //       name: 'Daily Cashout Chart',
    //       code: 2105,
    //       route: 'dailyCashoutChart',
    //       iconClass: 'icon-puzzle',
    //       status: true
  
    //     }
  
    //   ]
  // },
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
  
export const moduleArraySubNewSubAff = [
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
        status: false
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
    code: 2001,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
      {
        name: 'Cashout Direct',
        code: 2003,
        route: 'cashoutDirect',
        iconClass: 'icon-puzzle',
        status: true

      },
      {
        name: 'Direct Cashout History',
        code: 2004,
        route: 'directCashoutHistory',
        iconClass: 'icon-puzzle',
        status: true

      },
      {
        name: 'Cashout Sub-Agent',
        code: 2005,
        route: 'cashoutSubAffiliate',
        iconClass: 'icon-puzzle',
        status: true

      }

    ]
  },
  // {
  //   name: 'Cashout Report',
  //   code: 2101,
  //   iconClass: 'icon-settings',
  //   status: true,
  //   subModule: [
  //     {
  //       name: 'Daily Cashout Report',
  //       code: 2103,
  //       route: 'dailyCashoutDataReport',
  //       iconClass: 'icon-puzzle',
  //       status: true

  //     },
  //     {
  //       name: 'Monthly Cashout',
  //       code: 2104,
  //       route: 'monthlyCashoutDataReport',
  //       iconClass: 'icon-puzzle',
  //       status: true

  //     },
  //     {
  //       name: 'Daily Cashout Chart',
  //       code: 2105,
  //       route: 'dailyCashoutChart',
  //       iconClass: 'icon-puzzle',
  //       status: true

  //     }

  //   ]
  // },
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

export const moduleArraySubNewAff = [
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
        status: false
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
    code: 2001,
    iconClass: 'icon-settings',
    status: true,
    subModule: [
      {
        name: 'Cashout Direct',
        code: 2003,
        route: 'cashoutDirect',
        iconClass: 'icon-puzzle',
        status: true

      },
      {
        name: 'Direct Cashout History',
        code: 2004,
        route: 'directCashoutHistory',
        iconClass: 'icon-puzzle',
        status: true

      },
      {
        name: 'Cashout Sub-Agent',
        code: 2005,
        route: 'cashoutSubAffiliate',
        iconClass: 'icon-puzzle',
        status: true

      }

    ]
  },
  // {
  //   name: 'Cashout Report',
  //   code: 2101,
  //   iconClass: 'icon-settings',
  //   status: true,
  //   subModule: [
  //     {
  //       name: 'Daily Cashout Report',
  //       code: 2103,
  //       route: 'dailyCashoutDataReport',
  //       iconClass: 'icon-puzzle',
  //       status: true

  //     },
  //     {
  //       name: 'Monthly Cashout',
  //       code: 2104,
  //       route: 'monthlyCashoutDataReport',
  //       iconClass: 'icon-puzzle',
  //       status: true

  //     },
  //     {
  //       name: 'Daily Cashout Chart',
  //       code: 2105,
  //       route: 'dailyCashoutChart',
  //       iconClass: 'icon-puzzle',
  //       status: true

  //     }

  //   ]
  // },
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