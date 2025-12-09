export const getRandomCellId = (idsList: string[]): number | null => {
   const splittedIdsList = idsList;

   if (idsList.length) {
      return Math.floor(Math.random() * splittedIdsList.length);
   }

   return null;
}