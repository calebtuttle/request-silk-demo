import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useWalletClient, useAccount } from "wagmi";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { RequestNetwork, Types, Utils } from "@requestnetwork/request-client.js"
import { ChainName } from "@requestnetwork/types/dist/currency-types"
import AccountNavItem from '@/components/AccountNavItem'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  async function createRequest() {
    console.log('creating request')
    const web3SignatureProvider = new Web3SignatureProvider(walletClient);

    console.log('got web3SignatureProvider', web3SignatureProvider)

    const requestClient = new RequestNetwork({
      nodeConnectionConfig: { 
        baseURL: "https://goerli.gateway.request.network/",
      },
      signatureProvider: web3SignatureProvider,
    });

    console.log('got requestClient', requestClient)

    const network = 'goerli' as ChainName;
  
    // const payeeIdentity = '0x7eB023BFbAeE228de6DC5B92D0BeEB1eDb1Fd567';
    const payeeIdentity = address;
    const payerIdentity = '0x519145B771a6e450461af89980e5C17Ff6Fd8A92';
    const paymentRecipient = payeeIdentity;
    const feeRecipient = '0x0000000000000000000000000000000000000000';
  
    const requestCreateParameters = {
      requestInfo: {
        
        // The currency in which the request is denominated
        currency: {
          type: Types.RequestLogic.CURRENCY.ERC20,
          value: '0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc',
          network,
        },
        
        // The expected amount as a string, in parsed units, respecting `decimals`
        // Consider using `parseUnits()` from ethers or viem
        expectedAmount: '1000000000000000000',
        
        // The payee identity. Not necessarily the same as the payment recipient.
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payeeIdentity,
        },
        
        // The payer identity. If omitted, any identity can pay the request.
        payer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payerIdentity,
        },
        
        // The request creation timestamp.
        timestamp: Utils.getCurrentTimestampInSecond(),
      },
      
      // The paymentNetwork is the method of payment and related details.
      paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentNetworkName: network,
          paymentAddress: payeeIdentity,
          feeAddress: feeRecipient,  
          feeAmount: '0',
        },
      },
      
      // The contentData can contain anything.
      // Consider using rnf_invoice format from @requestnetwork/data-format
      contentData: {
        reason: '🍕',
        dueDate: '2023.06.16',
      },
      
      // The identity that signs the request, either payee or payer identity.
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
    };

    console.log('got requestCreateParameters', requestCreateParameters)
  
    // @ts-ignore
    const request = await requestClient.createRequest(requestCreateParameters);
    console.log('got request', request)
    const confirmedRequestData = await request.waitForConfirmation();  
    console.log('got confirmedRequestData', confirmedRequestData)
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <AccountNavItem />

      <div>
        <button
          onClick={() => createRequest()}
          className="bg-gray-300 text-gray-900 hover:bg-gray-200 font-bold py-2 px-4 rounded-lg"
        >
          Create request
        </button>
      </div>

      <div></div>

      <div></div>

    </main>
  )
}
