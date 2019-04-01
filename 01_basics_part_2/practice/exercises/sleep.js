/**
 * Задание: написать функцию sleep, которая приостанавливает работу потока на
 * время переданное в аргументе. Время задаётся в секундах с точностью до 1 сек.
 * Если передан не валидный аргумент функция должна сразу завершить своё
 * выполнение и вернуть undefined.
 */

export default function sleep() {
  export default function sleep(sec) {
    const s = +sec;

    if (!isNaN(s) && typeof s === 'number' && s > 0 && s % 1 === 0) {
      const currentTime = new Date().getTime();
      while (currentTime + +sec * 1000 >= new Date().getTime()) { }
    } else {
      void 0;
    }
  }
}
