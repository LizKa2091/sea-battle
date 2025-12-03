import { type FC } from 'react';

import styles from './ShipCell.module.scss';

interface IShipCellProps {
   size: number;
}

const ShipCell: FC<IShipCellProps> = ({ size }) => {
   return (
      <div className={styles.shipItem}>
         {Array.from({ length: size }).map((_, index) => (
            <div key={index} className={styles.shipCell} />
         ))}
      </div>
   )

}

export default ShipCell;