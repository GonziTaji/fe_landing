import sobrePng from '../public/static/sobre.png';
import shurikenPng from '../public/static/shuriken.png';
import metamaskLogoPng from '../public/static/metamask_logo.png';
import styles from "../styles/Presale.module.css";
import Image from "next/image";
import Web3ContextProvider, { Web3Context } from '../providers/web3ContextProvider';
import React, { ChangeEvent, ReactNode, useContext, useState } from 'react';
import contractLocations from '../contracts/contractLocations.json';
import MyTokenAbi from '../contracts/abi/MyToken.abi.json';
import TetherUSDAbi from '../contracts/abi/TetherUSD.abi.json';
import cssVariables from '../styles/variables.module.css';

import { ButtonHTMLAttributes, DOMAttributes } from "react";
import Link from 'next/link';
import { Modal } from '../components/modal.component';
import ProgressBar from '../components/presale/presaleProgressBar.component';
import PresaleButton from '../components/presale/presaleButton.component';




const Separator = ({ className }: { className?: string }) => (
    <hr className={`${className} border border-black`} />
);

const Spinner = () => (
    <div className="flex justify-center items-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            {/* <span className="visually-hidden">Loading...</span> */}
        </div>
    </div>
)

interface PresaleFormProps {
    className?: string;
}
const PresaleForm = (props: PresaleFormProps) => {
    const [ quantity, setQuantity ] = useState(1);
    const [ modalMessage, setModalMessage] = useState('');
    const [ showModal, setShowModal] = useState(false);
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
            setModalMessage('Connecting with USDT contract');
            setShowModal(true);
            console.log({ address });
            // Reference: https://ethereum.stackexchange.com/a/93780
            const amount = 0;

            const usdtToken = new web3.eth.Contract(TetherUSDAbi as any, contractLocations.USDT);

            const myToken = new web3.eth.Contract(MyTokenAbi as any, contractLocations.MyToken);

            await usdtToken.methods
                .approve(contractLocations.MyToken, amount)
                .send({ from: address })
                .on('transactionHash', (hash: string) => {
                    setModalMessage('Wallet approved by USDT contract \n ' + hash + '\n Minting...');
                })
                .on('error', (error: any) => {
                    console.error(error);
    
                    setModalMessage('Something happened approving the token: ' + error.message);
                });

            const presaleParams = {
                account: address,
                id: 3,
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

                setModalMessage('Token minted! check your transaction at: ' + tokenTrackerUrl)
            })
            .on('error', (error: any) => {
                console.error(error);

                setModalMessage('Something happened minting the token: ' + error.message);
            });
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
            <h1 className={`
                text-6xl
                uppercase
                text-center
                text-[#451411]
                ${cssVariables.fontLinuxLibertine}
            `}>
                First Presale
            </h1>
            
            <p className='py-4 text-2xl'>Supply Remaining: {remainingSupplyPercent}%</p>

            <ProgressBar progress={presaleProgressPercent} className="pb-4" />

            <div className='text-left text-[#451411]'>
                <h2 className={`
                    text-4xl
                    uppercase
                    ${cssVariables.fontLinuxLibertine}
                `}>
                    {price} {currencySymbol} each
                </h2>

                <br />

                <p className='text-sm'>
                    In addition to the various NFTs, our ecosystem
                    will have a dynamic internal economy based on
                    the use of two internal tokens, DoD and DFK,
                    and one external token, USDT.
                </p>
            </div>

            <Separator className="my-10" />

            <div className='text-[#451411] text-xl'>
                <div className="flex items-center justify-center font-black text-4xl italic">
                    <span className="flex-1 text-right">I Want</span>
                    <input
                        type="number"
                        value={quantity}
                        onChange={onChangeQuantity}
                        className="w-32 text-2xl mx-4 text-right border rounded"
                    />
                    <span className="flex-1 text-left">Packs</span>
                </div>

                <br />

                <div className="flex items-center justify-center font-black text-4xl italic">
                    <span className="flex-1 text-right">Total</span>
                    <input
                        type="number"
                        value={amount}
                        className="w-32 text-2xl mx-4 text-right border rounded" readOnly
                    />
                    <span className="flex-1 text-left">{currencySymbol}</span>
                </div>
            </div>

            <br />

            {connected ? (
                <>
                    <PresaleButton type="button" className="w-32" onClick={callContract} disabled={amount <= 0}>
                        <div className="flex items-center justify-between">
                            <span>MINT NOW</span>
                            <Image alt="metamask_logo" src={metamaskLogoPng} width={20} height={20} />
                        </div>
                    </PresaleButton>

                    <small className='mt-10 block font-bold text-small text-center italic text-[#00000040]'>
                        Connected: { address }
                    </small>

                    <Separator className="mb-4" />
                </>
            ) : (
                <>
                    <PresaleButton type="button" className='w-28 font-bold italic' onClick={connect}>
                        CONNECT
                    </PresaleButton>

                    <Separator className="mt-10 mb-4" />
                </>
            )}

            <p className='text-left'>
                Want to know more about our presale process?
                <Link href={'#'}>
                    <span className="text-[#008D82] cursor-pointer hover:underline">click here </span>
                </Link>
            </p>

            <Modal show={showModal}>
                <div className="p-4 text-center">
                    <p className='text-xl'>{modalMessage} {/Token minted/.test(modalMessage)}</p>
                    { (/Token minted/.test(modalMessage) || /Something happened/.test(modalMessage))
                        ? <button className="m-4 p-2 bg-[#5C1C18] rounded text-white w-20 " onClick={setShowModal.bind(this, false)}>
                            Close
                        </button>
                        : <Spinner />
                    }
                </div>
            </Modal>
        </div>
    );
}

const Presale = () => (
    <div className='bg-[#F4EDDB] h-screen flex flex-col'>
        <div className="bg-white p-0">
            <div className='flex justify-between'>
                <span>Fragmented Spells</span>
                <div>
                    <span>[DISCORD]</span>
                    <span>[TWITTER]</span>
                </div>
            </div>
        </div>

        <div className='flex justify-center gap-10'>
            { [0,0,0,0,0].map(() => (
                <div className="pt-2">
                    <Image width={40} height={40} alt="shuriken" src={shurikenPng} layout="intrinsic" />
                </div>
            ))}
        </div>

        <div
            style={{ maxWidth: '80rem' }}
            className='flex-1 flex justify-between p-10 mx-auto'
        >
            <div className="flex-1 h-full w-full flex items-center">
                <div className={`${styles.sobre}`}>
                    <Image alt="pack" className="" src={sobrePng} layout="intrinsic" />
                </div>
            </div>

            <div className="flex-1 p-10">
                <Web3ContextProvider>
                    <PresaleForm
                        className={`
                            h-full
                            p-10
                            rounded-xl
                            bg-[#00000020]
                        `}
                    />
                </Web3ContextProvider>
            </div>
        </div>
    </div>
)

export default Presale