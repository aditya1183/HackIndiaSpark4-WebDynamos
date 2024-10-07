

// // Import necessary packages
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const Web3 = require('web3').default; 

// // Initialize Express app
// const app = express();
// app.use(express.json());

// // Use CORS with proper options
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from your frontend
//   methods: ['GET', 'POST'], // Allow these methods
//   allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
// }));

// // Your other code (PEXELS API, Web3 setup, etc.)

// const PEXELS_API_KEY = process.env.PEXELS_API_KEY; // Add your Pexels API key to .env
// const INFURA_API_URL = process.env.INFURA_API_URL; // Add Infura or another Ethereum provider
// const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY; // Add your private key for signing transactions

// // Web3 instance connected to Ethereum network (via Infura)
// const web3 = new Web3(INFURA_API_URL); // Initialize Web3 instance

// // Your Ethereum account address (linked to the private key)
// const accountAddress = '0xYourAccountAddress';

// // Route to fetch media from Pexels API and store a blockchain transaction
// app.post('/api/generate-media', async (req, res) => {
//   const { prompt, mediaType } = req.body;
//   console.log(prompt);

//   try {
//     let mediaUrl;
//     if (mediaType === 'video') {
//       // Fetch from Pexels Video API
//       const response = await axios.get(
//         `https://api.pexels.com/videos/search?query=${prompt}&per_page=1`,
//         {
//           headers: {
//             Authorization: PEXELS_API_KEY,
//           },
//         }
//       );
//       mediaUrl = response.data.videos[0]?.video_files[0].link;
//     } else {
//       // Fetch from Pexels Image API
//       const response = await axios.get(
//         `https://api.pexels.com/v1/search?query=${prompt}&per_page=1`,
//         {
//           headers: {
//             Authorization: PEXELS_API_KEY,
//           },
//         }
//       );
//       mediaUrl = response.data.photos[0]?.src.medium;
//     }

//     if (!mediaUrl) {
//       return res.status(404).json({ message: 'No media found.' });
//     }

//     // Record media URL hash on Ethereum blockchain
//     const mediaHash = web3.utils.sha3(mediaUrl); // Hashing media URL for blockchain storage

//     // Create transaction object
//     const tx = {
//       from: accountAddress,
//       to: accountAddress, // You can replace this with a smart contract address if needed
//       value: '0', // No ether transfer, just calling the network
//       gas: 2000000,
//       data: web3.utils.asciiToHex(mediaHash), // Store the media hash
//     };

//     // Sign the transaction
//     const signedTx = await web3.eth.accounts.signTransaction(tx, WALLET_PRIVATE_KEY);

//     // Send the transaction
//     const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

//     // Return the media URL and blockchain transaction hash to the frontend
//     res.json({
//       mediaUrl,
//       mediaType,
//       transactionHash: receipt.transactionHash,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error generating media or processing blockchain transaction.' });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5002;
// app.listen(5001, () => {
//   console.log(`Server is running on port 5001`);
// });



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Web3 = require('web3').default;

// Initialize Express app
const app = express();
app.use(express.json());

// Use CORS with proper options
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));

// Your other code (PEXELS API, Web3 setup, etc.)

const PEXELS_API_KEY = process.env.PEXELS_API_KEY; // Add your Pexels API key to .env
const INFURA_API_URL = process.env.INFURA_API_URL; // Add Infura or another Ethereum provider
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY; // Add your private key for signing transactions

// Web3 instance connected to Ethereum network (via Infura)
const web3 = new Web3(INFURA_API_URL); // Initialize Web3 instance

// Your Ethereum account address (linked to the private key)
const accountAddress = '0xYourAccountAddress';

// Route to fetch media from Pexels API and store a blockchain transaction
app.post('/api/generate-media', async (req, res) => {
  const { prompt, mediaType } = req.body;
  console.log('Received prompt:', prompt);

  try {
    let mediaUrl;

    // Fetch from Pexels API
    const baseURL = mediaType === 'video' 
      ? 'https://api.pexels.com/videos/search'
      : 'https://api.pexels.com/v1/search';

    const response = await axios.get(baseURL, {
      params: {
        query: prompt,
        per_page: 1,
      },
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    // Check response based on media type
    if (mediaType === 'video') {
      mediaUrl = response.data.videos[0]?.video_files[0]?.link;
    } else {
      mediaUrl = response.data.photos[0]?.src?.medium;
    }

    if (!mediaUrl) {
      return res.status(404).json({ message: 'No media found.' });
    }

    // Record media URL hash on Ethereum blockchain
    const mediaHash = web3.utils.sha3(mediaUrl); // Hashing media URL for blockchain storage

    // Create transaction object
    const tx = {
      from: accountAddress,
      to: accountAddress, // You can replace this with a smart contract address if needed
      value: '0', // No ether transfer, just calling the network
      gas: 2000000,
      data: web3.utils.asciiToHex(mediaHash), // Store the media hash
    };

    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, WALLET_PRIVATE_KEY);

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Return the media URL and blockchain transaction hash to the frontend
    res.json({
      mediaUrl,
      mediaType,
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error('Error during media generation or blockchain transaction:', error);
    const errorMessage = error.response?.data?.message || 'Error generating media or processing blockchain transaction.';
    res.status(500).json({ message: errorMessage });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(5001, () => {
  console.log(`Server is running on port 5001`);
});
