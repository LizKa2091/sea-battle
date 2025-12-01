import { type FC } from 'react'
import ActionButton from '../action-button/ActionButton';
import { useCellsStore } from '../../store/useCellsStore';

import styles from './Actions.module.scss';
import { useSelectedCell } from '../../hooks/useSelectedCell';

const Actions: FC = () => {
   const { damageShip } = useCellsStore();
   const selectedCell = useSelectedCell();

   if (!selectedCell) {
      return null;
   }

   return (
      <div className={styles.actionsContainer}>
         <ActionButton text='Атаковать' onClick={() => damageShip(selectedCell.id)} />
      </div>
   )
}

export default Actions
