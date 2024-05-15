import { toObject } from './../../v1/helpers/utils';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CashoutHistoryService } from '../direct-cashout/services/cashout-history/cashout-history.service';
import { DirectCashoutHistoryService } from '../direct-cashout/services/direct-cashout-history/direct-cashout-history.service';
import { AffiliateService } from '../user/services/affiliate/affiliate.service';
import _ from 'underscore';

@Injectable()
export class CashoutReportService {
    constructor(
        protected readonly cashoutHistoryService: CashoutHistoryService,
        private readonly affiliateService: AffiliateService,
        private readonly directCashoutHistoryService: DirectCashoutHistoryService,
    ) {

    }

    async findAllDataCashoutHistory(params) {
        console.log("findAllDataCashoutHistory", params);
        let currentDate = Number(new Date());
        let lastDayDate = (currentDate - 86400000);
        params.currentDate = currentDate;
        params.lastDayDate = lastDayDate;
        let filter: any = {};
        if (params.role.level === 0) {
            console.log("aff login case---");
            params.isAffiliateLogin = true;
            const result = await this.findAllSubAffiliates(params);
            if (result) {
                filter['$or'] = [
                    {
                        affilateId: params.userName
                    },
                    {
                        affilateId: { '$in': result.subAffArray }
                    }
                ];
                if (params.referenceNo) {
                    filter.referenceNo = params.referenceNo;
                }
                if (params.userId) {
                    filter.userName = params.userId;
                }
                if (params.affiliateId) {
                    filter.affiliateId = params.affiliateId
                }
                if(params.minAmount && !params.maxAmount){
                    filter.requestedAmount = { "$gte":params.minAmount};
                }
                if(!params.minAmount && params.maxAmount){
                    filter.requestedAmount = { "$lte": params.maxAmount};
                }
                if(params.minAmount && params.maxAmount){
                    filter.requestedAmount = { "$gte":params.minAmount, "$lte":params.maxAmount};
                }
                // filter.createdAt = { '$gte': params.lastDayDate, '$lte': params.currentDate };
                filter.createdAt = { '$gte': params.startDate, '$lte': params.endDate };
                console.log('The filter is ', filter);
            } else {
                throw new HttpException('Unable to get subaffiliates from Affiliates', 404);
            }
        } else if (params.role.level === -1) {
            console.log("subaff login case---");
            filter.affilateId = params.userName;
            if (params.referenceNo) {
                filter.referenceNo = params.referenceNo;
            }
            console.log("line 429");
            if (params.userId) {
                filter.userName = params.userId;
            }
            if (params.affiliateId) {
                filter.affiliateId = params.affiliateId
            }
            if(params.minAmount && !params.maxAmount){
                filter.requestedAmount = { "$gte":params.minAmount};
            }
            if(!params.minAmount && params.maxAmount){
                filter.requestedAmount = { "$lte": params.maxAmount};
            }
            if(params.minAmount && params.maxAmount){
                filter.requestedAmount = { "$gte":params.minAmount, "$lte":params.maxAmount};
            }
            // filter.createdAt = { '$gte': params.lastDayDate, '$lte': params.currentDate };
            filter.createdAt = { '$gte': params.startDate, '$lte': params.endDate };
            console.log('The filter is ', filter);
        } else {
            if (params.referenceNo) {
                filter.referenceNo = params.referenceNo;
            }
            if (params.userId) {
                filter.userName = params.userId;
            }
            if (params.affiliateId) {
                filter.affiliateId = params.affiliateId
            }
            if(params.minAmount && !params.maxAmount){
                filter.requestedAmount = { "$gte":params.minAmount};
            }
            if(!params.minAmount && params.maxAmount){
                filter.requestedAmount = { "$lte": params.maxAmount};
            }
            if(params.minAmount && params.maxAmount){
                filter.requestedAmount = { "$gte":params.minAmount, "$lte":params.maxAmount};
            }
            // filter.createdAt = { '$gte': params.lastDayDate, '$lte': params.currentDate };
            filter.createdAt = { '$gte': params.startDate, '$lte': params.endDate };
        }
        await this.findFromCashoutHistory(filter, params);

    }

