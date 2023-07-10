//import
// require is used in JS
//const { ethers, run, network } = require("hardhat");

//Typescript Imports
import { ethers, run, network} from "hardhat";

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );
    console.log("Deploying contract...");
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();

    console.log(`Deployed contract to: ${simpleStorage.address}`);

    // We cannot verify a contract that we have deployed on Hardhat since it is a local network
    console.log(network.config);
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    //get current value from the smart contract
    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is ${currentValue}`);

    //update the current value
    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);
    const updateValue = await simpleStorage.retrieve();
    console.log(`Updated value is ${updateValue}`);
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress: string, args: any[]) => {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified");
        } else {
            console.log(e);
        }
    }
};

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
