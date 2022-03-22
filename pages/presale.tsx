import sobrePng from '../public/static/sobre.png';
import metamaskLogoPng from '../public/static/metamask_logo.png';
import presaleStyles from "../styles/Presale.module.css";
import Image from "next/image";
import { Web3Context } from '../providers/web3ContextProvider';
import React, { ChangeEvent, useContext, useState } from 'react';
import contractLocations from '../contracts/contractLocations.json';
import MyTokenAbi from '../contracts/abi/MyToken.abi.json';

import { ButtonHTMLAttributes, DOMAttributes } from "react";

export interface HomeButtonProps {
    className?: string;
    type: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
    children: any;
}
const BuyButton = (props: HomeButtonProps) => (
    <button
        type={props.type}
        onClick={props.onClick}
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
)

interface PresaleFormProps {
    className?: string;
}
const PresaleForm = (props: PresaleFormProps) => {
    const [ quantity, setQuantity ] = useState(1);
    const { connected, connect, web3, address } = useContext(Web3Context);

    const price = 5;
    const currency = 'BUSD';

    const getAmount = () => quantity * price

    async function callContract() {
        // console.log('sadress', _address);
        if (!connected) {
            return;
            
        }

        console.log({ web3 });

        if (web3) {
            const MyTokenContract = new web3.eth.Contract(MyTokenAbi as any, contractLocations.MyToken);

            // console.log(MyTokenContract);

            const precio = await  MyTokenContract.methods.precio().call();

            console.log('MyToken precio: ' + precio);
        }

        alert('Precio del token: ' + getAmount());
    }

    function onChangeQuantity(e: ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.currentTarget.value) || 0;
        console.log({ value });

        setQuantity(value);
    }

    return (
        <div className={"flex justify-center items-center " + props.className || ''}>
            <span>
                {getAmount()} {currency}
                <small> {currency} {price} each </small>
            </span>

            <input type="number" value={quantity} onChange={onChangeQuantity} className="w-16 mx-2 border rounded p-2" />

            {
                connected
                ? ( 
                    <BuyButton type="button" className="w-28 flex items-center justify-between" onClick={callContract}>
                        <span>Buy now</span>
                        <Image alt="metamask_logo" src={metamaskLogoPng} width={20} height={20} />
                    </BuyButton>
                ) : (
                    <BuyButton type="button" onClick={connect}>
                        Connect
                    </BuyButton>
                )
            }
        </div>
    );
}

const Presale = () => (
    <>
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
    </>
)

export default Presale