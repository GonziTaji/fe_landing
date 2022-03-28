import styles from '../../styles/Presale.module.css';
import { ButtonHTMLAttributes, DOMAttributes, ReactNode } from "react";

export interface PresaleButton {
    className?: string;
    type: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
    children: ReactNode;
    disabled?: boolean;
}
const PresaleButton = (props: PresaleButton) => (
    <button
        type={props.type}
        onClick={props.onClick}
        disabled={!!props.disabled}
        className={`
            rounded
            bg-[#4B1713] hover:bg-[#5c1c18]
            transition-colors
            text-white
            font-semibold
            p-2
            w-50
            ${styles.btnMint}
            ${props.className || ''}
        `}
    >
        {props.children}
    </button>
);

export default PresaleButton;