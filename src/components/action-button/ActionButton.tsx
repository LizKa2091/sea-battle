import { type FC } from 'react'

interface IActionButtonProps {
   text: string;
   onClick: () => void;
   disabled?: boolean;
}

const ActionButton: FC<IActionButtonProps> = ({ text, onClick, disabled }) => {
   return (
      <button onClick={onClick} disabled={disabled}>{text}</button>
   )
}

export default ActionButton;