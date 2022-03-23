import sobrePng from '../public/static/sobre.png';
import metamaskLogoPng from '../public/static/metamask_logo.png';
import presaleStyles from "../styles/Presale.module.css";
import Image from "next/image";
import Web3ContextProvider, { Web3Context } from '../providers/web3ContextProvider';
import React, { ChangeEvent, useContext, useState } from 'react';
import contractLocations from '../contracts/contractLocations.json';
import MyTokenAbi from '../contracts/abi/MyToken.abi.json';
import TetherUSDAbi from '../contracts/abi/TetherUSD.abi.json';

import { ButtonHTMLAttributes, DOMAttributes } from "react";

export interface HomeButtonProps {
    className?: string;
    type: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
    children: any;
    disabled?: boolean;
}
const BuyButton = (props: HomeButtonProps) => (
    <button
        type={props.type}
        onClick={props.onClick}
        disabled={!!props.disabled}
        className={`
            rounded border border-red-600
            bg-red-500 hover:bg-red-400
            transition-colors
            text-white
            font-semibold
            p-2
            w-50
            ${props.className || ''}
        `}
    >
        {props.children}
    </button>
);

interface ProgressBarProps {
    progress: number;
}
const ProgressBar = (props: ProgressBarProps) => {
    return (
        <div 
            className={`
                bg-white
                border
                border-[#790E17]
                rounded-xl
                h-4
            `}
        >
            <div
                style={{width: `${props.progress}%`}}
                className="h-full rounded-xl bg-[#790E17]"
            ></div>
        </div>
    )
}

interface PresaleFormProps {
    className?: string;
}
const PresaleForm = (props: PresaleFormProps) => {
    const [ quantity, setQuantity ] = useState(1);
    const { connected, connect, web3, address } = useContext(Web3Context);

    const price = 5;
    const currencySymbol = 'USDT';
    const remainingSupplyPercent = 78;
    const presaleProgressPercent = 100 - remainingSupplyPercent;
    const amount = quantity * price;

    async function callContract() {
        if (!connected) {
            return;
        }

        if (web3) {
            console.log({ address });
            // Reference: https://ethereum.stackexchange.com/a/93780
            const amount = 0;

            const usdtToken = new web3.eth.Contract(TetherUSDAbi as any, contractLocations.USDT);

            const myToken = new web3.eth.Contract(MyTokenAbi as any, contractLocations.MyToken);

            await usdtToken.methods
                .approve(contractLocations.MyToken, amount)
                .send({ from: address })
                .on('transactionHash', (hash: string) => {
                    alert('Wallet approved by USDT contract <br/> ' + hash);
                });

            const presaleParams = {
                account: address,
                id: 1,
                packAmount: 1,
                data: Buffer.from('meme'),
            }

            await myToken.methods.preSale(
                presaleParams.account,
                presaleParams.id,
                presaleParams.packAmount,
                presaleParams.data,
            )
            .send({ from: address, value: 1 })
            .on('receipt',  (receipt: any) => {
                console.log(receipt);

                const tokenTrackerUrl = `https://testnet.bscscan.com/token/${contractLocations.MyToken}?a=${address}`;

                alert('Token minted! check your transaction at: ' + tokenTrackerUrl);
            })
            .on('error', (error: any) => {
                console.error(error);
            });
            
            0x9bb489c9cf30e83b868d9c9ff189496b94777332
        }

    }

    function onChangeQuantity(e: ChangeEvent<HTMLInputElement>) {
        let value = parseInt(e.currentTarget.value) || 0;

        if (!value || isNaN(value) || value < 0) {
            value = 0;
        }

        setQuantity(value);

    }

    return (
        <div className={'text-center ' + props.className || ''}>
            <h1 className='text-4xl uppercase text-center'>First Presale</h1>
            
            <p>Supply Remaining: {remainingSupplyPercent}%</p>

            <ProgressBar progress={presaleProgressPercent} />

            <div className='text-left'>
                <h2 className='text-2xl uppercase'>
                    {price} {currencySymbol} each
                </h2>

                <p className='text-sm'>
                    In addition to the various NFTs, our ecosystem
                    will have a dynamic internal economy based on
                    the use of two internal tokens, DoD and DFK,
                    and one external token, USDT.
                </p>
            </div>



            <div className="flex items-center justify-center">
                <span className="flex-1 text-right">I Want</span>
                <input type="number" value={quantity} onChange={onChangeQuantity} className="w-32 mx-4 text-right border rounded p-2" />
                <span className="flex-1">Packs</span>
            </div>

            <div className="flex items-center justify-center">
                <span className="flex-1 text-right">Total</span>
                <input type="number" value={amount} className="w-32 mx-4 text-right border rounded p-2" readOnly />
                <span className="flex-1">{currencySymbol}</span>
            </div>

            <div>
                {connected ? ( 
                    <BuyButton type="button" className="w-28" onClick={callContract} disabled={amount <= 0}>
                        <div className="flex items-center justify-between">
                            <span>Buy now</span>
                            <Image alt="metamask_logo" src={metamaskLogoPng} width={20} height={20} />
                        </div>
                    </BuyButton>
                ) : (
                    <BuyButton type="button" className='w-28' onClick={connect}>
                        Connect
                    </BuyButton>
                )}
            </div>

            
        </div>
    );
}

const Presale = () => (
    <Web3ContextProvider>
        <div>Header</div>
        <div className='flex justify-between'>
            <div className="basis-1/2 bg-gray-100">               
                <div className="flex justify-center">
                    <div className={`${presaleStyles.sobre}`}>
                        <Image alt="pack" className="rotate-6" src={sobrePng} layout="intrinsic"/>
                    </div>
                </div>
            </div>

            <div className="p-10 basis-1/2 bg-yellow-100">
                <PresaleForm className="py-2" />
            </div>
        </div>
    </Web3ContextProvider>
)

export default Presale