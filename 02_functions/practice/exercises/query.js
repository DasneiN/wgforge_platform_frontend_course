/* eslint-disable consistent-this */
/* eslint-disable quotes */
/**
 * Задание: написать построитель SQL-запросов.
 * Данный модуль должен экспортировать функцию `query`, вызов которой должен возвращать новый экземпляр объекта query.
 * Например:
 * const q1 = query();
 * const q2 = query();
 * console.log(Object.is(q1, q2)) // false
 *
 * В качестве аргументов query может передаваться имя таблицы.
 * Тогда при дальнейшем составлении запроса вызовы метода from(tableName) игнорируются.
 *
 * У возвращаемого объекта должны быть следующие методы:
 *
 * select(arg1, arg2 ... argN) - может принимать список полей для выборки.
 * Аргументы должны иметь тип String. Если ни одного аргумента не передано должны быть получены все поля таблицы
 * Например:
 * q.select().from('users')
 * > SELECT * FROM users
 * q.select('id', 'name').from('users')
 * > SELECT id, name FROM users
 *
 * from(tableName: String) - указывает из какой таблицы получать данные.
 *
 * where(fieldName: String) - служит для задания условия фильтрации.
 * При множественном вызове метода where в одном запросе условия должны объединяться через логическое "И".
 * Метод where должен возвращать объект имеющий следующие методы:
 * orWhere(fieldName: String) - делает то же самое что where, но объединяет через "ИЛИ".
 * Метод where должен возвращать объект имеющий следующие методы:
 *
 * equals(value: any) - условие равенства
 * Например: SELECT * FROM student WHERE age = 42;
 *
 * in(values: array) - позволяет определить, совпадает ли значение объекта со значением в списке
 * Например: SELECT * FROM offices WHERE city IN ('Minsk', 'Nicosia', 'Seattle');
 *
 * gt(value: any) - условие больше '>'
 * gte(value: any) - условие больше или равно '>='
 * lt(value: any) -  условие меньше '<'
 * lte(value: any) -  условие меньше или равно '<='
 * between(from: any, to: any) -  условие нахождения значения поля в заданном диапазоне:
 * SELECT * FROM products WHERE price BETWEEN 4.95 AND 9.95;
 *
 * isNull() - условие отсутствия значения у поля
 *
 * not() - служит для задания противоположного.
 * После вызова not можно вызывать только те же методы, которые использует where для сравнения.
 *
 * q.select().from('users').where('name').not().equals('Vasya')
 *
 * Вызов not не может быть вызван более одного раза подряд:
 * q.select().from('users').where('name').not().not().equals('Vasya')
 *
 * Внимание: методы сравнения не могут быть вызваны до вызова метода where()!
 *
 * Получения строчного представления сконструированного SQL-запроса должно происходить при
 * вызове метода toString() у объекта query.
 * В конце строки SQL-запроса должен быть символ ';'
 *
 * Дополнительные задания:
 *
 * 1. Добавить в сигнатуру функии query второй опциональный аргумент options типа Object.
 * Если в options есть поле escapeNames со значением true, названия полей и таблиц должны быть обёрнуты в двойные кавычки:
 *
 * const q = query({escapeNames: true});
 * q.select('name').from('people').toString()
 * > SELECT "name" FROM "people";

 * const q = query('books', {escapeNames: true});
 * q.select('title').toString()
 * > SELECT "title" FROM "books";
 *
 * 2. Добавить возможность передавать в условия методов сравнения в качестве значения экземпляр запроса query.
 *
 * const q1 = query('users');
 * const admins = q1.select('id').where('role').equals('admin');
 * const q2 = query('posts');
 * const posts = q2.select().where('author_id').in(admins);
 * posts.toString();
 * > SELECT * FROM posts WHERE author_id IN (SELECT id FROM users WHERE role = 'admin');
 *
 * 3. Реализовать функциональность создания INSERT и DELETE запросов. Написать для них тесты.
 */

