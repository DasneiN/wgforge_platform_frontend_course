/**
 * Реализовать функцию deepCopy которая копирует объекты по значению с любой глубиной вложенности
 */
export default function cloneDeep(obj) {
  if (typeof obj === 'object' && !!obj) {
    const result = {};

    for (let key in obj) {
      result[key] = cloneDeep(obj[key]);
    }

    return result;
  }

  return obj;
}
