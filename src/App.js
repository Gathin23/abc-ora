import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { Notation, Midi } from "react-abc";
import ConnectButton from "./components/ConnectButton";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { TitleCard } from "./components/TitleCard";
import { Boxes } from "./components/ui/background-boxes";
import { BackgroundGradientAnimation } from "./components/ui/background-gradient-animation";

function App() {
  let abcstring = `X: 1
  T: Cooley's
  M: 4/4
  L: 1/8
  K: Emin
  |:D2|"Em"EB{c}BA B2 EB|~B2 AB dBAG|"D"FDAD BDAD|FDAD dAFD|
  "Em"EBBA B2 EB|B2 AB defg|"D"afe^c dBAF|"Em"DEFD E2:|
  |:gf|"Em"eB B2 efge|eB B2 gedB|"D"A2 FA DAFA|A2 FA defg|
  "Em"eB B2 eBgB|eB B2 defg|"D"afe^c dBAF|"Em"DEFD E2:|`;

  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  let [character, setCharacter] = useState("");
  let [mood, setMood] = useState("");
  const [notation, setNotation] = useState();
  const [artURL, setArtURL] = useState("");
  const [view, setView] = useState(0);

  let prompt = `Generate a music theme in ABCjs format for a character with the following characteristics: ${character} and mood: ${mood}. Ensure the music accurately reflects the character's traits and the specified mood. Follow these steps:

  Key signature: It's usually denoted with K: followed by the note and the scale type, like C for C major. It wasn't specified in your provided output, but if we're in the key of C major (which doesn't need to be specified as it's the default), we wouldn't necessarily include this unless a different key is desired.
  Meter (Time Signature): This is denoted with M:, not K:, and the correct format for 4/4 time is M:4/4.
  Tempo: Tempo is specified with Q: followed by the note length that equals one beat (usually 1/4 for quarter note) and the BPM. For example, Q:1/4=120 for 120 beats per minute with the quarter note getting the beat.
  Tune Body: The musical notes should be written in the tune body without extraneous text, and with proper notation for rhythm and pitch.
  
  Initial Creation: Based on the character's description and the specified mood, create the ABCjs notation for the theme. Include key signature, time signature, tempo, and a melody that embodies the character's essence and the mood.
  
  Error Check 1: Review the ABCjs notation for any syntax errors or inconsistencies. This includes verifying correct usage of ABCjs elements such as headers (e.g., K: key, M: time signature), note lengths, and other musical symbols. Correct any errors found.
  
  Musicality Review: Ensure the music captures the character's personality and the specified mood. Adjust the melody, rhythm, and dynamics as necessary to better reflect the theme and emotional tone.
  
  Error Check 2: Perform a final review of the ABCjs notation, focusing on both syntax and musicality. Correct any additional errors and make sure that the music theme is now error-free and aligns perfectly with the ABCjs standard.
  
  Final Output: Present the refined and errorless ABCjs notation as the final output. This notation is ready to be directly input into an ABCjs interpreter or editor without the need for further adjustments.
  
  only print the genreated notes, no extra texts
  
  End of instructions.Generate a music theme in ABCjs format for a character with the following characteristics: [Character Description] and mood: [Mood Description]. Ensure the music accurately reflects the character's traits and the specified mood. Follow these steps:

  Key signature: It's usually denoted with K: followed by the note and the scale type, like C for C major. It wasn't specified in your provided output, but if we're in the key of C major (which doesn't need to be specified as it's the default), we wouldn't necessarily include this unless a different key is desired.
  Meter (Time Signature): This is denoted with M:, not K:, and the correct format for 4/4 time is M:4/4.
  Tempo: Tempo is specified with Q: followed by the note length that equals one beat (usually 1/4 for quarter note) and the BPM. For example, Q:1/4=120 for 120 beats per minute with the quarter note getting the beat.
  Tune Body: The musical notes should be written in the tune body without extraneous text, and with proper notation for rhythm and pitch.
  
  Initial Creation: Based on the character's description and the specified mood, create the ABCjs notation for the theme. Include key signature, time signature, tempo, and a melody that embodies the character's essence and the mood.
  
  Error Check 1: Review the ABCjs notation for any syntax errors or inconsistencies. This includes verifying correct usage of ABCjs elements such as headers (e.g., K: key, M: time signature), note lengths, and other musical symbols. Correct any errors found.
  
  Musicality Review: Ensure the music captures the character's personality and the specified mood. Adjust the melody, rhythm, and dynamics as necessary to better reflect the theme and emotional tone.
  
  Error Check 2: Perform a final review of the ABCjs notation, focusing on both syntax and musicality. Correct any additional errors and make sure that the music theme is now error-free and aligns perfectly with the ABCjs standard.
  
  Final Output: Present the refined and errorless ABCjs notation as the final output. This notation is ready to be directly input into an ABCjs interpreter or editor without the need for further adjustments.
  
  only print the genreated notes, no extra texts
  
  check the generated output twice and remove any extra descriptions other than notes
  End of instructions.`;

  let contract = null;

  let abi = JSON.parse(`[
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "output",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "callbackData",
          "type": "bytes"
        }
      ],
      "name": "aiOracleCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "prompt",
          "type": "string"
        }
      ],
      "name": "calculateAIResult",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IAIOracle",
          "name": "_aiOracle",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "contract IAIOracle",
          "name": "expected",
          "type": "address"
        },
        {
          "internalType": "contract IAIOracle",
          "name": "found",
          "type": "address"
        }
      ],
      "name": "UnauthorizedCallbackSource",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "prompt",
          "type": "string"
        }
      ],
      "name": "promptRequest",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "input",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "output",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "callbackData",
          "type": "bytes"
        }
      ],
      "name": "promptsUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "aiOracle",
      "outputs": [
        {
          "internalType": "contract IAIOracle",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "AIORACLE_CALLBACK_GAS_LIMIT",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        }
      ],
      "name": "estimateFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "prompt",
          "type": "string"
        }
      ],
      "name": "getAIResult",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        }
      ],
      "name": "isFinalized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "prompts",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "requests",
      "outputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "input",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "output",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]`);

  let nftAbi = JSON.parse(`[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IVerifier",
          "name": "_verifierContract",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_fromTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_toTokenId",
          "type": "uint256"
        }
      ],
      "name": "BatchMetadataUpdate",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "aigcData",
          "type": "bytes"
        },
        {
          "internalType": "string",
          "name": "uri",
          "type": "string"
        }
      ],
      "name": "masterMint",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "MetadataUpdate",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "prompt",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "aigcData",
          "type": "bytes"
        },
        {
          "internalType": "string",
          "name": "uri",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bytes",
          "name": "prompt",
          "type": "bytes"
        },
        {
          "indexed": true,
          "internalType": "bytes",
          "name": "aigcData",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "uri",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        }
      ],
      "name": "Mint",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "uri",
          "type": "string"
        }
      ],
      "name": "safeMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "_nextTokenId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getMetadata",
      "outputs": [
        {
          "internalType": "bytes16",
          "name": "",
          "type": "bytes16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenIdMetadata",
      "outputs": [
        {
          "internalType": "bytes16",
          "name": "metadata",
          "type": "bytes16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "verifierContract",
      "outputs": [
        {
          "internalType": "contract IVerifier",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "prompt",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "aigcData",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "proof",
          "type": "bytes"
        }
      ],
      "name": "verify",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]`);

  let contractAddress = "0x64BF816c3b90861a489A8eDf3FEA277cE1Fa0E82";
  let nftAddress = "0x537997C90916EDe13d5179A46446b0AAc8AE2EAf";

  const createArt = async (character, mood) => {
    let provider = new ethers.providers.Web3Provider(walletProvider);
    let signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    let fee = await contract.estimateFee(50);
    let result = await contract.calculateAIResult(
      50,
      `A character with the following characteristics: ${character} and mood: ${mood}.`,
      { value: fee }
    );
    console.log(result);
  };

  const getArt = async (character, mood) => {
    let provider = new ethers.providers.Web3Provider(walletProvider);
    let signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    let result = await contract.getAIResult(
      50,
      `A character with the following characteristics: ${character} and mood: ${mood}.`
    );
    console.log(`https://ipfs.io/ipfs/${result}`);
    setArtURL(`https://ipfs.io/ipfs/${result}`);
  };

  //SONG
  const calculateAIResult = async (prompt) => {
    let provider = new ethers.providers.Web3Provider(walletProvider);
    let signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    let fee = await contract.estimateFee(11);
    let result = await contract.calculateAIResult(11, prompt, { value: fee });
    console.log(result);
  };

  const getAIResult = async (prompt) => {
    let provider = new ethers.providers.Web3Provider(walletProvider);
    let signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    let result = await contract.getAIResult(11, prompt);
    console.log(result);
    setNotation(result);
  };

 
  const mintNFT = async (address, url, character, notation) => {
    let provider = new ethers.providers.Web3Provider(walletProvider);
    let signer = provider.getSigner();
    contract = new ethers.Contract(nftAddress, nftAbi, signer);

    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "name": character,
      "ipfs": url,
      "theme": notation
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    let file = await fetch("https://nft.susanoox.in/create", requestOptions)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((result) => {return result})
      .catch((error) => console.error(error));
    let result = await contract.mint(0x01, 0x00, file.file, 0x00);
    console.log(result);
  };


  return (
    <div className="">
      <ConnectButton />
      <TitleCard />

      <div className="h-96 relative w-full overflow-hidden bg-black flex flex-col items-center justify-center rounded-lg">
        <div className="absolute inset-0 w-full h-full black z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

        <Boxes />
        <form className="p-5 flex flex-col justify-center items-center z-50">
          <label className="block mb-2 text-white font-bold">
            Character:
            <input
              type="text"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              className="mt-1 ml-2 rounded-md bg-black border border-white py-2"
            />
          </label>
          <label className="mt-5 block text-white font-bold ml-8">
            Mood:
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mt-1 ml-2 rounded-md bg-black border border-white py-2"
            />
          </label>
        </form>
        <button
          onClick={() => {
            if (isConnected) {
              if (mood && character) {
                calculateAIResult(prompt);
                createArt(character, mood);
              } else {
                alert("Please fill in the character and mood fields");
              }
            } else {
              alert("Please connect your wallet");
            }
          }}
          className="mt-5 ml-16 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 z-50"
        >
          Create song and Art
        </button>
        <span className="z-50 mt-5 ml-16 mb-5">
          <p className="text-white font-light">
            (First Click Create song and Art and wait 30-40s before clicking
            below)
          </p>
        </span>
        <div className="z-50">
          <button
            onClick={() => {
              getAIResult(prompt);
              setView(1);
            }}
            className=" ml-16 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 z-50"
          >
            Get Song
          </button>
          <button
            onClick={() => {
              getArt(character, mood);
              setView(2);
            }}
            className=" ml-16 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 z-50"
          >
            Get Art
          </button>
        </div>
        <button
          onClick={() => {
            mintNFT(address, artURL, character, notation);
          }}
          className="mt-5 ml-16 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-600 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 z-50"
        >
          Mint NFT
        </button>
      </div>

      <div className="mt-5 mb-10 z-50">
        {notation && <Midi notation={notation} />}
      </div>

      <div className="flex items-center justify-center">
        {view == 1 && notation && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
              <div className="flex bg-white justify-center items-center">
                <Notation notation={notation} />
              </div>
            </div>
          </BackgroundGradientAnimation>
        )}

        {view == 2 && artURL && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
              <div className="flex items-center justify-center">
                <img src={artURL} alt="" />
              </div>
            </div>
          </BackgroundGradientAnimation>
        )}
      </div>
    </div>
  );
}

export default App;
