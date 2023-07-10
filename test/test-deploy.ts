import { ethers } from "hardhat";
import  { assert, expect } from "chai";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

describe("SimpleStorage", () => {
    let simpleStorageFactory: SimpleStorage__factory;
    let simpleStorage : SimpleStorage;
    beforeEach(async function () {
        simpleStorageFactory = (await ethers.getContractFactory("SimpleStorage")) as SimpleStorage__factory;
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it("Should start with a favorite number of 0", async () => {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = ethers.BigNumber.from(0);
        // assert keyword or expect keyword
        assert.equal(currentValue.toString(), expectedValue.toString());
    });

    it("Should update when we call store", async () => {
        const expectedValue = ethers.BigNumber.from(7);
        const transactionResponse = await simpleStorage.store(7);
        await transactionResponse.wait(1);

        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue.toString());
    });

    it("Should add a new person and their favorite number", async () => {
        const personName = "John";
        const personNumber = ethers.BigNumber.from(25);
        const transactionResponse = await simpleStorage.addPerson(
            personName,
            personNumber
        );
        await transactionResponse.wait(1);

        const storedPerson = await simpleStorage.nameToFavoriteNumber(
            personName
        );
        assert.equal(storedPerson.toString(), personNumber.toString());
    });
});
