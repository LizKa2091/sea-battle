import type { IShipItem, ShipType, User } from "../types/types"

export const shipsConfig: Record<ShipType, { amount: number, size: number }> = {
   'single': { amount: 4, size: 1 },
   'duo': { amount: 3, size: 2 },
   'trio': { amount: 2, size: 3 },
   'quadro': { amount: 1, size: 4 }
}

export const initShips = (user: User): IShipItem[] => {
   const ships: IShipItem[] = []
   let shipCounter = 1;

   for (const shipType in shipsConfig) {
      const { amount, size } = shipsConfig[shipType as ShipType];

      for (let i: number = 0; i<amount; i++) {
         ships.push({
            id: `${shipCounter++}-${user}`,
            state: 'ready',
            size,
            type: shipType as ShipType,
            takenCellIds: []
         })
      }
   }

   return ships;
}