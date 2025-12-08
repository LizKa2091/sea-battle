import { type FC } from 'react';

import ShipCell from '../ship-cell/ShipCell';
import { shipsConfig } from '../../utils/initShips';
import { useShipsTrack } from '../../hooks/useShipsTrack';
import type { ShipType } from '../../types/types';

import styles from './ShipsField.module.scss';
import { useGameStore } from '../../store/useGameStore';

const ShipsField: FC = () => {
   const { gameStatus } = useGameStore();
   const shipsTrack = useShipsTrack(gameStatus);

   return (
      <div className={styles.field}>
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