export default function query(...args) {
  class Query {
    constructor() {
      const request = {
        quotes: '',
        fields: '*',
        from: typeof args[0] === 'string' ? args[0] : undefined,
        where: []
      };
      if (
        (typeof args[0] === 'object' && args[0].escapeNames) ||
        (args.length > 1 && args[1].escapeNames)
      ) {
        request.quotes = '"';
      }
      const isString = function(str) {
        if (typeof str !== 'string') {
          throw new Error('Argument must be String');
        }
      };
      this.select = function(...fields) {
        request.fields =
          fields.length > 0
            ? fields
                .map(field => {
                  isString(field);
                  return `${request.quotes + field + request.quotes}`;
                })
                .join(', ')
            : '*';
        return this;
      };
      this.from = function(tableName) {
        isString(tableName);
        request.from = `${request.from || tableName}`;
        return this;
      };
      this.where = function(field, addOR = false) {
        const where = this;
        class Where {
          constructor() {
            isString(field);
            let isNotActive = false;
            const newWhere = {
              or: addOR
            };
            const escapeCharacters = function(value) {
              if (typeof value === 'string') {
                const quotes = request.quotes || "'";
                return `${quotes + value + quotes}`;
              }
              return value;
            };
            const generateNewWhereStatement = function(value, operator) {
              const addNot = isNotActive ? 'NOT ' : '';
              isNotActive = false;
              if (typeof value === 'object') {
                newWhere.request = `${addNot + field} ${operator}`;
              }
              newWhere.request = `${addNot + field} ${operator} ${escapeCharacters(value)}`;
              request.where.push(newWhere);
            };
            this.equals = function(value) {
              generateNewWhereStatement(value, '=');
              return where;
            };
            this.in = function(values) {
              if (Array.isArray(values)) {
                const operator = isNotActive ? 'NOT IN' : 'IN';
                newWhere.request = `${field} ${operator} (${values
                  .map(v => escapeCharacters(v))
                  .join(', ')})`;
                request.where.push(newWhere);
                isNotActive = false;
              } else if (typeof values === 'object') {
                const operator = isNotActive ? 'NOT IN' : 'IN';
                newWhere.request = `${field} ${operator}(${values.toString().slice(0, -1)})`;
                request.where.push(newWhere);
                isNotActive = false;
              } else {
                throw new Error('Incorrect argument!');
              }
              return where;
            };
            this.gt = function(value) {
              generateNewWhereStatement(value, '>');
              return where;
            };
            this.gte = function(value) {
              generateNewWhereStatement(value, '>=');
              return where;
            };
            this.lt = function(value) {
              generateNewWhereStatement(value, '<');
              return where;
            };
            this.lte = function(value) {
              generateNewWhereStatement(value, '<=');
              return where;
            };
            this.between = function(startValue, endValue) {
              const addNot = isNotActive ? 'NOT ' : '';
              isNotActive = false;
              newWhere.request = `${addNot + field} BETWEEN ${startValue} AND ${endValue}`;
              request.where.push(newWhere);
              return where;
            };
            this.isNull = function() {
              const operator = isNotActive ? 'IS NOT NULL' : 'IS NULL';
              isNotActive = false;
              newWhere.request = `${field} ${operator}`;
              request.where.push(newWhere);
              return where;
            };
            this.not = function() {
              if (isNotActive) {
                throw new Error('not() can not be called multiple times in a row!');
              }
              isNotActive = true;
              return this;
            };
          }
        }
        return new Where(field, addOR);
      };
      this.orWhere = function(field) {
        return this.where(field, true);
      };
      this.toString = function() {
        let fullQuery = `SELECT ${request.fields} FROM ${request.quotes +
          request.from +
          request.quotes}`;
        if (request.where.length) {
          request.where.forEach((addWhere, index) => {
            if (index > 0) {
              fullQuery += `${addWhere.or ? ' OR' : ' AND'}`;
            } else {
              fullQuery += ' WHERE';
            }
            fullQuery += ` ${addWhere.request}`;
          });
        }
        return `${fullQuery};`;
      };
    }
  }

  return new Query(args);
}
