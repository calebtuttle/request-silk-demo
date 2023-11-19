import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const inter = Inter({ subsets: ['latin'] })

export default function AccountNavItem() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

	const { disconnect } = useDisconnect()

  return (
    <div>
      {isConnected && address ? (
        <div>
          <p className="text-sm font-medium dark:text-gray-200">{address}</p>
          <hr />
          <button 
            className="float-right text-gray-300 hover:underline font-bold rounded"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          className="bg-gray-300 text-gray-900 hover:bg-gray-200 font-bold py-2 px-4 rounded-lg"
          onClick={async () => {
            try {
              // @ts-ignore
              await window.ethereum.login()
              connect()
            } catch (err) {
              console.error(err)
            }
          }}
        >
          Login
        </button>
      )}
    </div>
  )
}
