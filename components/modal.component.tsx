export interface ModalProps {
    show: boolean;
    onHide?: () => void;
    children?: React.ReactNode
}

export const Modal = (props: ModalProps) => {
    return (
        <div className={`
            fixed
            z-10
            inset-0
            overflow-y-auto
            ${!props.show && 'hidden'}
        `}
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="
                items-end
                justify-center
                min-h-screen
                pt-4
                px-4
                pb-20
                text-center
                sm:block
                sm:p-0"
            >
                <div
                    className={`
                        fixed
                        inset-0
                        bg-gray-500
                        bg-opacity-75
                        transition-opacity
                        ${!props.show && 'opacity-0'}
                    `}
                    aria-hidden="true"></div>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                    className="
                        hidden
                        sm:inline-block
                        sm:align-middle
                        sm:h-screen
                    "
                    aria-hidden="true"
                >
                    &#8203;
                </span>

                <div className={`
                    inline-block
                    align-bottom
                    bg-white
                    rounded-sm
                    text-left
                    overflow-hidden
                    shadow-xl
                    transform
                    transition-all
                    sm:my-8
                    sm:align-middle
                    sm:max-w-lg
                    sm:w-full
                    ${!props.show && 'opacity-0'}
                `}
                >
                    {props.children}
                </div>
            </div>
        </div>
    )
}
