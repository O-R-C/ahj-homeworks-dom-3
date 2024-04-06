import * as styles from './MovieList.module.css'

/**
 * Список фильмов
 * @class
 */
export default class MovieList {
  /**
   *
   * @param {Array} data массив объектов, фильмов
   */
  constructor(data) {
    this.data = this.fixValues(data)
    this.body = document.body
    this.headers = ['id', 'title', 'year', 'imdb']
    this.headersRow = null

    this.init()
  }

  init() {
    this.createTable()
    this.showTable()
    this.showTitle()
    this.startSort()
  }

  /**
   * Создает список фильмов
   * @param {Array} data массив объектов, фильмов
   */
  createTable(data = this.data) {
    this.table?.remove()
    this.table = this.createElement(styles.table)
    this.table.append(this.headersRow ?? this.createHeadersRow())
    data.forEach((item) => this.table.append(this.createRow(item)))
  }

  /**
   * Создает объект из данных массива
   * @returns объект с заголовками таблицы
   */
  createHeadersData() {
    const headers = this.headers.reduce((acc, item) => {
      return { ...acc, [item]: item }
    }, {})
    return headers
  }

  /**
   * Создает строку заголовков таблицы
   * @returns строку заголовков таблицы
   */
  createHeadersRow() {
    const headersRow = this.createRow(this.createHeadersData())
    headersRow.classList.add(styles.headers)
    this.headersRow = headersRow

    return this.headersRow
  }

  /**
   * Создает строку таблицы
   * @param {object} movie объект, представляющий фильм
   * @returns строку таблицы
   */
  createRow(movie) {
    const row = this.createElement(styles.row)

    Object.keys(movie).forEach((item) => {
      let value = movie[item]
      row.append(this.addCell(item, value))
      return (row.dataset[item] = value)
    })

    return row
  }

  /**
   * Создает ячейку строки
   * @param {string} item свойство фильма
   * @param {string || number} value значение свойства
   * @returns ячейку строки
   */
  addCell(item, value) {
    if (typeof value === 'number') {
      if (item === 'year') {
        value = this.decorateYear(value)
      }
      if (item === 'imdb') {
        value = this.decorateImdb(value)
      }
    }

    const cell = this.createElement(styles.cell)
    cell.classList.add(styles[item])
    cell.textContent = value

    return cell
  }

  /**
   * Декорирует переданное значение
   * @param {number} year год производства фильма
   * @returns декорированное переданное значение
   */
  decorateYear(year) {
    return `(${year})`
  }

  /**
   * Декорирует переданное значение
   * @param {number} imdb рейтинг фильма
   * @returns декорированное переданное значение
   */
  decorateImdb(imdb) {
    return imdb.toFixed(2)
  }

  /**
   * Создает элемент
   * @param {string} className имя класса для присвоения создаваемому элементу
   * @param {string} type тип создаваемого элемента
   * @returns созданный элемент
   */
  createElement(className, type = 'div') {
    const elem = document.createElement(type)
    elem.classList.add(className)

    return elem
  }

  /**
   * Показывает элемент на странице
   */
  showTable() {
    this.body.append(this.table)
  }

  /**
   * Показывает заголовок на странице
   */
  showTitle() {
    document.querySelector('.welcome').textContent = 'Movie List'
    document.querySelector('title').textContent = 'Movie List'
  }

  /**
   * Преобразует тип значения элементов массива, согласно задания
   * @param {Array} table массив фильмов
   * @returns преобразованный массив фильмов
   */
  fixValues(table) {
    const fixTable = table.map((item) => {
      return {
        id: Number(item.id),
        title: item.title,
        year: Number(item.year),
        imdb: Number(item.imdb),
      }
    })
    return fixTable
  }

  /**
   * Старт сортировки таблицы
   */
  startSort() {
    const cellsHeaders = this.table.querySelectorAll(`.${styles.cell}`)

    const tableData = this.data

    let index = 0
    const length = this.headers.length

    setInterval(() => {
      this.deleteClassArrows(cellsHeaders)

      const title = this.headers[index]
      index = index + 1 === length ? 0 : index + 1

      this.createTable(this.sortUp(tableData, title))
      this.showTable()

      const titleElement = this.headersRow.querySelector(`.${styles[title]}`)
      titleElement.classList.add(styles.up)

      setTimeout(() => {
        titleElement.classList.remove(styles.up)
        titleElement.classList.add(styles.down)

        this.createTable(this.sortDown(tableData))
        this.showTable()
      }, 2000)
    }, 4000)
  }

  /**
   * Сортирует массив по возрастанию указанного свойства
   * @param {Array} table массив фильмов
   * @param {string} title свойство фильма
   * @returns сортированный массив
   */
  sortUp(table, title) {
    const sortedTable = table.sort((a, b) => {
      if (title === 'title') {
        const first = a[title].replace(/ё/, 'е')
        const second = b[title].replace(/ё/, 'е')
        return first > second ? 1 : -1
      }
      return a[title] - b[title]
    })
    return sortedTable
  }

  /**
   * Сортирует массив по убыванию
   * @param {Array} table массив фильмов
   * @returns сортированный массив
   */
  sortDown(table) {
    return table.reverse()
  }

  /**
   * Очищает ячейки от классов стрелок
   * @param {Array} cells массив ячеек заголовков
   */
  deleteClassArrows(cells) {
    cells.forEach((cell) => {
      cell.classList.remove(styles.up, styles.down)
    })
  }
}
