import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>HUNTERSWAP</title>
        <meta name="description" content="HUNTERSWAP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.title}>Ecological Partner</div>
          <div className={styles.introduce}>
            Collect the application partners of BNB Chain to form an entire ecosystemBuild scalable payment apps,
            non-custodial exchanges, and NFT marketpl-aces on Ethereum with Loopring's time-tested zkRollup technology.
            Get started with quick-start guides, protocol documentation, a Javascript SDK, and a fully open source
            codebase.
          </div>
          <div className={styles.menuWrapper}>
            <div className={styles.itemWrapper}>
              <div className={styles.item}>NODEREAL</div>
              <div className={styles.blockChain}>
                <div className={styles.blockChainItem}>COCOS</div>
                <div className={styles.blockChainItem}>BLOCKCHAIN</div>
                <div className={styles.blockChainItem}>EXPEDITION</div>
              </div>
            </div>
            <div className={styles.itemWrapper}>
              <div className={styles.item}>BNB CHAIN</div>
              <div className={styles.item}>OPTIMISM</div>
            </div>
          </div>
        </div>
        <div className={styles.copyRight}>Copyright © 2023 coco-dex Team Foundation Ltd. All rights reserved.</div>
      </main>
    </>
  )
}
