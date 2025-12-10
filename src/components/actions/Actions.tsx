import { useEffect, useState, type FC } from 'react'
import ActionButton from '../action-button/ActionButton';
import { useGameStore } from '../../store/useGameStore';
import { useSelectedCells } from '../../hooks/useSelectedCells';
import { useDamageRandomCell } from '../../hooks/useDamageRandomCell';
import { usePlaceRandomShips } from '../../hooks/usePlaceRandomShips';
import type { User } from '../../types/types';

import styles from './Actions.module.scss';

interface IUserActions {
   user: User;
}

const Actions: FC<IUserActions> = ({ user }) => {
   const { damageCell, placeShip, resetGame, gameStatus } = useGameStore();
   const { damageRandomCell } = useDamageRandomCell();
   const { placeRandomShips } = usePlaceRandomShips();
   const selectedCells = useSelectedCells(gameStatus);

   const [isEnemyTurn, setIsEnemyTurn] = useState<boolean>(false);
   const [isEnemyReady, setIsEnemyReady] = useState<boolean>(true);

   useEffect(() => {
      let timer: ReturnType<typeof setTimeout>;

      if (isEnemyTurn) {
         timer = setTimeout(() => {
            damageRandomCell();

            setIsEnemyTurn(false);
            setIsEnemyReady(true);
         }, 3000)
      }

      return () => {
         if (timer) clearTimeout(timer);
      }
   }, [isEnemyTurn, damageRandomCell]);

   if (!selectedCells.length) {
      return null;
   }

   const selectedCellsIds = selectedCells.map((cell) => cell.id);

   const handleDamageCell = () => {
      damageCell(selectedCells[0].id);
      setIsEnemyTurn(true);
      setIsEnemyReady(false);
   }

   const handleRestartGame = () => {
      resetGame();
      placeRandomShips();
   }

   const renderButtons = () => {
      if (user === 'player' && gameStatus === 'placement') {
         return <ActionButton text='Разместить корабль' onClick={() => placeShip(selectedCellsIds)} />
      }
      else if (user === 'enemy' && gameStatus === 'in progress') {
         return (
            <>
               <ActionButton 
                  text='Атаковать' 
                  onClick={handleDamageCell} 
                  disabled={!isEnemyReady}
               />
               <ActionButton 
                  text='Начать игру заново' 
                  onClick={handleRestartGame} 
               />
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