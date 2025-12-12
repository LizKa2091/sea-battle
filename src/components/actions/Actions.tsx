import { useEffect, type FC } from 'react'
import ActionButton from '../action-button/ActionButton';
import { useGameStore } from '../../store/useGameStore';
import { useSelectedCells } from '../../hooks/useSelectedCells';
import { useDamageRandomCell } from '../../hooks/useDamageRandomCell';
import type { User } from '../../types/types';

import styles from './Actions.module.scss';

interface IUserActions {
   user: User;
}

const Actions: FC<IUserActions> = ({ user }) => {
   const { damageCell, placeShip, currTurn, gameStatus } = useGameStore();
   const { damageRandomCell } = useDamageRandomCell();
   const selectedCells = useSelectedCells(gameStatus);

   useEffect(() => {
      let timer: ReturnType<typeof setTimeout>;

      if (currTurn === 'enemy') {
         timer = setTimeout(() => {
            damageRandomCell();
         }, 3000)
      }

      return () => {
         if (timer) clearTimeout(timer);
      }
   }, [currTurn, damageRandomCell]);

   if (!selectedCells.length) {
      return null;
   }

   const selectedCellsIds = selectedCells.map((cell) => cell.id);

   const handleDamageCell = () => {
      damageCell(selectedCells[0].id);
   }

   const renderButtons = () => {
      if (user === 'player' && gameStatus === 'placement') {
         return <ActionButton text='Разместить корабль' onClick={() => placeShip(selectedCellsIds)} />
      }
      else if (user === 'enemy' && gameStatus === 'in progress') {
         return (
            <ActionButton 
               text='Атаковать' 
               onClick={handleDamageCell} 
               disabled={currTurn === 'enemy'}
            />
         )
      }
   }

   return (
      <div className={styles.actionsContainer}>
         {renderButtons()}
      </div>
   )
}

export default Actions;