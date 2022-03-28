export interface ProgressBarProps {
    progress: number;
    className?: string;
}
const ProgressBar = (props: ProgressBarProps) => {
    return (
        <div className={props.className}>
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
        </div>
    )
}

export default ProgressBar;