# ABC-ORA

## Onchain music and more, produced with ORA's onchain AI oracle

Hello all, and welcome to our project for the Autonomous Agent hackathon, an event exploring the intersection between the technologies of blockchain and artificial intelligence.

### Introduction

Our project began with the observation that the large language model Llama-2 could output short musical pieces if prompted to give them in ABC format, a type of compact musical notation often used for digitizing folk songs.  

In ABC format, the melody is given in text using the letters A-G for notes, with the characters ^, _ , and =  designating sharp, flat, and natural, respectively.  Duration of each note in number of beats is written next to the note: if no number is written, it's assumed to be one beat.  For example, in 4/4 time, `DF2D` would denote a quarter note D (since quarter note gets the beat), followed by a half note F (2 beats), followed by a quarter note D again.  The data necessary to play the piece is in the key signature, time signature, and melody fields, although ABC format comes with other fields for metadata about the piece, such as the author.  For more information on ABC format, see [this resource](https://abcnotation.com).

If we were creating on-chain music using a web2 approach, we could produce a Llama-2 output by contacting a server off-chain, and then post the results to the chain.  However, we wanted to create on-chain music in a way that was completely decentralized.  Due to the high cost of memory and computation on the blockchain, having a large language model (LLM) such as Llama-2 running on layer one is infeasible.  ORA provides a solution to this problem with their Onchain AI Oracle (OAO), which uses optimistic machine learning (opML) to verify on-chain ML inferences which are performed off-chain by a decentralized network.  This offloads the computational burden of ML inferences from the blockchain without sacrificing decentralization or adding new trust assumptions.  For more information on OAO, you can check out [the official ORA website](https://ora.io).

If the goal were only to send a prompt to Llama-2 via the OAO and receive an output on-chain, that would be easy enough to accomplish.  We decided to put an extra twist on the project.  Instead of just creating music based on a prompt, we would use the two AI models currently supported by OAO (Llama-2 and Stable Diffusion) to create an on-chain fictional character.  The character would have an associated music and an image, both verifiably AI generated.  

After that, the two are combined into an NFT representing the character.  Our NFT is a special kind, however, that uses the Artificial Intelligence-Generated Content Non-Fungible Token (AIGC-NFT) standard, described in detail in Ethereum Request for Comment (ERC) 7007. It extends the common NFT standard, so every ERC-7007 token is an ERC-721 as well.  However, it includes metadata specific to verifiably AI-generated content, including information relating to the proof.  For more information on the AIGC-NFT standard, see [ERC-7007](https://eips.ethereum.org/EIPS/eip-7007).

### Project Summary

With ABC-ORA, users can:

1. Input a short description of a fictional character and the mood of a piece.
2. Generate theme music and an image of the character onchain, with verifiable inference provided by ORA's onchain AI oracle.
3. Play the character's theme music through a MIDI player on the frontend.
4. Register this character art as an AIGC-NFT.

This project is experimental in nature: it is only intended to show what is possible with verifiable onchain ML inference, and to have some lighthearted fun.  All associated smart contracts are deployed on Sepolia testnet only.

### How It Works

#### Frontend and User Prompt

Through our frontend, the user enters a simple prompt describing their character in a few words, along with the intended mood of the theme music.  To give a few examples, the user could enter 
```
character description: "old samurai"
mood: "pensive"
```

or

```
character description: "schoolboy"
mood: "happy"
```

After connecting a wallet with enough Sepolia testnet ETH, the user can submit their input to a transaction.  This will be transformed into an extended prompt, as described in the next subsection, before being sent to the onchain AI oracle.

#### Prompt Engineering

The user-provided input is used to create a more detailed prompt.  First, the short description is given as input to Llama-2, a large language model, to produce a longer, more detailed description.  This is expanded further with specific, fixed instructions for designing appropriate theme music.  For example, you can think of this extended prompt as saying something like "Design a theme song in ABC format for Haru, an old samurai who has been wandering the world for decades.  The piece should be in 4/4 time and reflect the pensive mood of the character."  This is just to give you an idea: actual examples of extended prompts are substantially longer and more precise about the instructions for music generation.

The extended prompt will then be sent as input to ORA's onchain AI oracle (OAO).

#### Verifiable Inference with OAO

The OAO reads the extended prompt which is sent to it as data in a transaction.  The ML inference is performed by a node on the ORA network and sent back to the chain.  The inference is secured by an optimistic protocol.  During a challenge period of one week, a user may try to dispute the inference.  If the inference was computed incorrectly, the dispute process will find the error and the node that submitted the incorrect inference will be slashed.  The result may be finalized early if the dispute process verifies an inference before the one-week challenge period is over.

While the opML protocol can be used on any model in theory, at the moment the ORA network has nodes running Llama-2 and Stable Diffusion.

#### NFT Creation

Once the music and image is generated for the on-chain character, the two are combined and minted as an NFT.  We use the AIGC-NFT standard for verifiably AI generated content.  In our case, the proof is optimistic, so the proof doesn't need to be included in the metadata.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
