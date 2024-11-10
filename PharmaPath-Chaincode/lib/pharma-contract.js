/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const  {Contract}  = require('fabric-contract-api');

class PharmaSupplyChainContract extends Contract {

    // 1. Drug Registration by Manufacturer
    async registerDrug(ctx, batchId, drugName, batchNumber, quantity, expirationDate, productionDate, manufacturerId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'ManufacturerMSP') {
            throw new Error(`User under MSP ${mspID} cannot register drugs`);
        }
    
        const drugExists = await this.drugExists(ctx, batchId);
        if (drugExists) {
            throw new Error(`Drug batch ${batchId} already exists`);
        }

        const drugData = {
            batchId,
            drugName,
            batchNumber,
            quantity,
            expirationDate,
            productionDate,
            manufacturerId,
            status: 'Registered',
            owner: manufacturerId,
            assetType: 'drug',
        };
    
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(drugData)));
    
        return `Drug batch ${batchId} registered successfully by ${manufacturerId}`;
    }
    
    async transferToWholesaler(ctx, batchId, wholesalerId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'ManufacturerMSP') {
            throw new Error(`User under MSP ${mspID} cannot transfer ownership of drugs`);
        }
    
        const drugDetails = await this.getDrugDetails(ctx, batchId);
        if (drugDetails.status !== 'Registered') {
            throw new Error(`Drug batch ${batchId} is not in a state for transfer to wholesaler`);
        }
    
        drugDetails.owner = wholesalerId;
        drugDetails.status = 'Transferred to Wholesaler';
    
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(drugDetails)));
    
        return `Drug batch ${batchId} ownership has been transferred to wholesaler ${wholesalerId}`;
    }
    
    async queryTransferredToWholesalerMedicines(ctx) {
        const queryString = {
            selector: {
                assetType: 'drug',
                status: 'Transferred to Wholesaler'
            }
        };
    
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = await this._getAllResults(iterator);
        
        return JSON.stringify(results);
    }
    

    // 2. Distribution by Wholesaler
    async distributeDrug(ctx, batchId, wholesalerId, deliveryTime, transportConditions, quantity) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'WholesalerMSP') {
            throw new Error(`User under MSP ${mspID} cannot distribute drugs`);
        }
        const drug = await this.getDrugDetails(ctx, batchId);
        if (drug.status !== 'Transferred to Wholesaler') {
            throw new Error(`Drug batch ${batchId} is not available for distribution`);
        }
    
        drug.status = 'In Transit';
        drug.deliveryTime = deliveryTime;
        drug.transportConditions = transportConditions;
        drug.owner = wholesalerId;
        drug.quantity = quantity;  
    
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(drug)));
        return `Drug batch ${batchId} is now in transit by wholesaler ${wholesalerId}`;
    }
    
    // Query all medicines with status 'In Transit'
