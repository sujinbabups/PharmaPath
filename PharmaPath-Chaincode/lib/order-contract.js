'use strict';

const { Contract } = require('fabric-contract-api');

async function getCollectionName(ctx) {
    const collectionName = 'OrderCollection';

    return collectionName;
}

class OrderContract extends Contract {

    async orderExists(ctx, orderId) {
        const collectionName = await getCollectionName(ctx);
        const data = await ctx.stub.getPrivateDataHash(collectionName, orderId);
        return (!!data && data.length > 0);
    }

    async createOrder(ctx, orderId) {
        console.log(`Creating order with ID: ${orderId}`);
        const mspid = ctx.clientIdentity.getMSPID();
        console.log(`Client MSP ID: ${mspid}`);
    
        if (mspid === 'PharmaciesMSP') {
            console.log("MSP ID is valid");
    
            const exists = await this.orderExists(ctx, orderId);
            if (exists) {
                console.log(`Order ${orderId} already exists`);
                throw new Error(`The order ${orderId} already exists`);
            }
    
            const OrderAsset = {};
            const transientData = ctx.stub.getTransient();
            console.log("Received transient data:", transientData);
    
            // Add log to show missing keys if any
            if (transientData.size === 0 || !transientData.has('drugName') || !transientData.has('dosage') || !transientData.has('quantity') || !transientData.has('pharmacyName')) {
                console.error('Missing expected keys in transient data');
                throw new Error('The expected keys (drugName, dosage, quantity, pharmacyName) were not specified in transient data. Please try again.');
            }
    
            OrderAsset.drugName = transientData.get('drugName').toString();
            OrderAsset.dosage = transientData.get('dosage').toString();
            OrderAsset.quantity = parseInt(transientData.get('quantity').toString(), 10);
            OrderAsset.pharmacyName = transientData.get('pharmacyName').toString();
            OrderAsset.assetType = 'drug';
            OrderAsset.status = 'Created';
    
            const collectionName = await getCollectionName(ctx);
            await ctx.stub.putPrivateData(collectionName, orderId, Buffer.from(JSON.stringify(OrderAsset)));
            console.log(`Order ${orderId} created successfully`);
    
            return `Order ${orderId} created successfully`;
        } else {
            console.error(`Organization with MSP ID ${mspid} cannot perform this action`);
            throw new Error(`Organisation with MSP ID ${mspid} cannot perform this action.`);
        }
    }
    

    async readOrder(ctx, orderId) {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }

        const collectionName = await getCollectionName(ctx);
        const privateData = await ctx.stub.getPrivateData(collectionName, orderId);
        return JSON.parse(privateData.toString());
    }

    async readAllOrders(ctx) {
        const collectionName = await getCollectionName(ctx);
        const queryString = {
            selector: {
                assetType: 'drug'
            }
        };
    
        console.log(`Querying all orders in collection: ${collectionName} with query: ${JSON.stringify(queryString)}`);
    
        const resultIterator = await ctx.stub.getPrivateDataQueryResult(collectionName, JSON.stringify(queryString));
        if (!resultIterator || typeof resultIterator.next !== 'function') {
            throw new Error("Failed to retrieve the iterator. Ensure that the private data collection exists and is accessible.");
        }
    
        const allOrders = await this._getAllResults(resultIterator);
        return JSON.stringify(allOrders);
    }
    

    async updateOrder(ctx, orderId, status) {
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid === 'PharmaciesMSP') {
            const exists = await this.orderExists(ctx, orderId);
            if (!exists) {
                throw new Error(`The order ${orderId} does not exist`);
            }

            const collectionName = await getCollectionName(ctx);
            const privateData = await ctx.stub.getPrivateData(collectionName, orderId);
            const OrderAsset = JSON.parse(privateData.toString());

            OrderAsset.status = status;

            await ctx.stub.putPrivateData(collectionName, orderId, Buffer.from(JSON.stringify(OrderAsset)));
            return `Order ${orderId} updated successfully to status ${status}`;
        } else {
            throw new Error(`Organisation with mspid ${mspid} cannot perform this action.`);
        }
    }

    async deleteOrder(ctx, orderId) {
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid === 'PharmaciesMSP') {
            const exists = await this.orderExists(ctx, orderId);
            if (!exists) {
                throw new Error(`The order ${orderId} does not exist`);
            }
            const collectionName = await getCollectionName(ctx);
            await ctx.stub.deletePrivateData(collectionName, orderId);
            return `Order ${orderId} has been successfully deleted`;
        } else {
            throw new Error(`Organisation with mspid ${mspid} cannot perform this action.`);
        }
    }

    async queryOrdersByStatus(ctx, status) {
        const collectionName = await getCollectionName(ctx);
        const queryString = {
            selector: {
                status: status
            }
        };
        const resultIterator = await ctx.stub.getPrivateDataQueryResult(collectionName, JSON.stringify(queryString));
        const result = await this._getAllResults(resultIterator);
        return JSON.stringify(result);
    }

    async _getAllResults(iterator) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                jsonRes.Key = res.value.key;
                jsonRes.Record = JSON.parse(res.value.value.toString());
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        await iterator.close();
        return allResults;
    }
}

module.exports = OrderContract;
