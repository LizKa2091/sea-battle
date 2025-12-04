import { type FC } from 'react'
import ActionButton from '../action-button/ActionButton';
import { useCellsStore } from '../../store/useCellsStore';
import { useSelectedCells } from '../../hooks/useSelectedCells';

import styles from './Actions.module.scss';

const Actions: FC = () => {
   const { damageCell, placeShip } = useCellsStore();
   const selectedCells = useSelectedCells();

   if (!selectedCells.length) {
      return null;
   }

   const selectedCellsIds = selectedCells.map((cell) => cell.id);

   return (
      <div className={styles.actionsContainer}>
         <ActionButton text='Атаковать' onClick={() => damageCell(selectedCells[0].id)} />
         <ActionButton text='Разместить корабль' onClick={() => placeShip(selectedCellsIds)} />
      </div>
   )
}

export default Actions
