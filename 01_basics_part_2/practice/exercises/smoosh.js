/* eslint-disable func-style */
/**
 * Задача 1: написать функцию smoosh, которая принимает массив, "выравнивает" вложенные массивы
 * в одноуровневый массив и возвращает новый плоский массив.
 * Например:
 * smoosh([1, 2, [3, 4], 5])
 * > [1, 2, 3, 4, 5]
 * Входной массив может содержать массивы любого уровня вложенности.
 * Например: [[1, 2], [3, [4, [5]]]]
 *
 * Задача 2: написать функцию squeeze (по аналогии со smoosh) таким образом,
 * чтобы она модифицировала исходный массив, а не возвращала новый.
 *
 * Задача 3*: для функций smoosh и squeeze добавить валидацию входного параметра.
 * В случае, если на вход передан не массив функция должна выбросить исключение
 * с сообщением 'argument should be an array'.
 */

function smoosh(arr) {
  if (Array.isArray(arr)) {
    let result = [];

    arr.forEach(val => {
      if (Array.isArray(val)) {
        result = result.concat(smoosh(val));
      } else {
        result.push(val);
      }
    });

    return result;
  }

  throw new Error('argument should be an array');
}

function squeeze(arr) {
  if (Array.isArray(arr)) {
    arr.forEach((val, index) => {
      if (Array.isArray(val)) {
        arr.splice(index, 1, ...squeeze(arr[index]));
      }
    });

    return arr;
  }

  throw new Error('argument should be an array');
}

export { smoosh, squeeze };
