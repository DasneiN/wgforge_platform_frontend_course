/**
 * Задание: написать функцию sleep, которая приостанавливает работу потока на
 * время переданное в аргументе. Время задаётся в секундах с точностью до 1 сек.
 * Если передан не валидный аргумент функция должна сразу завершить своё
 * выполнение и вернуть undefined.
 */

export default function sleep(sec) {
  if (Number.isInteger(sec)) {
    const currentTime = new Date().getTime();
    while (currentTime + sec * 1000 >= new Date().getTime()) {}
  }
}
