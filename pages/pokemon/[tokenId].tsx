import { MediaRenderer, NFT, useContract, useNFT, useSDK } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { CONTRACT_ADDRESS } from "../../constants/addresses";
import styles from "../../styles/Home.module.css";
import { useState } from "react";

export default function PokemonDetail() {
    const router = useRouter();
    const sdk = useSDK();
    const { tokenId } = router.query;
    const [status, setStatus] = useState("");

    const { contract } = useContract(CONTRACT_ADDRESS);

    const {
        data: nft,
        isLoading: isNFTLoading,
    } = useNFT(contract, tokenId?.toString());

    const pikachuImage = "https://cc56bbcfc1e0140ce8d572c3863c9985.ipfscdn.io/ipfs/bafybeiheyj5s4djkigc7jocls3nhvtisniuq5mzyodxflqwf5ih547rcce/Pikachu.png";

    async function gainExp(
        nft: NFT,
        level: string,
        exp: string,
        nftTokenId: string,
    ){
        try {
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

            const newUri = await sdk!.storage.upload(metadata);

            const updateNFT = await contract!.call(
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

    async function evolve(
        nft: NFT,
        level: string,
        nftTokenId: string,
    ){
        try {
            if(parseInt(level) >= 3) {
                const metadata = {
                    ...nft.metadata,
                    name: "Pikachu",
                    image: pikachuImage,
                };
    
                const newUri = await sdk!.storage.upload(metadata);
    
                const updateNFT = await contract!.call(
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

    if(isNFTLoading) {
        return (
            <main className={styles.main}>
                <div className={styles.centeredContainer}>
                    <h1>Getting Pokemon Data...</h1>
                </div>
            </main>
        );
    }

    return (
        <div className={styles.nftDetailContainer}>
            <button
                className={styles.button}
                onClick={() => router.back()}
            >Back</button>
            <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "20px" }}>
                <MediaRenderer
                    src={nft?.metadata?.image}
                    width="50%"
                />
                <div style={{ width:"50%" }}>
                    <h1>{nft?.metadata.name} ID# {nft?.metadata.id}</h1>
                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-start"}}>
                        {nft?.metadata.attributes && (
                            // @ts-ignore
                            nft?.metadata.attributes.map((attribute, index) => (
                                <p key={index} className={styles.nftCardTrait}>{attribute.trait_type}: {attribute.value}</p>
                            ))
                        )}
                    </div>
                    <button
                        className={styles.button}
                        onClick={async () => {
                            try {
                                setStatus("Training! Give it a few seconds...");
                                await gainExp(
                                    nft!,
                                    // @ts-ignore
                                    nft?.metadata.attributes[0].value,
                                    // @ts-ignore
                                    nft?.metadata.attributes[1].value,
                                    tokenId!.toString(),
                                );
                                setStatus("Trained!");
                                await new Promise((resolve) => setTimeout(resolve, 2000));
                            } catch (error) {
                                console.error(error);
                            }
                            router.back();
                        }}
                    >EXP Training</button>
                    <button
                        className={styles.button}
                        onClick={async () => {
                            try {
                                setStatus("Evolving! Give it a few seconds...");
                                await evolve(
                                    nft!,
                                    // @ts-ignore
                                    nft?.metadata.attributes[0].value,
                                    tokenId!.toString(),
                                );
                                setStatus("Evolved!");
                                await new Promise((resolve) => setTimeout(resolve, 2000));
                            } catch (error) {
                                console.error(error);
                            }
                            router.back();
                        }}
                    >Evolve</button>
                    <p>{status}</p>
                </div>
            </div>
        </div>
    );
};