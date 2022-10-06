import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20 } from "../typechain-types";

describe("ERC20Contract", function () {
  let ERC20Contract: ERC20;
  let someAddress: SignerWithAddress;
  let someOtherAddress: SignerWithAddress;

  beforeEach(async function () {
    const ERC20ContractFactory = await ethers.getContractFactory("ERC20");
    const ERC20Contract = await ERC20ContractFactory.deploy("Hello", "SYM");
    await ERC20Contract.deployed();
    someAddress = (await ethers.getSigners())[1];
    someOtherAddress = (await ethers.getSigners())[2];
  });

  describe("When I have 10 tokens", function () {
    beforeEach(async function () {
      await ERC20Contract.transfer(someAddress.address, 10);
    });

    describe("when I transfer 10 tokens", function () {
      it("should transfer tokens correctly", async function () {
        await ERC20Contract.connect(someAddress).transfer(
          someOtherAddress.address,
          10
        );
        expect(
          await ERC20Contract.balanceOf(someOtherAddress.address)
        ).to.equal(10);
      });
    });

    describe("when I transfer 15 tokens", function () {
      it("should revert the transaction", async function () {
        await expect(
          ERC20Contract.connect(someAddress).transfer(
            someOtherAddress.address,
            15
          )
        ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
      });
    });
  });
});
