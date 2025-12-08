import { type FC } from 'react'
import ActionButton from '../action-button/ActionButton';
import { useGameStore } from '../../store/useGameStore';
import { useSelectedCells } from '../../hooks/useSelectedCells';
import type { User } from '../../types/types';

import styles from './Actions.module.scss';

interface IUserActions {
   user: User;
}

const Actions: FC<IUserActions> = ({ user }) => {
   const { damageCell, placeShip, resetGame, gameStatus } = useGameStore();
   const selectedCells = useSelectedCells(gameStatus);

   if (!selectedCells.length) {
      return null;
   }

   const selectedCellsIds = selectedCells.map((cell) => cell.id);

   const renderButtons = () => {
      if (user === 'player' && gameStatus === 'placement') {
         return <ActionButton text='Разместить корабль' onClick={() => placeShip(selectedCellsIds)} />
      }
      else if (user === 'enemy' && gameStatus === 'in progress') {
         return (
            <>
               <ActionButton text='Атаковать' onClick={() => damageCell(selectedCells[0].id)} />
               <ActionButton text='Начать игру заново' onClick={resetGame} />
            </>
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