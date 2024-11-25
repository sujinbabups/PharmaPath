const { profile } = require("./profile");

const { promises: fs } = require("fs");

const path = require("path");

const crypto = require("crypto");

const grpc = require("@grpc/grpc-js");

const { connect, signers } = require("@hyperledger/fabric-gateway");

class clientApplication {
    async submitTxn(
        organization,
        channelName,
        chaincodeName,
        contractName,
        txnType,
        transientData,
        txnName,
        ...args
    ) {
        let orgProfile = profile[organization];

        const client = await newGrpcConnection(
            orgProfile["tlsCertPath"],
            orgProfile["peerEndpoint"],
            orgProfile["peerHostAlias"]
        );

        const gateway = connect({
            client,

            identity: await newIdentity(orgProfile["certPath"], orgProfile["mspId"]),

            signer: await newSigner(orgProfile["keyDirectoryPath"]),
        });

        try {
            let network = await gateway.getNetwork(channelName);

            let contract = await network.getContract(chaincodeName, contractName);

            let resultBytes;

            if (txnType == "registerMedicine") {
                resultBytes = await contract.submitTransaction(txnName, ...args);
            } else if (txnType == "getMedicines") {
                resultBytes = await contract.evaluateTransaction(txnName, ...args);
            }else if (txnType == "newOrder") {
                resultBytes = await contract.submit(txnName, {
                    arguments: [...args],
                    transientData: transientData,
                    endorsingOrganizations: ['PharmaciesMSP', 'WholesalerMSP','RegulatorsMSP']
                
                });
                
            }
            
            
            else if(txnType=="distributeDrug"){
                resultBytes=await contract.submitTransaction(txnName, ...args);
            }
            else if(txnType=="verifyAndDispenseDrug"){
                resultBytes= await contract.evaluateTransaction(txnName,...args)
            }
            else if (txnType=="auditChain"){
                resultBytes=await contract.evaluateTransaction(txnName,...args)
            }
            else if (txnType=="deleteMedicine"){
                resultBytes=await contract.submitTransaction(txnName,...args)
            }
            else if(txnType=="getOrders"){
                resultBytes=await contract.evaluateTransaction(txnName,...args)
            }
            else if(txnType=="allMedicines"){
                resultBytes=await contract.evaluateTransaction(txnName,...args)
            }
            else if(txnType=="readOrder"){
                resultBytes=await contract.evaluateTransaction(txnName,...args)
            }
            else if(txnType=="deleteOrder"){
                resultBytes=await contract.submitTransaction(txnName,...args)
            }
            else if(txnType=="transferToWholesaler"){
                resultBytes=await contract.submitTransaction(txnName,...args)
            }
             else if(txnType=="medicineHistory"){
                resultBytes=await contract.evaluateTransaction(txnName,...args)
            }
            else if(txnType=="varifyDrugs"){
                resultBytes=await contract.submitTransaction(txnName,...args)
            }
            else if(txnType=="queryTransferedMedicines"){
                resultBytes=await contract.submitTransaction(txnName,...args)
            }
            else if(txnType=="queryTransitTransactions"){
                resultBytes=await contract.evaluateTransaction(txnName,...args)
            }
            else if(txnType=="readAllOrders"){
                resultBytes=await contract.evaluateTransaction(txnName,...args)
            }

       
            else {
                console.log("Invalid txnType", txnType);
            }

            console.log("*** Result:", resultBytes);

            return Promise.resolve(resultBytes);
        } catch (error) {
            console.log("Error occured", error);

            return Promise.reject(error);
        } finally {
            gateway.close();

            client.close();
        }
    }
}

async function newGrpcConnection(tlsCertPath, peerEndpoint, peerHostAlias) {
    const tlsRootCert = await fs.readFile(tlsCertPath);

    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);

    return new grpc.Client(peerEndpoint, tlsCredentials, {
        "grpc.ssl_target_name_override": peerHostAlias,
    });
}

async function newIdentity(certPath, mspId) {
    const credentials = await fs.readFile(certPath);

    return { mspId, credentials };
}

async function newSigner(keyDirectoryPath) {
    const files = await fs.readdir(keyDirectoryPath);

    const keyPath = path.resolve(keyDirectoryPath, files[0]);

    const privateKeyPem = await fs.readFile(keyPath);

    const privateKey = crypto.createPrivateKey(privateKeyPem);

    return signers.newPrivateKeySigner(privateKey);
}

module.exports = {
    clientApplication,
};