    async findAllSubAffiliates(params) {
        console.log('Inside findAllSubAffiliates ************', JSON.stringify(params));
        if (params.isAffiliateLogin) {
            let query: any = {};
            query.parentUser = params.userName;
            const result: any = (await this.affiliateService.findAll(query)).map(x => x.toObject());
            if (result) {
                let subAffArray = [];
                if (params.affiliateId) {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].userName == params.affiliateId) {
                            subAffArray[i] = result[i].userName;
                        }
                    }
                }
                else {
                    for (let i = 0; i < result.length; i++) {
                        subAffArray[i] = result[i].userName;
                    }
                }

                params.subAffArray = subAffArray;
                return params;
            } else {
                throw new HttpException('Error in finding subaffiliates', 404);
            }
        } else {
            return params;
        }
    }

    async findFromCashoutHistory(query, params) {
        console.log("findFromCashoutHistory: ", query, params);
        const result = await this.cashoutHistoryService.findFromCashoutHistory(query);
        console.log(result)

        if (result) {
            params.cashoutHistoryResult = result.map(x => x.toObject());
        } else {
            throw new HttpException('Error in finding cashout history', 404);
        }
        return params;
    }

    async findAllDataFromDirectCashoutHistory(params) {
        console.log("paramsfindAllDataFromDirectCashoutHistory ", params);
        let filter: any = {};
        console.log('line 391--');
        if (params.role.level <= 0) {
            console.log("subaff login case---");
            filter['$or'] = [
                {
                    affilateId: params.userName
                },
                {
                    affiliateId: params.userName
                }
            ];
            // if (params.referenceNumber) {
            //     filter.referenceNumber = params.referenceNumber;
            // }
            // filter.actionTakenAt = { '$gte': params.lastDayDate, '$lte': params.currentDate };
            if (params.referenceNo) {
                filter.referenceNo = params.referenceNo;
            }
            if (params.userId) {
                filter.userName = params.userId;
            }
            if (params.affiliateId) {
                filter.affiliateId = params.affiliateId
            }
            if(params.minAmount && !params.maxAmount){
                filter.requestedAmount = { "$gte":params.minAmount};
            }
            if(!params.minAmount && params.maxAmount){
                filter.requestedAmount = { "$lte": params.maxAmount};
            }
            if(params.minAmount && params.maxAmount){
                filter.requestedAmount = { "$gte":params.minAmount, "$lte":params.maxAmount};
            }
            filter.actionTakenAt = { '$gte': params.startDate, '$lte': params.endDate };
            console.log('The filter in findAllDataFromDirectCashoutHistory is 511', filter);
        } else {
            console.log("admin login case---");
            // if (params.referenceNumber) {
            //     filter.referenceNumber = params.referenceNumber;
            // }
            if (params.referenceNo) {
                filter.referenceNo = params.referenceNo;
            }
            if (params.userId) {
                filter.userName = params.userId;
            }
            if (params.affiliateId) {
                filter.affiliateId = params.affiliateId
            }
            if(params.minAmount && !params.maxAmount){
                filter.requestedAmount = { "$gte":params.minAmount};
            }
            if(!params.minAmount && params.maxAmount){
                filter.requestedAmount = { "$lte": params.maxAmount};
            }
            if(params.minAmount && params.maxAmount){
                filter.requestedAmount = { "$gte":params.minAmount, "$lte":params.maxAmount};
            }
            // filter.actionTakenAt = { '$gte': params.lastDayDate, '$lte': params.currentDate };
            filter.actionTakenAt = { '$gte': params.startDate, '$lte': params.endDate };
        }
        await this.findFromDirectCashoutHistory(params, filter);
    }

    async findFromDirectCashoutHistory(params, query) {
        const result = await this.directCashoutHistoryService.findFromDirectCashoutHistory(query);
        if (result) {
            console.log('the result found in findAllDataFromDirectCashoutHistory is!!!!!!!!!', result);
            params.directCashoutHistory = result;
            params.totalCashouts = _.union(params.directCashoutHistory, params.cashoutHistoryResult);
            return params;
        } else {
            throw new HttpException('Error in finding direct cashout history', 404);
        }
    }

    async findDailyCashoutReport(params) {
        console.log('inside findDailyCashoutReport', params);
        
        try {
            await this.findAllDataCashoutHistory(params);
            await this.findAllDataFromDirectCashoutHistory(params);
            let result = params;
            delete result.cashoutHistoryResult;
            delete result.directCashoutHistory;
            if (result.sortValue === 'amount') {
                for (let i = 0; i < result.totalCashouts.length; i++) {
                    if (result.totalCashouts[i].requestedAmount) {
                        result.totalCashouts[i].sortAmount = result.totalCashouts[i].requestedAmount;
                    }
                    else {
                        result.totalCashouts[i].sortAmount = result.totalCashouts[i].amount;
                    }
                }
                result.totalCashouts.sort(function (a, b) {
                    return parseFloat(b.sortAmount) - parseFloat(a.sortAmount);
                });
            }
            else {
                for (let i = 0; i < result.totalCashouts.length; i++) {
                    if (result.totalCashouts[i].actionTakenAt) {
                        result.totalCashouts[i].sortDate = result.totalCashouts[i].actionTakenAt;
                    }
                    else {
                        result.totalCashouts[i].sortDate = result.totalCashouts[i].createdAt;
                    }
                }
                result.totalCashouts.sort(function (a, b) {
                    return parseFloat(b.sortDate) - parseFloat(a.sortDate);
                });
            }
            return result
        } catch (e) {
            console.log(e);
            throw new HttpException(e, 404);
        }
    }


    async findDailyCashoutDateFilter(params) {
        await this.findAllDataCashoutHistoryDateFilter(params);
        await this.findAllDataFromDirectCashoutHistoryDateFilter(params);
        let result = params;
        delete result.cashoutHistoryResult;
        delete result.directCashoutHistory;
        if (result.sortValue === 'amount') {
            for (let i = 0; i < result.totalCashouts.length; i++) {
                if (result.totalCashouts[i].requestedAmount) {
                    result.totalCashouts[i].sortAmount = result.totalCashouts[i].requestedAmount;
                }
                else {
                    result.totalCashouts[i].sortAmount = result.totalCashouts[i].amount;
                }
            }
            result.totalCashouts.sort(function (a, b) {
                return parseFloat(b.sortAmount) - parseFloat(a.sortAmount);
            });
        }
        else {
            for (let i = 0; i < result.totalCashouts.length; i++) {
                if (result.totalCashouts[i].actionTakenAt) {
                    result.totalCashouts[i].sortDate = result.totalCashouts[i].actionTakenAt;
                }
                else {
                    result.totalCashouts[i].sortDate = result.totalCashouts[i].createdAt;
                }
            }
            result.totalCashouts.sort(function (a, b) {
                return parseFloat(b.sortDate) - parseFloat(a.sortDate);
            });
        }
        return result;
    }
    async findAllDataCashoutHistoryDateFilter(params) {
        let filter: any = {};
        let cashoutHistoryResult;
        if (params.role.level == 0) {
            params.isAffiliateLogin = true;
            const result = await this.findAllSubAffiliates(params);
            if (result) {
                if (params.affiliateId) {
                    filter['$or'] = [
                        {
                            affilateId: { '$in': result.subAffArray }
                        },
                        {
                            affilateId: eval('/' + params.affiliateId + '/i')
                        }
                    ];
                }
                else {
                    filter['$or'] = [
                        {
                            affilateId: params.userName
                        },
                        {
                            affilateId: { '$in': result.subAffArray }
                        }
                    ];
                }
                filter.createdAt = params.createdAt;
                if (params.referenceNo) {
                    filter.referenceNo = params.referenceNo;
                }
                if (params.userId) {
                    filter.userName = eval('/' + params.userId + '/i');
                }
                if (params.keyForCashoutChart) {
                    filter.status = "Success";
                }
                cashoutHistoryResult = await this.cashoutHistoryService.findAll(filter);
                if (cashoutHistoryResult) {
                    params.cashoutHistoryResult = cashoutHistoryResult;
                } else {
                    throw new HttpException('Error in finding cashout history', 404);
                }
                return params;
            } else {
                throw new HttpException('Error in finding cashout history', 404);
            }
        }
        if (params.keyForCashoutChart) {
            filter.status = "Success";
        }

        if (params.role.level == -1) {
            filter.affilateId = params.userName;
        }
        if (params.role.level != 0) {
            if (params.referenceNo) {
                filter.referenceNo = params.referenceNo;
            }
            if (params.userId) {
                filter.userName = eval('/' + params.userId + '/i');
            }
            if (params.affiliateId) {
                filter.affiliateId = eval('/' + params.affiliateId + '/i');
            }
            if (params.minAmount && !params.maxAmount) {
                filter.requestedAmount = { "$gte": params.minAmount };
            }
            if (!params.minAmount && params.maxAmount) {
                filter.requestedAmount = { "$lte": params.maxAmount };
            }
            if (params.minAmount && params.maxAmount) {
                filter.requestedAmount = { "$gte": params.minAmount, "$lte": params.maxAmount };
            }
            filter.createdAt = params.createdAt;
            console.log('\n\n\n\n\n\n-------- The filter is ', filter);
            cashoutHistoryResult = await this.cashoutHistoryService.findAll(filter);
            if (cashoutHistoryResult) {
                params.cashoutHistoryResult = cashoutHistoryResult;
                return params
            } else {
                throw new HttpException('Error in finding cashout history', 404);
            }
        }
        throw new HttpException('Error in finding cashout history', 404);
    }

    async findAllDataFromDirectCashoutHistoryDateFilter(params) {
        console.log("Inside findAllDataFromDirectCashoutHistoryDateFilter the params is------- ", params);
        let filter: any = {};
        let directCashoutHistory;
        if (params.role.level <= 0) {
            params.isAffiliateLogin = true;
            if (params.affiliateId) {
                filter['$or'] = [
                    {
                        affilateId: eval('/' + params.affiliateId + '/i')
                    },
                    {
                        affiliateId: eval('/' + params.affiliateId + '/i')
                    }
                ];
            }
            else {
                filter['$or'] = [
                    {
                        affilateId: params.userName
                    },
                    {
                        affiliateId: params.userName
                    }
                ];
            }
            if (params.keyForCashoutChart) {
                filter.status = "Approved";
            }
            if (params.referenceNo) {
                filter.referenceNumber = params.referenceNo;
            }
            if (params.userId) {
                filter.userName = eval('/' + params.userId + '/i');
            }
            filter.actionTakenAt = params.createdAt;
            console.log('The filter in findAllDataFromDirectCashoutHistoryDateFilter is ', filter);
            directCashoutHistory = (await this.directCashoutHistoryService.findAll(filter)).map(x => x.toObject());
            if (directCashoutHistory) {
                params.directCashoutHistory = directCashoutHistory;
                params.totalCashouts = _.union(params.directCashoutHistory, params.cashoutHistoryResult);
                return params;
            } else {
                throw new HttpException('Error in finding findAllDataFromDirectCashoutHistoryDateFilter history', 404);
            }

        }
        if (params.keyForCashoutChart) {
            filter.status = "Approved";
        }
        if (params.role.level != 0) {
            if (params.referenceNo) {
                filter.referenceNumber = params.referenceNo;
            }
            if (params.userId) {
                filter.userName = eval('/' + params.userId + '/i');
            }
            if (params.affiliateId) {
                filter.affilateId = eval('/' + params.affiliateId + '/i');
            }
            if (params.minAmount && !params.maxAmount) {
                filter.amount = { "$gte": params.minAmount };
            }
            if (!params.minAmount && params.maxAmount) {
                filter.amount = { "$lte": params.maxAmount };
            }
            if (params.minAmount && params.maxAmount) {
                filter.amount = { "$gte": params.minAmount, "$lte": params.maxAmount };
            }
            filter.actionTakenAt = params.createdAt;
            console.log('The filter in findAllDataFromDirectCashoutHistoryDateFilter is ', filter);

            directCashoutHistory = (await this.directCashoutHistoryService.findAll(filter)).map(x => x.toObject());
            if (directCashoutHistory) {
                params.directCashoutHistory = directCashoutHistory;
                console.log(params.directCashoutHistory.length, "******", params.cashoutHistoryResult.length);
                params.totalCashouts = _.union(params.directCashoutHistory, params.cashoutHistoryResult);
                console.log("\n\n\n\n\n********* ", params.totalCashouts.length);
                return params;
            } else {
                throw new HttpException('Error in finding findAllDataFromDirectCashoutHistoryDateFilter cashout', 404);
            }
        }
    }

    async monthlyCashoutReport(params) {
        await this.findAllDataCashoutHistoryDateFilter(params);
        await this.findAllDataFromDirectCashoutHistoryDateFilter(params);
        const result = this.filterDataByTransferMode(params);
        return result;
    }

    filterDataByTransferMode(params) {
        console.log("Inside filterDataByTransferMode == ", params.createdAt);
        let monthlyTransferResult = [];
        let ind = 0;
        for (let j = params.createdAt['$gte']; j <= params.createdAt['$lt']; j = (new Date(j).setMonth(new Date(j).getMonth() + 1))) {
            let bankCashoutSumSuccessful = 0, bankCashoutSumRejected = 0;
            for (let i = 0; i < params.cashoutHistoryResult.length; i++) {
                if (params.cashoutHistoryResult[i].createdAt >= j && params.cashoutHistoryResult[i].createdAt < (new Date(j).setMonth(new Date(j).getMonth() + 1))) {
                    if (params.cashoutHistoryResult[i].status == 'Rejected') {
                        bankCashoutSumRejected = bankCashoutSumRejected + parseInt(params.cashoutHistoryResult[i].requestedAmount);
                    }
                    if (params.cashoutHistoryResult[i].status == 'Success') {
                        bankCashoutSumSuccessful = bankCashoutSumSuccessful + parseInt(params.cashoutHistoryResult[i].requestedAmount);
                    }
                }
            }
            monthlyTransferResult[ind++] = { date: Number(new Date(j)), transferMode: 'Bank Transfer', successAmount: bankCashoutSumSuccessful, rejectedAmount: bankCashoutSumRejected };
        }
        for (let j = params.createdAt['$gte']; j <= params.createdAt['$lt']; j = (new Date(j).setMonth(new Date(j).getMonth() + 1))) {
            let directCashoutSumSuccessful = 0, directCashoutSumRejected = 0;
            console.log(Number(new Date(j)));
            for (let i = 0; i < params.directCashoutHistory.length; i++) {
                if (params.directCashoutHistory[i].actionTakenAt >= j && params.directCashoutHistory[i].actionTakenAt < (new Date(j).setMonth(new Date(j).getMonth() + 1))) {
                    if (params.directCashoutHistory[i].status == 'Rejected') {
                        directCashoutSumRejected = directCashoutSumRejected + parseInt(params.directCashoutHistory[i].amount);
                    }
                    if (params.directCashoutHistory[i].status == 'Approved') {
                        directCashoutSumSuccessful = directCashoutSumSuccessful + parseInt(params.directCashoutHistory[i].amount);
                    }
                }
            }

            monthlyTransferResult[ind++] = { date: Number(new Date(j)), transferMode: 'Direct Cashout', successAmount: directCashoutSumSuccessful, rejectedAmount: directCashoutSumRejected };
        }
        let result = _.sortBy(monthlyTransferResult, 'date');
        console.log("Inside monthlyTransferResult == ", monthlyTransferResult);

        return result?.length > 0 && result.reverse() || [];
    }

    async dailyCashoutChart(params) {
        this.findCashoutDataCurrentMonth(params);
        await this.findAllDataCashoutHistoryDateFilter(params);
        await this.findAllDataFromDirectCashoutHistoryDateFilter(params);
        this.filterCurrentMonthDataToDailyData(params);
        this.findCashoutDataPreviousMonth(params);
        await this.findAllDataCashoutHistoryDateFilterPrevMonth(params);
        await this.findAllDataFromDirectCashoutHistoryDateFilterPrevMonth(params);
        this.filterPreviousMonthDataToDailyData(params);
        return params;
    }

    findCashoutDataCurrentMonth(params) {
        let startDate = params.addeddate;
        let endDate = (new Date(params.addeddate).setMonth(new Date(params.addeddate).getMonth() + 1));
        params.startDate = startDate;
        params.endDate = endDate;
        params.createdAt = { '$gte': Number(startDate), '$lt': Number(endDate) };
        return params;
    }
    filterCurrentMonthDataToDailyData(params) {
        const result = this.filterDataToDailyData(params);
        if (result) {
            params.currentMonthCashoutData = result;
        } else {
            throw new HttpException('unable to filter current month data!', 404)
        }
    }

    filterDataToDailyData(params) {
        let dailyCashoutData = [];
        let i = 0;
        for (let tempCheck = params.startDate; tempCheck < params.endDate; tempCheck += (24 * 60 * 60 * 1000)) {
            let dailyCashout = 0;
            for (let tempObj in params.totalCashouts) {
                if (params.totalCashouts[tempObj].createdAt) {
                    if (params.totalCashouts[tempObj].createdAt >= tempCheck && params.totalCashouts[tempObj].createdAt < (tempCheck + (24 * 60 * 60 * 1000))) {
                        if (params.totalCashouts[tempObj].requestedAmount) {
                            console.log('----------------------');
                            dailyCashout = dailyCashout + parseInt(params.totalCashouts[tempObj].requestedAmount);
                        }
                    }
                }
                if (params.totalCashouts[tempObj].actionTakenAt) {
                    if (params.totalCashouts[tempObj].actionTakenAt >= tempCheck && params.totalCashouts[tempObj].actionTakenAt < (tempCheck + (24 * 60 * 60 * 1000))) {
                        if (params.totalCashouts[tempObj].amount) {
                            console.log('++++++++++++++++++++++');
                            dailyCashout = dailyCashout + parseInt(params.totalCashouts[tempObj].amount);
                        }
                    }
                }
            }
            dailyCashoutData[i++] = { date: tempCheck, dailyCashout: Number(dailyCashout) };
        }
        dailyCashoutData.sort(function (a, b) {
            return parseFloat(b.date) - parseFloat(a.date);
        });

        console.log('result ======== ', dailyCashoutData);
        return dailyCashoutData;
    }

    findCashoutDataPreviousMonth(params) {
        let endDate = params.addeddate;
        let startDate = (new Date(params.addeddate).setMonth(new Date(params.addeddate).getMonth() - 1));
        params.startDate = startDate;
        params.endDate = endDate;
        params.createdAt = { '$gte': Number(startDate), '$lt': Number(endDate) };
        return params;
    }

    async findAllDataCashoutHistoryDateFilterPrevMonth(params) {
        let filter: any = {};
        let cashoutHistoryResultPrevMonth;
        if (params.role.level == 0) {
            params.isAffiliateLogin = true;
            const result = await this.findAllSubAffiliates(params);
            if (!!result) {
                filter['$or'] = [
                    {
                        affilateId: params.userName
                    },
                    {
                        affilateId: { '$in': result.subAffArray }
                    }
                ];
                filter.createdAt = params.createdAt;
                if (params.keyForCashoutChart) {
                    filter.status = "Success";
                }
                console.log('The filter is ', filter);
                cashoutHistoryResultPrevMonth = (await this.cashoutHistoryService.findFromCashoutHistory(filter)).map(x => x.toObject());
                if (cashoutHistoryResultPrevMonth) {
                    console.log('the result found in findFromCashoutHistory', cashoutHistoryResultPrevMonth);
                    params.cashoutHistoryResultPrevMonth = cashoutHistoryResultPrevMonth;
                    return params;
                } else {
                    throw new HttpException('Error in finding cashout history', 404);
                }
            } else {
                throw new HttpException('Unable to get subaffiliates from Affiliates', 404);
            }
        }
        if (params.keyForCashoutChart) {
            filter.status = "Success";
        }
        if (params.role.level == -1) {
            filter.affilateId = params.userName;
        }
        if (params.role.level != 0) {
            filter.createdAt = params.createdAt;
            console.log('The filter is ', filter);

            cashoutHistoryResultPrevMonth = (await this.cashoutHistoryService.findFromCashoutHistory(filter)).map(x => x.toObject());
            if (cashoutHistoryResultPrevMonth) {
                console.log('the result found in findAllDataCashoutHistoryDateFilter', cashoutHistoryResultPrevMonth);
                params.cashoutHistoryResultPrevMonth = cashoutHistoryResultPrevMonth;
                return params;
            } else {
                throw new HttpException('Error in finding cashout history', 404);
            }
        }
    }

    async findAllDataFromDirectCashoutHistoryDateFilterPrevMonth(params) {
        let filter: any = {};
        let directCashoutHistoryPrevMonth;
        if (params.role.level == 0) {
            params.isAffiliateLogin = true;
            const result = await this.findAllSubAffiliates(params);
            if (!!result) {
                filter['$or'] = [
                    {
                        affilateId: params.userName
                    },
                    {
                        affilateId: { '$in': result.subAffArray }
                    }
                ]
                if (params.keyForCashoutChart) {
                    filter.status = "Approved";
                }
                filter.actionTakenAt = params.createdAt;

                console.log('The filter in findAllDataFromDirectCashoutHistoryDateFilterPrevMonth is ', filter);
                directCashoutHistoryPrevMonth = await this.directCashoutHistoryService.findAll(filter);
                if (directCashoutHistoryPrevMonth) {
                    params.directCashoutHistoryPrevMonth = directCashoutHistoryPrevMonth;
                    params.totalCashoutsPrevMonth = _.union(params.directCashoutHistoryPrevMonth, params.cashoutHistoryResultPrevMonth);
                    return params;
                } else {
                    throw new HttpException('Error in finding findAllDataFromDirectCashoutHistoryDateFilterPrevMonth history', 404)
                }
            } else {
                throw new HttpException('Unable to get subaffiliates from Affiliates', 404)
            }
        }
        if (params.keyForCashoutChart) {
            filter.status = "Approved";
        }
        if (params.role.level == -1) {
            filter.affilateId = params.userName;
        }
        if (params.role.level != 0) {
            filter.actionTakenAt = params.createdAt;
            console.log('The filter in findAllDataFromDirectCashoutHistoryDateFilter is ', filter);
            directCashoutHistoryPrevMonth = await this.directCashoutHistoryService.findAll(filter);
            if (directCashoutHistoryPrevMonth) {
                console.log('the result found in findAllDataFromDirectCashoutHistoryDateFilter is-------', directCashoutHistoryPrevMonth);
                params.directCashoutHistoryPrevMonth = directCashoutHistoryPrevMonth;
                params.totalCashoutsPrevMonth = _.union(params.directCashoutHistoryPrevMonth, params.cashoutHistoryResultPrevMonth);
                return params;
            } else {
                throw new HttpException('Error in finding findAllDataFromDirectCashoutHistoryDateFilter history', 404)
            }
        }
    }

    filterPreviousMonthDataToDailyData(params) {
        const result = this.filterDataToDailyDataPrevMonth(params);
        if (result) {
            params.previousMonthCashoutData = result;
            return params
        } else {
            throw new HttpException('unable to filter current month data!', 404)
        }
    }

    filterDataToDailyDataPrevMonth(params) {
        let dailyCashoutDataPrevMonth = [];
        let i = 0;
        for (let tempCheck = params.startDate; tempCheck < params.endDate; tempCheck += (24 * 60 * 60 * 1000)) {
            let dailyCashout = 0;
            for (let tempObj in params.totalCashoutsPrevMonth) {
                if (params.totalCashoutsPrevMonth[tempObj].createdAt) {
                    if (params.totalCashoutsPrevMonth[tempObj].createdAt >= tempCheck && params.totalCashoutsPrevMonth[tempObj].createdAt < (tempCheck + (24 * 60 * 60 * 1000))) {
                        if (params.totalCashoutsPrevMonth[tempObj].requestedAmount) {
                            console.log('----------------------');
                            dailyCashout = dailyCashout + parseInt(params.totalCashoutsPrevMonth[tempObj].requestedAmount);
                        }
                    }
                }
                if (params.totalCashoutsPrevMonth[tempObj].actionTakenAt) {
                    if (params.totalCashoutsPrevMonth[tempObj].actionTakenAt >= tempCheck && params.totalCashoutsPrevMonth[tempObj].actionTakenAt < (tempCheck + (24 * 60 * 60 * 1000))) {
                        if (params.totalCashoutsPrevMonth[tempObj].amount) {
                            console.log('++++++++++++++++++++++');
                            dailyCashout = dailyCashout + parseInt(params.totalCashoutsPrevMonth[tempObj].amount);
                        }
                    }
                }
            }
            dailyCashoutDataPrevMonth[i++] = { date: tempCheck, dailyCashout: Number(dailyCashout) };
        }
        dailyCashoutDataPrevMonth.sort(function (a, b) {
            return parseFloat(b.date) - parseFloat(a.date);
        });

        console.log('result ======== ', dailyCashoutDataPrevMonth);
        return dailyCashoutDataPrevMonth
    }
}
