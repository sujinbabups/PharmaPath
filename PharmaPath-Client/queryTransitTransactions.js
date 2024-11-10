const { clientApplication } = require('./client');

    let userClient = new clientApplication();

    
         userClient.submitTxn(
            "pharmacies",               
            "pharmachain",                
            "Pharma-Chain",               
            "PharmaSupplyChainContract",  
            "queryTransitTransactions",     
            "",                           
            "queryMedicinesInTransit"      
        ).then(result =>{
            console.log(new TextDecoder().decode(result));
            console.log("Query for 'In Transit' medicines executed successfully");
        
        }). catch (error=> {
            console.error("Error querying 'In Transit' medicines:", error);
        })
        
       
    



