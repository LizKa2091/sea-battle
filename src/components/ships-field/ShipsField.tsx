import { type FC } from 'react';

import ShipCell from '../ship-cell/ShipCell';
import { shipsConfig } from '../../utils/initShips';
import { useShipsTrack } from '../../hooks/useShipsTrack';
import { useGameStore } from '../../store/useGameStore';
import type { ShipType, User } from '../../types/types';

import styles from './ShipsField.module.scss';

interface IShipsFieldProps {
   user: User;
}

const ShipsField: FC<IShipsFieldProps> = ({ user }) => {
   const { gameStatus } = useGameStore();
   const shipsTrack = useShipsTrack(gameStatus);

   if (gameStatus === 'placement' && user === 'enemy' 
      || gameStatus === 'in progress' && user === 'player'
   ) {
      return null;
   }

   return (
      <div className={styles.field}>
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