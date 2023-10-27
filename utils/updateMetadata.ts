import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NFT } from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "../constants/addresses";

const chain = "mumbai";

const pikachuImage = "https://cc56bbcfc1e0140ce8d572c3863c9985.ipfscdn.io/ipfs/bafybeiheyj5s4djkigc7jocls3nhvtisniuq5mzyodxflqwf5ih547rcce/Pikachu.png";

function getSDK() {
    const sdk = ThirdwebSDK.fromPrivateKey(
        process.env.PRIVATE_KEY!,
        chain,
        {
            clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
        }
    );
    return sdk;
};

export async function gainExp(
    nft: NFT,
    level: string,
    exp: string,
    nftTokenId: string,
){
    try {
        const sdk = getSDK();

        const contract = await sdk.getContract(CONTRACT_ADDRESS);

        var updatedExp = await parseInt(exp) + 50;
        var updatedLvl = await parseInt(level);

        if (updatedExp >= 100) {
            updatedLvl += 1;
            updatedExp -= 100;
        }

        const metadata = {
            ...nft.metadata,
            attributes: [
                {
                    trait_type: "Level",
                    value: updatedLvl.toString(),
                },
                {
                    trait_type: "Exp",
                    value: updatedExp.toString(),
                },
            ],
        };

        const newUri = await sdk.storage.upload(metadata);

        const updateNFT = await contract.call(
            "setTokenURI",
            [
                nftTokenId,
                newUri,
            ]
        );

        return { success: "Pokemon Trained!" };
    } catch (error) {
        console.log(error);
    }
};

export async function evolve(
    nft: NFT,
    level: string,
    nftTokenId: string,
){
    try {
        const sdk = getSDK();

        const contract = await sdk.getContract(CONTRACT_ADDRESS);

        if(parseInt(level) >= 3) {
            const metadata = {
                ...nft.metadata,
                name: "Pikachu",
                image: pikachuImage,
            };

            const newUri = await sdk.storage.upload(metadata);

            const updateNFT = await contract.call(
                "setTokenURI",
                [
                    nftTokenId,
                    newUri,
                ],
            );
        }

        return;
    } catch (error) {
        console.log(error);
    }
}