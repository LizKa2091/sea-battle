import { type FC } from 'react';

import styles from './ActionButton.module.scss';

interface IActionButtonProps {
   text: string;
   onClick: () => void;
   disabled?: boolean;
}

const ActionButton: FC<IActionButtonProps> = ({ text, onClick, disabled }) => {
   return (
      <button 
         onClick={onClick} 
         disabled={disabled}
         className={styles.button}
      >
         {text}
      </button>
   )
}

export default ActionButton;