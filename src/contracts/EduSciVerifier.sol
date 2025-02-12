// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IZKVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external view returns (bool);
}

contract EduAIVerifier {
    IZKVerifier public zkVerifier;
    mapping(address => mapping(bytes32 => bool)) public verifiedAssessments;
    mapping(address => Assessment[]) public assessments;
    
    struct Assessment {
        bytes32 id;
        string title;
        string ipfsHash;
        string aiModel;
        string subject;
        bool verified;
        uint256 timestamp;
        uint256 difficultyLevel;
        string[] skills;
    }
    
    event AssessmentSubmitted(
        address indexed educator,
        bytes32 indexed id,
        string title,
        string aiModel
    );
    event AssessmentVerified(address indexed educator, bytes32 indexed id);
    event SkillsUpdated(bytes32 indexed id, string[] skills);
    
    constructor(address _zkVerifier) {
        zkVerifier = IZKVerifier(_zkVerifier);
    }
    
    function submitAssessment(
        string memory title,
        string memory ipfsHash,
        string memory aiModel,
        string memory subject,
        uint256 difficultyLevel,
        string[] memory skills
    ) external returns (bytes32) {
        require(difficultyLevel >= 1 && difficultyLevel <= 5, "Invalid difficulty level");
        require(bytes(title).length > 0, "Title required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        bytes32 id = keccak256(abi.encodePacked(
            msg.sender,
            title,
            aiModel,
            block.timestamp
        ));
        
        assessments[msg.sender].push(Assessment({
            id: id,
            title: title,
            ipfsHash: ipfsHash,
            aiModel: aiModel,
            subject: subject,
            verified: false,
            timestamp: block.timestamp,
            difficultyLevel: difficultyLevel,
            skills: skills
        }));
        
        emit AssessmentSubmitted(msg.sender, id, title, aiModel);
        return id;
    }
    
    function verifyAssessment(
        bytes32 id,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external {
        require(zkVerifier.verifyProof(a, b, c, input), "Invalid proof");
        verifiedAssessments[msg.sender][id] = true;
        
        for (uint i = 0; i < assessments[msg.sender].length; i++) {
            if (assessments[msg.sender][i].id == id) {
                assessments[msg.sender][i].verified = true;
                break;
            }
        }
        
        emit AssessmentVerified(msg.sender, id);
    }
    
    function updateSkills(bytes32 id, string[] memory newSkills) external {
        bool found = false;
        for (uint i = 0; i < assessments[msg.sender].length; i++) {
            if (assessments[msg.sender][i].id == id) {
                assessments[msg.sender][i].skills = newSkills;
                found = true;
                break;
            }
        }
        require(found, "Assessment not found");
        emit SkillsUpdated(id, newSkills);
    }
    
    function getAssessments(address educator) external view returns (Assessment[] memory) {
        return assessments[educator];
    }
}