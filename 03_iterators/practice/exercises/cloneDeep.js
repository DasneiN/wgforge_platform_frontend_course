/**
 * Реализовать функцию cloneDeep которая копирует объекты по значению с любой глубиной вложенности
 */
export default function cloneDeep(obj, firstLaunch = true) {
  if (typeof obj === 'object' && !!obj) {
    const result = {};

    Object.keys(obj).forEach(key => {
      result[key] = cloneDeep(obj[key], false);
    });

    return result;
  }

  if (firstLaunch && obj === null) {
    throw new Error('Argument is null');
  }

  return obj;
}
