import { type FC } from 'react';

import ShipCell from '../ship-cell/ShipCell';
import { shipsConfig } from '../../utils/initShips';
import { useCellsStore } from '../../store/useCellsStore';
import type { ShipType } from '../../types/types';

import styles from './ShipsField.module.scss';

const ShipsField: FC = () => {
   const { ships } = useCellsStore();

   const shipsTrack: Record<ShipType, number> = {
      single: ships.filter((ship) => ship.type === 'single' && ship.state === 'ready').length,
      duo: ships.filter((ship) => ship.type === 'duo' && ship.state === 'ready').length,
      trio: ships.filter((ship) => ship.type === 'trio' && ship.state === 'ready').length,
      quadro: ships.filter((ship) => ship.type === 'quadro' && ship.state === 'ready').length,
   }

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