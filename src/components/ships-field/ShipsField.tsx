import { useMemo, type FC } from 'react';
import clsx from 'clsx';

import ShipCell from '../ship-cell/ShipCell';
import ActionButton from '../action-button/ActionButton';
import { shipsConfig } from '../../utils/initShips';
import { useShipsTrack } from '../../hooks/useShipsTrack';
import { useGameStore } from '../../store/useGameStore';
import type { ShipType, User } from '../../types/types';

import styles from './ShipsField.module.scss';

interface IShipsFieldProps {
   user: User;
}

const ShipsField: FC<IShipsFieldProps> = ({ user }) => {
   const { gameStatus, currTurn, setInProgressStatus } = useGameStore();
   const shipsTrack = useShipsTrack(gameStatus);
   const isPlayersTurn: boolean = !!(currTurn === 'player');

   const areAllShipsPlaced = useMemo(() => {
      if (gameStatus === 'placement' && user === 'player') {
         return (
            shipsTrack.single === 0 && 
            shipsTrack.duo === 0 && 
            shipsTrack.trio === 0 && 
            shipsTrack.quadro === 0
         )
      }

      return false;
   }, [shipsTrack.single, shipsTrack.duo, shipsTrack.trio, shipsTrack.quadro, gameStatus, user])

   if (gameStatus === 'placement' && user === 'enemy' 
      || gameStatus === 'in progress' && user === 'player'
   ) {
      return null;
   }

   if (areAllShipsPlaced) {
      return (
         <div className={styles.field}>
            <p>Все корабли расставлены, вы готовы начать игру?</p>
            <ActionButton text='Начать' onClick={setInProgressStatus} />
         </div>
      )
   }

   return (
      <div className={styles.field}>
         <p className={clsx(styles.turnInfo, isPlayersTurn && styles.player)}>
            {isPlayersTurn ? 'Вы ходите' : 'Ход врага'}
         </p>
         {gameStatus === 'placement' ? 'Осталось расставить' : 'Осталось уничтожить'}
         {Object.entries(shipsTrack).map(([type, amount]) => {
            const typed = type as ShipType;
            const size = shipsConfig[typed].size;

            return (
               <div key={type} className={styles.shipTypeGroup}>
                  Кораблей {type}: {amount}
                  <div className={styles.shipTypeShips}>
                     {Array.from({ length: amount }).map((_, index) => (
                        <ShipCell
                           key={`${type}-${index}`}
                           size={size}
                        />
                     ))}
                  </div>
               </div>
            );
         })}
      </div>
   )
}

export default ShipsField;