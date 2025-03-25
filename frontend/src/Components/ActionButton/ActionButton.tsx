import "./ActionButton.css";
import { ActionButtonProps } from "../../interfaces/PropInterfaces";


function ActionButton({clickFunction, prompt}: ActionButtonProps) {
    return(
        <button className="action-btn" onClick={clickFunction}>{prompt}</button>
    )
}

export default ActionButton;