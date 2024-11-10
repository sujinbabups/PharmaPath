const { clientApplication } = require('./client');

    let userClient = new clientApplication();
    
    userClient.submitTxn(
            "regulators", 
            "pharmachain",
            "Pharma-Chain", 
            "PharmaSupplyChainContract", 
            "medicineHistory", 
            "",
            "getMedicineHistory", 
            "batch001" , 
        ).then(result => {
            console.log(new TextDecoder().decode(result))
            console.log("Medicine History")
        })
