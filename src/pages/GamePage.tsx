import { type FC } from 'react'

import Field from '../components/field/Field';
import Notifications from '../components/notifications/Notifications';
import { useGameStore } from '../store/useGameStore';


const GamePage: FC = () => {
   const { playerCells, enemyCells } = useGameStore();

   return (
      <div className='pageContainer'>
         <Notifications />
         <Field cells={playerCells} user='player' /> 
         <Field cells={enemyCells} user='enemy' />
      </div>
   )
}

export default GamePage;