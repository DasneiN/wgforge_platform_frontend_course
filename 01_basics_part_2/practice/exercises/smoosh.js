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
  if (isArray(arr)) {
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
}

function squeeze(arr) {
  if (isArray(arr)) {
    function smooshInSqueeze(smooshArr) {
      let result = [];

      smooshArr.forEach(val => {
        if (Array.isArray(val)) {
          result = result.concat(smooshInSqueeze(val));
        } else {
          result.push(val);
        }
      });

      return result;
    }

    arr.forEach((val, index) => {
      if (Array.isArray(val)) {
        arr.splice(index, 1, ...smooshInSqueeze(val));
      }
    });

    return arr;
  }
}

function isArray(arr) {
  if (arr instanceof Array) return true;

  throw new Error('argument should be an array');
}

export { smoosh, squeeze };
