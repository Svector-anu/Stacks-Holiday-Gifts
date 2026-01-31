import { describe, it, expect, beforeEach } from "vitest";
import { Cl, ClarityType } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

// Helper to create a secret hash
const createSecretHash = (secret: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const paddedData = new Uint8Array(32);
  paddedData.set(data.slice(0, 32));
  return paddedData;
};

describe("Gift Escrow Contract", () => {
  describe("create-gift", () => {
    it("should create a gift successfully", () => {
      const secret = "my-secret-key-123";
      const secretBytes = createSecretHash(secret);
      const amount = 1000000n; // 1 STX
      const message = "Happy Holidays! 🎁";

      const result = simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [
          Cl.uint(amount),
          Cl.stringUtf8(message),
          Cl.buffer(secretBytes),
        ],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(0)); // First gift ID is 0
    });

    it("should fail with zero amount", () => {
      const secretBytes = createSecretHash("test");

      const result = simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [
          Cl.uint(0),
          Cl.stringUtf8("Test"),
          Cl.buffer(secretBytes),
        ],
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(106)); // ERR_ZERO_AMOUNT
    });

    it("should increment gift counter", () => {
      const secretBytes = createSecretHash("secret1");

      simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [Cl.uint(1000000n), Cl.stringUtf8("Gift 1"), Cl.buffer(secretBytes)],
        wallet1
      );

      const secretBytes2 = createSecretHash("secret2");
      const result = simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [Cl.uint(2000000n), Cl.stringUtf8("Gift 2"), Cl.buffer(secretBytes2)],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(1)); // Second gift ID is 1
    });
  });

  describe("claim-gift", () => {
    it("should claim a gift with correct secret", () => {
      const secret = "claim-me-123";
      const secretBytes = createSecretHash(secret);
      const amount = 1000000n;

      // Create gift
      simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [Cl.uint(amount), Cl.stringUtf8("Claim this!"), Cl.buffer(secretBytes)],
        wallet1
      );

      // Claim gift
      const result = simnet.callPublicFn(
        "gift-escrow",
        "claim-gift",
        [Cl.uint(0), Cl.buffer(secretBytes)],
        wallet2
      );

      expect(result.result).toBeOk(Cl.bool(true));
    });

    it("should fail with wrong secret", () => {
      const secretBytes = createSecretHash("correct-secret");
      const wrongSecretBytes = createSecretHash("wrong-secret");

      simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [Cl.uint(1000000n), Cl.stringUtf8("Test"), Cl.buffer(secretBytes)],
        wallet1
      );

      const result = simnet.callPublicFn(
        "gift-escrow",
        "claim-gift",
        [Cl.uint(0), Cl.buffer(wrongSecretBytes)],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(103)); // ERR_INVALID_SECRET
    });

    it("should fail to claim already claimed gift", () => {
      const secretBytes = createSecretHash("one-time-secret");

      simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [Cl.uint(1000000n), Cl.stringUtf8("Once only"), Cl.buffer(secretBytes)],
        wallet1
      );

      // First claim succeeds
      simnet.callPublicFn(
        "gift-escrow",
        "claim-gift",
        [Cl.uint(0), Cl.buffer(secretBytes)],
        wallet2
      );

      // Second claim fails
      const result = simnet.callPublicFn(
        "gift-escrow",
        "claim-gift",
        [Cl.uint(0), Cl.buffer(secretBytes)],
        wallet2
      );

      expect(result.result).toBeErr(Cl.uint(102)); // ERR_ALREADY_CLAIMED
    });
  });

  describe("get-gift", () => {
    it("should return gift details", () => {
      const secretBytes = createSecretHash("details-secret");

      simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [Cl.uint(1000000n), Cl.stringUtf8("Check details"), Cl.buffer(secretBytes)],
        wallet1
      );

      const result = simnet.callReadOnlyFn(
        "gift-escrow",
        "get-gift",
        [Cl.uint(0)],
        wallet1
      );

      expect(result.result.type).toBe(ClarityType.OptionalSome);
    });

    it("should return none for non-existent gift", () => {
      const result = simnet.callReadOnlyFn(
        "gift-escrow",
        "get-gift",
        [Cl.uint(999)],
        wallet1
      );

      expect(result.result).toBeNone();
    });
  });

  describe("is-claimable", () => {
    it("should return true for unclaimed gift", () => {
      const secretBytes = createSecretHash("claimable");

      simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [Cl.uint(1000000n), Cl.stringUtf8("Claimable"), Cl.buffer(secretBytes)],
        wallet1
      );

      const result = simnet.callReadOnlyFn(
        "gift-escrow",
        "is-claimable",
        [Cl.uint(0)],
        wallet1
      );

      expect(result.result).toBeBool(true);
    });

    it("should return false for claimed gift", () => {
      const secretBytes = createSecretHash("will-claim");

      simnet.callPublicFn(
        "gift-escrow",
        "create-gift",
        [Cl.uint(1000000n), Cl.stringUtf8("Will claim"), Cl.buffer(secretBytes)],
        wallet1
      );

      simnet.callPublicFn(
        "gift-escrow",
        "claim-gift",
        [Cl.uint(0), Cl.buffer(secretBytes)],
        wallet2
      );

      const result = simnet.callReadOnlyFn(
        "gift-escrow",
        "is-claimable",
        [Cl.uint(0)],
        wallet1
      );

      expect(result.result).toBeBool(false);
    });
  });

  describe("get-fee-info", () => {
    it("should return fee configuration", () => {
      const result = simnet.callReadOnlyFn(
        "gift-escrow",
        "get-fee-info",
        [],
        wallet1
      );

      expect(result.result.type).toBe(ClarityType.Tuple);
    });
  });
});
