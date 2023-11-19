import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { initSilk } from '@silk-wallet/silk-wallet-sdk'
import { configureChains, createConfig, mainnet, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    const silk = initSilk()
    // @ts-ignore
    window.ethereum = silk
  }, [])

  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
