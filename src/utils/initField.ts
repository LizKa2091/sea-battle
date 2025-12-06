import type { ICellItem, FieldCells, User } from "../types/types";

const fieldSize: number = 10;

export const initField = (user: User): FieldCells => {
   const field: FieldCells = [];

   for (let i: number = 0; i<fieldSize; i++) {
      const row: ICellItem[] = [];

      for (let j: number = 0; j<fieldSize; j++) {
         row.push({
            id: String(i) + j + `-${user}`,
            hasShip: false,
            isDamaged: false,
            isSelected: false
         })
      }

      field.push(row);
   }

   return field;
}