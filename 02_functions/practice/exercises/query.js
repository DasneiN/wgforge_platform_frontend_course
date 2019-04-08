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
  return new function() {
    const request = {
      tableName: typeof args[0] === 'string' ? args[0] : undefined,
      escapeNames: typeof args[0] === 'object' ? args[0].escapeNames : false
    };

    if (args.length > 1) {
      request.escapeNames = args[1].escapeNames;
    }

    this.select = function(...entries) {
      if (request.escapeNames) {
        request.entries = entries.length > 0 ? entries.map(v => `"${v}"`).join(', ') : '*';
      } else {
        request.entries = entries.length > 0 ? entries.join(', ') : '*';
      }
      return this;
    };

    this.from = function(tableName) {
      if (request.escapeNames) {
        request.tableName = `${request.tableName || tableName}`;
      } else {
        request.tableName = `${request.tableName || tableName}`;
      }
      return this;
    };

    this.where = function(parameter, addOR = false) {
      const parent = this;
      let isNotActive = false;

      if (request.where) {
        request.where += ` ${addOR ? 'OR' : 'AND'} `;
      } else {
        request.where = '';
      }

      return new function() {
        const escapeCharacters = function(value) {
          return typeof value === 'string' ? `'${value}'` : value;
        };

        this.equals = function(value) {
          const addNot = isNotActive ? 'NOT ' : '';
          isNotActive = false;

          request.where += `${addNot + parameter} = ${escapeCharacters(value)}`;
          return parent;
        };

        this.in = function(values) {
          const operator = isNotActive ? 'NOT IN' : 'IN';
          request.where += `${parameter} ${operator} (${values
            .map(v => escapeCharacters(v))
            .join(', ')})`;
          isNotActive = false;

          return parent;
        };

        this.gt = function(value) {
          const addNot = isNotActive ? 'NOT ' : '';
          isNotActive = false;

          request.where += `${addNot + parameter} > ${escapeCharacters(value)}`;
          return parent;
        };

        this.gte = function(value) {
          const addNot = isNotActive ? 'NOT ' : '';
          isNotActive = false;

          request.where += `${addNot + parameter} >= ${escapeCharacters(value)}`;
          return parent;
        };

        this.lt = function(value) {
          const addNot = isNotActive ? 'NOT ' : '';
          isNotActive = false;

          request.where += `${addNot + parameter} < ${escapeCharacters(value)}`;
          return parent;
        };

        this.lte = function(value) {
          const addNot = isNotActive ? 'NOT ' : '';
          isNotActive = false;

          request.where += `${addNot + parameter} <= ${escapeCharacters(value)}`;
          return parent;
        };

        this.between = function(startValue, endValue) {
          const addNot = isNotActive ? 'NOT ' : '';
          isNotActive = false;

          request.where += `${addNot + parameter} BETWEEN ${startValue} AND ${endValue}`;
          return parent;
        };

        this.isNull = function() {
          const operator = isNotActive ? 'IS NOT NULL' : 'IS NULL';
          isNotActive = false;

          request.where += `${parameter} ${operator}`;
          return parent;
        };

        this.not = function() {
          if (isNotActive) {
            throw new Error("not() can't be called multiple times in a row !");
          }

          isNotActive = true;
          return this;
        };
      }();
    };

    this.orWhere = function(parameter) {
      return this.where(parameter, true);
    };

    this.toString = function() {
      let fullQuery = `SELECT ${request.entries} `;

      if (request.escapeNames) {
        fullQuery += `FROM "${request.tableName}"`;
      } else {
        fullQuery += `FROM ${request.tableName}`;
      }

      if (request.where) {
        if (request.escapeNames) {
          request.where = request.where.replace("'", '"');
        }
        fullQuery += ` WHERE ${request.where}`;
      }

      return `${fullQuery};`;
    };
  }();
}