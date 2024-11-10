const { clientApplication } = require('./client');

    let userClient = new clientApplication();
    
    userClient.submitTxn(
            "manufacturer", 
            "pharmachain", 
            "Pharma-Chain", 
            "PharmaSupplyChainContract", 
            "transferToWholesaler", 
            "",
            "transferToWholesaler", 
            "BATCH123" ,
            "Wholesaler001" 
        ).then(result => {
            console.log(new TextDecoder().decode(result))
            console.log("Medicine transfered to wholesaler")
        })