async queryMedicinesInTransit(ctx) {
    const queryString = {
        selector: {
            assetType: 'drug',
            status: 'In Transit'
        }
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    const results = await this._getAllResults(iterator);
    return JSON.stringify(results);
}


    // 3. Verification by Pharmacy
    async verifyAndDispenseDrug(ctx, batchId, pharmacyId, quantity) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'PharmaciesMSP') {
            throw new Error(`User under MSP ${mspID} cannot verify drugs`);
        }
        const drug = await this.getDrugDetails(ctx, batchId);
        if (drug.owner !== 'WholesalerMSP') {
            throw new Error(`Drug batch ${batchId} has not reached the pharmacy yet`);
        }
        drug.status = 'Dispensed';
        drug.owner = pharmacyId;
        drug.quantity = quantity; // Update quantity dispensed
    
        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(drug)));
        return `Drug batch ${batchId} verified and dispensed by ${pharmacyId}`;
    }
    

    // 4. Oversight by Regulators
    async auditSupplyChain(ctx, batchId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'RegulatorsMSP') {
            throw new Error(`User under MSP ${mspID} cannot perform audits`);
        }
        const drug = await this.getDrugDetails(ctx, batchId);
        return drug;
    }

    async verifyTemperatureControl(ctx, batchId, pharmacyId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'RegulatorsMSP') {
            throw new Error(`User under MSP ${mspID} cannot verify drugs`);
        }
         const drug = await this.getDrugDetails(ctx, batchId);

        if (drug.status !== 'In Transit') {
            throw new Error(`Drug batch ${batchId} is not currently in transit and cannot be verified for temperature control`);
        }
        
         drug.status = 'Verified';
        drug.owner = pharmacyId;

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(drug)));
         return `Drug batch ${batchId} verified successfully with recorded temperature by ${pharmacyId}`;
    }

    async getDrugDetails(ctx, batchId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'ManufacturerMSP' && mspID !== 'PharmaciesMSP' && mspID !== 'RegulatorsMSP'  && mspID !=="WholesalerMSP" ) {
            throw new Error(`User under MSP ${mspID} cannot access drug details`);
        }
    
        const drugDetails = await ctx.stub.getState(batchId);
        if (!drugDetails || drugDetails.length === 0) {
            throw new Error(`Drug batch ${batchId} does not exist in the public ledger`);
        }
    
        return JSON.parse(drugDetails.toString());
    }
    

    async drugExists(ctx, batchId) {
        const drugBytes = await ctx.stub.getState(batchId);
        return drugBytes && drugBytes.length > 0;
    }

    async deleteMedicine(ctx, batchId) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'ManufacturerMSP') {
            // Check if the medicine record exists
            const medicineExists = await this.drugExists(ctx, batchId);
            if (!medicineExists) {
                throw new Error(`The medicine ${batchId} does not exist`);
            }
            // Delete the medicine record
            await ctx.stub.deleteState(batchId);
            return `Medicine ${batchId} has been successfully deleted by ${mspID}`;
        } else {
            throw new Error(`User under the following MSP: ${mspID} cannot perform this action`);
        }
    }

    // Query all medicines
async queryAllMedicines(ctx) {
    const queryString = {
        selector: {
            assetType: 'drug'
        }
    };

    let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let result = await this._getAllResults(resultIterator);
    return JSON.stringify(result);
}

// Get medicines by range
async getMedicinesByRange(ctx, startKey, endKey) {
    let resultIterator = await ctx.stub.getStateByRange(startKey, endKey);
    let result = await this._getAllResults(resultIterator);
    return JSON.stringify(result);
}

// Query all orders
async queryAllOrders(ctx) {
    const queryString = {
        selector: {
            assetType: 'order'
        }
    };

    let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    let result = await this._getAllResults(resultIterator);
    return JSON.stringify(result);
}

async _getAllResults(iterator, isHistory) {
    const allResults = [];

    let res = await iterator.next();
    while (!res.done) {
        if (res.value && res.value.value.toString()) {
            const jsonRes = {};
            if (isHistory) {
                jsonRes.TxId = res.value.txId;
                jsonRes.Timestamp = res.value.timestamp;
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
            } else {
                jsonRes.Key = res.value.key;
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
            }
            allResults.push(jsonRes);
        }
        res = await iterator.next();
    }
    await iterator.close();
    return allResults;
}



// Get order history for a medicine
async getMedicineHistory(ctx, medicineId) {
    let resultIterator = await ctx.stub.getHistoryForKey(medicineId);
    let result = await this._getAllResults(resultIterator, true);
    return JSON.stringify(result);
}

// Get medicines with pagination
async getMedicinesWithPagination(ctx, pageSize, bookMark) {
    const queryString = {
        selector: {
            assetType: 'drug'
        }
    };
    const pageSizeInt = parseInt(pageSize, 10);
    const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(JSON.stringify(queryString), pageSizeInt, bookMark);
    let result = await this._getAllResults(iterator, false);
    let results = {
        Result: result,
        ResponseMetaData: {
            RecordCount: metadata.fetchedRecordsCount,
            Bookmark: metadata.bookmark
        }
    };
    return JSON.stringify(results);
}

// Check matching orders for a medicine
async checkMatchingOrders(ctx, medicineId) {
    const exists = await this.medicineExists(ctx, medicineId);
    if (!exists) {
        throw new Error(`The medicine ${medicineId} does not exist`);
    }

    const medicineBuffer = await ctx.stub.getState(medicineId);
    const medicineDetails = JSON.parse(medicineBuffer.toString());

    const queryString = {
        selector: {
            assetType: 'order',
            drugName: medicineDetails.name,
            dosage: medicineDetails.dosage
        },
    };

    const orderContract = new OrderContract();
    const orders = await orderContract._queryAllOrdersWithQueryString(ctx, queryString);

    return orders;
}

    
}

module.exports = PharmaSupplyChainContract;
