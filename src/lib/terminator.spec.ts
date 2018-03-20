import { expect } from "chai";
import { SinonStub, stub } from "sinon";
import { is } from ".";
import "../spec";
import { Terminator } from "./terminator";

describe("Terminator", () => {
  describe("when external signal received", () => {
    let terminator: Terminator;
    let firstStub: SinonStub;
    let secondStub: SinonStub;
    let exitStub: SinonStub;
    let onceStub: SinonStub;

    before(() => {
      exitStub = stub(process, "exit");
      onceStub = stub(process, "once");

      firstStub = stub().returns(Promise.resolve());
      secondStub = stub().returns(Promise.resolve());

      // @ts-ignore: private
      terminator = new Terminator(new Set(["SIGTERM"]));
      terminator.addListener("first", firstStub, new Set(["second"]));
      terminator.addListener("second", secondStub);

      // process.emit("SIGTERM")
      onceStub.args[0][1].call();
    });

    after(() => {
      exitStub.restore();
      onceStub.restore();
    });

    it("should call first listener after the second one", () => {
      expect(firstStub.calledAfter(secondStub)).to.eq(true);
    });

    it("should exit with code 0", () => {
      expect(exitStub.calledWith(0)).to.eq(true);
    });

    it("should set isRunning to false", () => {
      expect(terminator.isRunning).to.eq(false);
    });

    it("should set isTerminating to false", () => {
      expect(terminator.isTerminating).to.eq(true);
    });
  });
});
