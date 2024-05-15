export const fundrakeStub = () => {
  return {
    _id: '62721e8953d5aa06fbfe4158',
    rakeRefType: 'NORMAL',
    rakeRefVariation: 'Texas Hold’em',
    channelId: '6270c76fc8c4a20785f22b54',
    channelName: 'Test Table 001',
    rakeRefSubType: '',
    transactionid: 'ee498396-b149-4921-857b-10b4b5a08176',
    rakeByUserid: 'a3fd9cdc-cbef-46ba-b5d5-952f4273e371',
    rakeByName: 'Test agent',
    megaCircle: 1,
    megaPoints: 0,
    rakeByUsername: 'testagent01',
    amount: 7,
    amountGST: 7,
    debitToCompany: 3.5000000000000004,
    playerRakeBack: 1.4,
    playerRakeBackPercent: 20,
    addeddate: 1651646089778,
  };
};

export const totalRakeGeneratedStub = () => {
  return [
    {
      _id: '',
      amount: 5.15,
    },
  ];
};

export const rakeDetailsFromPlayerStub = () => {
  return {
    result: [
      {
        _id: '62721e8953d5aa06fbfe4158',
        rakeRefType: 'NORMAL',
        rakeRefVariation: 'Texas Hold’em',
        channelId: '6270c76fc8c4a20785f22b54',
        channelName: 'Test Table 001',
        rakeRefSubType: '',
        transactionid: 'ee498396-b149-4921-857b-10b4b5a08176',
        rakeByUserid: 'a3fd9cdc-cbef-46ba-b5d5-952f4273e371',
        rakeByName: 'Test agent',
        megaCircle: 1,
        megaPoints: 0,
        rakeByUsername: 'testagent01',
        amount: 7,
        amountGST: 7,
        debitToCompany: 3.5000000000000004,
        playerRakeBack: 1.4,
        playerRakeBackPercent: 20,
        addeddate: 1651646089778,
      },
    ],
    totalRake: '2',
  };
};
