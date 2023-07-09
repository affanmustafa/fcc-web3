const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("SimpleStorage", () => {
    let simpleStorageFactory;
    let simpleStorage;
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await simpleStorageFactory.deploy();
    });

    it("Should start with a favorite number of 0", async () => {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = 0;
        // assert keyword or expect keyword
        assert.equal(currentValue.toString(), expectedValue);
    });

    it("Should update when we call store", async () => {
        const expectedValue = 7;
        const transactionResponse = await simpleStorage.store(7);
        await transactionResponse.wait(1);

        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue);
    });

    it("Should add a new person and their favorite number", async () => {
        const personName = "John";
        const personNumber = 25;
        const transactionResponse = await simpleStorage.addPerson(
            personName,
            personNumber
        );
        await transactionResponse.wait(1);

        const storedPerson = await simpleStorage.nameToFavoriteNumber(
            personName
        );
        assert.equal(storedPerson.toString(), personNumber);
    });
});
