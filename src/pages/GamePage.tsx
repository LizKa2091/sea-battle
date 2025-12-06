import { type FC } from 'react'
import Field from '../components/field/Field';
import { useGameStore } from '../store/useGameStore';

const GamePage: FC = () => {
   const { playerCells, enemyCells } = useGameStore();

   return (
      <>
         <Field cells={playerCells} user='player' /> 
         <Field cells={enemyCells} user='enemy' />
      </>
      
   )
}

export default GamePage;