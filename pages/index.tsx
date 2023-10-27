import { ConnectWallet, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { CONTRACT_ADDRESS } from "../constants/addresses";
import { NFTCard } from "../components/NFTCard";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract } = useContract(CONTRACT_ADDRESS);

  const {
    data: ownedNFTs,
    isLoading: isOwnedNFTsLoading,
  } = useOwnedNFTs(contract, address);

  if(!address) {
    return (
      <div className={styles.main}>
        <div className={styles.centeredContainer}>
          <div className={styles.centeredCard}>
            <h1>Evolving NFTs</h1>
            <ConnectWallet />
          </div>
        </div>
      </div>
    );
  };
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", maxHeight:"48px", marginTop: "10px"}}>
          <h1>My Pokemon</h1>
          <ConnectWallet />
        </div>
        <div className={styles.grid} style={{ marginTop: "20px"}}>
          {!isOwnedNFTsLoading && (
            ownedNFTs && ownedNFTs.length > 0 ? (
              ownedNFTs.map((nft) => (
                <NFTCard
                  key={nft.metadata.id}
                  nft={nft}
                />
              ))
            ) : (
              <p>No Pokemon</p>
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
