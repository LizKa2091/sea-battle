import { type FC } from 'react';
import { Link } from 'react-router-dom';

import ActionButton from '../action-button/ActionButton';
import { useGameStore } from '../../store/useGameStore';
import { usePlaceRandomShips } from '../../hooks/usePlaceRandomShips';

import styles from './Menu.module.scss';

const Menu: FC = () => {
   const { setPlacementStatus } = useGameStore();
   const { placeRandomShips } = usePlaceRandomShips();

   const handleStartGame = () => {
      setPlacementStatus();
      placeRandomShips();
   }

   return (
      <div className={styles.container}>
         <h1>Добро пожаловать в морской бой!</h1>
         <Link state={{ modal: true }} to='/game'>
            <ActionButton text='Начать игру' onClick={handleStartGame} />
         </Link>
      </div>
   )
}

export default Menu;