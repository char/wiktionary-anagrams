const fs = require('fs')
const readline = require('readline')
const { normalizeWord, calculateLetterProduct } = require('./src/util/util.js')
const bigInt = require('big-integer')

if (fs.existsSync('.cache/words-all.txt')) {
  let reader = readline.createInterface({
    input: fs.createReadStream('.cache/words-all.txt')
  })

  reader.on('line', (word) => {
    let wordValue = calculateLetterProduct(normalizeWord(word))
    if (wordValue == 0) {
      return
    }

    console.log(word + ' - ' + wordValue)
    fs.appendFileSync('./static/words-by-product/' + wordValue.toString().length + '.txt', word + ' ' + wordValue.toString() + '\n')
  })

} else {
  console.error('Please run ./scrape-wiktionary-titles.sh first!')
}
