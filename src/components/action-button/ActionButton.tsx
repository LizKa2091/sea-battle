import { type FC } from 'react'

interface IActionButtonProps {
   text: string;
   onClick: () => void;
}

const ActionButton: FC<IActionButtonProps> = ({ text, onClick }) => {
   return (
      <button onClick={onClick}>{text}</button>
   )
}

export default ActionButton;