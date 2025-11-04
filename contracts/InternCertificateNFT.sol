// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title InternCertificateNFT
 * @dev Decentralized internship certificate system with role-based access control
 * @author Aryan Web3 Labs
 */
contract InternCertificateNFT is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    
    Counters.Counter private _tokenIdCounter;
    
    // Mapping from tokenId to metadata hash for verification
    mapping(uint256 => bytes32) private _metadataHashes;
    
    // Mapping from tokenId to revocation status
    mapping(uint256 => bool) private _revoked;
    
    // Mapping from certificate ID string to token ID
    mapping(string => uint256) private _certificateIdToToken;
    
    // Events
    event CertificateIssued(
        address indexed to,
        uint256 indexed tokenId,
        string uri,
        bytes32 metadataHash,
        string certificateId
    );
    
    event CertificateRevoked(uint256 indexed tokenId, string reason);

    constructor() ERC721("Aryan Internship Certificate", "CERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    /**
     * @dev Mint a single certificate NFT
     * @param to Recipient wallet address
     * @param metadataURI IPFS URI containing certificate metadata
     * @param metadataHash SHA256 hash of metadata for verification
     * @param certificateId Unique certificate identifier
     */
    function mintCertificate(
        address to,
        string memory metadataURI,
        bytes32 metadataHash,
        string memory certificateId
    ) public onlyRole(ISSUER_ROLE) returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");
        require(metadataHash != bytes32(0), "Metadata hash cannot be empty");
        require(_certificateIdToToken[certificateId] == 0, "Certificate ID already exists");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        _metadataHashes[tokenId] = metadataHash;
        _certificateIdToToken[certificateId] = tokenId;
        
        emit CertificateIssued(to, tokenId, metadataURI, metadataHash, certificateId);
        
        return tokenId;
    }

    /**
     * @dev Batch mint certificates
     * @param recipients Array of recipient addresses
     * @param metadataURIs Array of IPFS URIs
     * @param metadataHashes Array of metadata hashes
     * @param certificateIds Array of certificate IDs
     */
    function batchMint(
        address[] memory recipients,
        string[] memory metadataURIs,
        bytes32[] memory metadataHashes,
        string[] memory certificateIds
    ) external onlyRole(ISSUER_ROLE) {
        require(
            recipients.length == metadataURIs.length &&
            recipients.length == metadataHashes.length &&
            recipients.length == certificateIds.length,
            "Array lengths must match"
        );
        
        for (uint256 i = 0; i < recipients.length; i++) {
            mintCertificate(recipients[i], metadataURIs[i], metadataHashes[i], certificateIds[i]);
        }
    }

    /**
     * @dev Revoke a certificate (marks as invalid but doesn't burn)
     * @param tokenId Token ID to revoke
     * @param reason Reason for revocation
     */
    function revokeCertificate(uint256 tokenId, string memory reason) 
        external 
        onlyRole(ISSUER_ROLE) 
    {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        require(!_revoked[tokenId], "Certificate already revoked");
        
        _revoked[tokenId] = true;
        emit CertificateRevoked(tokenId, reason);
    }

    /**
     * @dev Verify certificate authenticity and status
     * @param tokenId Token ID to verify
     * @return owner Owner address
     * @return uri Metadata URI
     * @return metadataHash Original metadata hash
     * @return isRevoked Revocation status
     */
    function verifyCertificate(uint256 tokenId) 
        external 
        view 
        returns (
            address owner,
            string memory uri,
            bytes32 metadataHash,
            bool isRevoked
        ) 
    {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        
        return (
            ownerOf(tokenId),
            tokenURI(tokenId),
            _metadataHashes[tokenId],
            _revoked[tokenId]
        );
    }

    /**
     * @dev Get token ID from certificate ID string
     * @param certificateId Certificate ID string
     * @return tokenId Associated token ID
     */
    function getTokenIdByCertificateId(string memory certificateId) 
        external 
        view 
        returns (uint256) 
    {
        uint256 tokenId = _certificateIdToToken[certificateId];
        require(tokenId != 0 || keccak256(bytes(certificateId)) == keccak256(bytes("")), "Certificate ID not found");
        return tokenId;
    }

    /**
     * @dev Check if certificate is revoked
     * @param tokenId Token ID to check
     * @return bool Revocation status
     */
    function isRevoked(uint256 tokenId) external view returns (bool) {
        return _revoked[tokenId];
    }

    /**
     * @dev Get total certificates issued
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Prevent transfers of revoked certificates
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        require(!_revoked[tokenId], "Cannot transfer revoked certificate");
        return super._update(to, tokenId, auth);
    }
}
