const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ThoughtLedger", function () {
  let thoughtLedger;
  let owner;
  let user1;
  let user2;
  let addrs;

  const postingFee = ethers.parseEther("0.0001");

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2, ...addrs] = await ethers.getSigners();

    // Deploy contract
    const ThoughtLedger = await ethers.getContractFactory("ThoughtLedger");
    thoughtLedger = await ThoughtLedger.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await thoughtLedger.owner()).to.equal(owner.address);
    });

    it("Should set the correct posting fee", async function () {
      expect(await thoughtLedger.getPostingFee()).to.equal(postingFee);
    });

    it("Should start with zero thoughts", async function () {
      expect(await thoughtLedger.getThoughtCount()).to.equal(0);
    });
  });

  describe("Posting Thoughts", function () {
    it("Should allow posting a thought with correct payment", async function () {
      const name = "Alice";
      const message = "Hello, Web3!";

      await expect(
        thoughtLedger.connect(user1).postThought(name, message, { value: postingFee })
      )
        .to.emit(thoughtLedger, "ThoughtPosted")
        .withArgs(user1.address, name, message, await time(), 0);

      expect(await thoughtLedger.getThoughtCount()).to.equal(1);
    });

    it("Should reject posting with insufficient payment", async function () {
      const name = "Alice";
      const message = "Hello, Web3!";
      const insufficientFee = ethers.parseEther("0.00005");

      await expect(
        thoughtLedger.connect(user1).postThought(name, message, { value: insufficientFee })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should reject posting with empty name", async function () {
      const name = "";
      const message = "Hello, Web3!";

      await expect(
        thoughtLedger.connect(user1).postThought(name, message, { value: postingFee })
      ).to.be.revertedWith("Name cannot be empty");
    });

    it("Should reject posting with empty message", async function () {
      const name = "Alice";
      const message = "";

      await expect(
        thoughtLedger.connect(user1).postThought(name, message, { value: postingFee })
      ).to.be.revertedWith("Message cannot be empty");
    });

    it("Should reject posting with name too long", async function () {
      const name = "A".repeat(51);
      const message = "Hello, Web3!";

      await expect(
        thoughtLedger.connect(user1).postThought(name, message, { value: postingFee })
      ).to.be.revertedWith("Name too long");
    });

    it("Should reject posting with message too long", async function () {
      const name = "Alice";
      const message = "A".repeat(501);

      await expect(
        thoughtLedger.connect(user1).postThought(name, message, { value: postingFee })
      ).to.be.revertedWith("Message too long");
    });

    it("Should allow multiple users to post thoughts", async function () {
      // User 1 posts
      await thoughtLedger.connect(user1).postThought("Alice", "First thought", { value: postingFee });
      
      // User 2 posts
      await thoughtLedger.connect(user2).postThought("Bob", "Second thought", { value: postingFee });

      expect(await thoughtLedger.getThoughtCount()).to.equal(2);
    });
  });

  describe("Retrieving Thoughts", function () {
    beforeEach(async function () {
      // Post some thoughts
      await thoughtLedger.connect(user1).postThought("Alice", "First thought", { value: postingFee });
      await thoughtLedger.connect(user2).postThought("Bob", "Second thought", { value: postingFee });
    });

    it("Should return all thoughts", async function () {
      const thoughts = await thoughtLedger.getAllThoughts();
      
      expect(thoughts.length).to.equal(2);
      expect(thoughts[0].name).to.equal("Alice");
      expect(thoughts[0].message).to.equal("First thought");
      expect(thoughts[0].sender).to.equal(user1.address);
      expect(thoughts[1].name).to.equal("Bob");
      expect(thoughts[1].message).to.equal("Second thought");
      expect(thoughts[1].sender).to.equal(user2.address);
    });

    it("Should return specific thought by ID", async function () {
      const thought = await thoughtLedger.getThought(0);
      
      expect(thought.name).to.equal("Alice");
      expect(thought.message).to.equal("First thought");
      expect(thought.sender).to.equal(user1.address);
      expect(thought.thoughtId).to.equal(0);
    });

    it("Should revert when getting non-existent thought", async function () {
      await expect(thoughtLedger.getThought(999)).to.be.revertedWith("Thought does not exist");
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to update posting fee", async function () {
      const newFee = ethers.parseEther("0.0002");
      
      await thoughtLedger.updatePostingFee(newFee);
      expect(await thoughtLedger.getPostingFee()).to.equal(newFee);
    });

    it("Should reject non-owner from updating posting fee", async function () {
      const newFee = ethers.parseEther("0.0002");
      
      await expect(
        thoughtLedger.connect(user1).updatePostingFee(newFee)
      ).to.be.revertedWithCustomError(thoughtLedger, "OwnableUnauthorizedAccount");
    });

    it("Should reject setting fee to zero", async function () {
      await expect(
        thoughtLedger.updatePostingFee(0)
      ).to.be.revertedWith("Fee must be greater than 0");
    });

    it("Should allow owner to withdraw funds", async function () {
      // Post a thought to generate funds
      await thoughtLedger.connect(user1).postThought("Alice", "Test thought", { value: postingFee });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await expect(thoughtLedger.withdrawFunds())
        .to.emit(thoughtLedger, "FundsWithdrawn")
        .withArgs(owner.address, postingFee);
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject non-owner from withdrawing funds", async function () {
      await expect(
        thoughtLedger.connect(user1).withdrawFunds()
      ).to.be.revertedWithCustomError(thoughtLedger, "OwnableUnauthorizedAccount");
    });

    it("Should reject withdrawal when no funds available", async function () {
      await expect(thoughtLedger.withdrawFunds()).to.be.revertedWith("No funds to withdraw");
    });
  });

  describe("Contract Balance", function () {
    it("Should return correct contract balance", async function () {
      expect(await thoughtLedger.getContractBalance()).to.equal(0);
      
      await thoughtLedger.connect(user1).postThought("Alice", "Test thought", { value: postingFee });
      
      expect(await thoughtLedger.getContractBalance()).to.equal(postingFee);
    });
  });

  describe("Events", function () {
    it("Should emit ThoughtPosted event with correct parameters", async function () {
      const name = "Alice";
      const message = "Test thought";
      const timestamp = await time();

      await expect(
        thoughtLedger.connect(user1).postThought(name, message, { value: postingFee })
      )
        .to.emit(thoughtLedger, "ThoughtPosted")
        .withArgs(user1.address, name, message, timestamp, 0);
    });

    it("Should emit FundsWithdrawn event", async function () {
      await thoughtLedger.connect(user1).postThought("Alice", "Test thought", { value: postingFee });
      
      await expect(thoughtLedger.withdrawFunds())
        .to.emit(thoughtLedger, "FundsWithdrawn")
        .withArgs(owner.address, postingFee);
    });
  });
});

// Helper function to get current timestamp
async function time() {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  return block.timestamp;
} 