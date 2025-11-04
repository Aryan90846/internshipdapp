const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InternCertificateNFT", function () {
  let certificate;
  let owner;
  let issuer;
  let user1;
  let user2;
  
  const ISSUER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ISSUER_ROLE"));
  const testMetadataURI = "ipfs://QmTest123";
  const testMetadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));
  const testCertId = "CERT-2024-001";

  beforeEach(async function () {
    [owner, issuer, user1, user2] = await ethers.getSigners();
    
    const InternCertificateNFT = await ethers.getContractFactory("InternCertificateNFT");
    certificate = await InternCertificateNFT.deploy();
    await certificate.waitForDeployment();
    
    // Grant ISSUER_ROLE to issuer account
    await certificate.grantRole(ISSUER_ROLE, issuer.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const DEFAULT_ADMIN_ROLE = await certificate.DEFAULT_ADMIN_ROLE();
      expect(await certificate.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should grant ISSUER_ROLE to deployer", async function () {
      expect(await certificate.hasRole(ISSUER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should mint a certificate successfully", async function () {
      await certificate.connect(issuer).mintCertificate(
        user1.address,
        testMetadataURI,
        testMetadataHash,
        testCertId
      );
      
      expect(await certificate.ownerOf(0)).to.equal(user1.address);
      expect(await certificate.tokenURI(0)).to.equal(testMetadataURI);
    });

    it("Should emit CertificateIssued event", async function () {
      await expect(
        certificate.connect(issuer).mintCertificate(
          user1.address,
          testMetadataURI,
          testMetadataHash,
          testCertId
        )
      ).to.emit(certificate, "CertificateIssued");
    });

    it("Should reject minting from non-issuer", async function () {
      await expect(
        certificate.connect(user1).mintCertificate(
          user2.address,
          testMetadataURI,
          testMetadataHash,
          testCertId
        )
      ).to.be.reverted;
    });

    it("Should reject duplicate certificate IDs", async function () {
      await certificate.connect(issuer).mintCertificate(
        user1.address,
        testMetadataURI,
        testMetadataHash,
        testCertId
      );
      
      await expect(
        certificate.connect(issuer).mintCertificate(
          user2.address,
          testMetadataURI,
          testMetadataHash,
          testCertId
        )
      ).to.be.revertedWith("Certificate ID already exists");
    });
  });

  describe("Batch Minting", function () {
    it("Should batch mint multiple certificates", async function () {
      const recipients = [user1.address, user2.address];
      const uris = ["ipfs://QmTest1", "ipfs://QmTest2"];
      const hashes = [
        ethers.keccak256(ethers.toUtf8Bytes("metadata1")),
        ethers.keccak256(ethers.toUtf8Bytes("metadata2"))
      ];
      const certIds = ["CERT-001", "CERT-002"];
      
      await certificate.connect(issuer).batchMint(recipients, uris, hashes, certIds);
      
      expect(await certificate.ownerOf(0)).to.equal(user1.address);
      expect(await certificate.ownerOf(1)).to.equal(user2.address);
      expect(await certificate.totalSupply()).to.equal(2);
    });

    it("Should reject batch mint with mismatched arrays", async function () {
      const recipients = [user1.address];
      const uris = ["ipfs://QmTest1", "ipfs://QmTest2"];
      const hashes = [ethers.keccak256(ethers.toUtf8Bytes("metadata1"))];
      const certIds = ["CERT-001"];
      
      await expect(
        certificate.connect(issuer).batchMint(recipients, uris, hashes, certIds)
      ).to.be.revertedWith("Array lengths must match");
    });
  });

  describe("Revocation", function () {
    beforeEach(async function () {
      await certificate.connect(issuer).mintCertificate(
        user1.address,
        testMetadataURI,
        testMetadataHash,
        testCertId
      );
    });

    it("Should revoke a certificate", async function () {
      await certificate.connect(issuer).revokeCertificate(0, "Test revocation");
      expect(await certificate.isRevoked(0)).to.be.true;
    });

    it("Should emit CertificateRevoked event", async function () {
      await expect(
        certificate.connect(issuer).revokeCertificate(0, "Test reason")
      ).to.emit(certificate, "CertificateRevoked");
    });

    it("Should prevent transfers of revoked certificates", async function () {
      await certificate.connect(issuer).revokeCertificate(0, "Test");
      
      await expect(
        certificate.connect(user1).transferFrom(user1.address, user2.address, 0)
      ).to.be.revertedWith("Cannot transfer revoked certificate");
    });

    it("Should reject revoking already revoked certificate", async function () {
      await certificate.connect(issuer).revokeCertificate(0, "First");
      
      await expect(
        certificate.connect(issuer).revokeCertificate(0, "Second")
      ).to.be.revertedWith("Certificate already revoked");
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      await certificate.connect(issuer).mintCertificate(
        user1.address,
        testMetadataURI,
        testMetadataHash,
        testCertId
      );
    });

    it("Should verify certificate details", async function () {
      const [owner, uri, hash, isRevoked] = await certificate.verifyCertificate(0);
      
      expect(owner).to.equal(user1.address);
      expect(uri).to.equal(testMetadataURI);
      expect(hash).to.equal(testMetadataHash);
      expect(isRevoked).to.be.false;
    });

    it("Should get token ID by certificate ID", async function () {
      const tokenId = await certificate.getTokenIdByCertificateId(testCertId);
      expect(tokenId).to.equal(0);
    });

    it("Should reject verification of non-existent certificate", async function () {
      await expect(
        certificate.verifyCertificate(999)
      ).to.be.revertedWith("Certificate does not exist");
    });
  });
});
