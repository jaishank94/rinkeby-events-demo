const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Event Contract", function () {
  let Event, event, owner, addr1, addr2;

  beforeEach(async () => {
    Event = await ethers.getContractFactory("EventSys");
    event = await Event.deploy();
    [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should set right owner", async function () {
      expect(await event.owner()).to.equal(owner.address);
    });
  });

  describe("Create New Event", () => {
    it("Should create new event", async function () {
      await expect(
        await event.create_event(
          "Test1",
          "Test description",
          "test_url",
          10,
          100,
          "test_uri"
        )
      )
        .to.emit(event, "EventCreated")
        .withArgs(1);
    });

    it("Should Fail due to zero ticket validation", async function () {
      await expect(
        event.create_event(
          "Test1",
          "Test description",
          "test_url",
          0,
          100,
          "test_uri"
        )
      ).to.be.revertedWith("Number of tickets cannot be zero.");
    });
  });

  describe("Get Event Details", () => {
    it("Should fail due to event does not exists", async function () {
      await expect(event.get_event_info(2)).to.be.revertedWith(
        "Event with given ID not found."
      );
    });
  });

  describe("Get Event Tickets", () => {
    it("Should fail due to event does not exists", async function () {
      await expect(event.get_tickets(2)).to.be.revertedWith(
        "Event with given ID not found."
      );
    });
  });
});
