import { NFT, ThirdwebNftMedia } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Link from "next/link";

type NFTCardProps = {
    nft: NFT;
};

export const NFTCard = ({ nft }: NFTCardProps) => {
    return (
        <div className={styles.nftCard}>
            <ThirdwebNftMedia
                metadata={nft.metadata}
            />
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <p className={styles.nftCardName}>{nft.metadata.name}</p>
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end"}}>
                    {nft.metadata.attributes && (
                        // @ts-ignore
                        nft.metadata.attributes.map((attribute, index) => (
                            <p key={index} className={styles.nftCardTrait}>{attribute.trait_type}: {attribute.value}</p>
                        ))
                    )}
                </div>
            </div>
            <Link href={`/pokemon/${nft.metadata.id}`} style={{ width:"100%" }}>
                <button className={styles.button}>Train</button>
            </Link>
        </div>
    );
};