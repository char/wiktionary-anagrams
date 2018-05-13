import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Container, Navbar, NavbarBrand, Form, FormGroup, FormFeedback, Input, Alert } from 'reactstrap'
import { normalizeWord, calculateLetterProduct } from '../util/util.js'

class IndexPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      word: '',
      currentState: 'idle',

      anagrams: new Set()
    }

    this.handleWordInput = this.handleWordInput.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('caching-worker.js')
    }
  }

  render() {
    return (
      <main>
        <Navbar color='dark' dark expand='md' style={{ 'margin-bottom': '1.5em' }}>
          <NavbarBrand href='/'>Wiktionary Anagrams</NavbarBrand>
        </Navbar>

        <Container>
          <p>Search for anagrams of a character sequence using all the page titles of <a href='//en.wiktionary.org'>English Wiktionary</a>.</p>

          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Input type='text' name='word' placeholder='Enter your word' value={this.state.word} onChange={this.handleWordInput}/>
              <FormFeedback>Please enter a valid word.</FormFeedback>
            </FormGroup>
          </Form>

          { this.state.currentState === 'waiting' &&
            (<Container>
              <p>Waiting for anagrams...</p>
            </Container>)
          }

          { this.state.currentState === 'calculating' &&
           (<Container>
              <p>Scanning words for anagrams...</p>
            </Container>)
          }

          { this.state.currentState === 'unsupported' && (
            <Container>
              <p>The word contains characters which are not supported as of yet by this anagram finder.</p>
              <p>This could be that the word is written in an alphabet that does not yet have anagram optimization mapping.</p>
            </Container>
          ) }

          { this.state.currentState === 'done' &&
            (<Container>
              <p>Found { this.state.anagrams.size } anagram{ this.state.anagrams.size == 1 ? "" : "s" }.</p>

              <ul>
                { (() => {
                  let container = []
                  this.state.anagrams.forEach((x) => {
                    container.push(<li key={ 'anagram-' + x }><a href={'//en.wiktionary.org/wiki/' + x}>{ x }</a></li>)
                  })

                  return container
                })() }
              </ul>
            </Container>)
          }
        </Container>
      </main>
    )
  }

  handleWordInput(event) {
    this.setState({ word: event.target.value })
  }

  onSubmit(event) {
    event.preventDefault()

    this.setState({
      currentState: 'waiting',
      anagrams: new Set()
    })

    let word = normalizeWord(this.state.word)
    let wordProduct = calculateLetterProduct(word)
    let wordProductStr = wordProduct.toString()

    if (wordProduct.equals(0)) {
      this.setState({ 'currentState': 'unsupported' })
    }

    fetch('/words-by-product/' + wordProduct.toString().length + '.txt').then((response) => {
      response.text().then((text) => {
        this.setState({
          currentState: 'calculating'
        })

        let anagrams = new Set()

        for (let entry of text.split('\n')) {
          let entrySplit = entry.split(' ')

          let entryWord = entrySplit.slice(0, entrySplit.length - 1).join(' ')
          let entryProduct = entrySplit[entrySplit.length - 1]

          if (entryProduct === wordProductStr) {
            if (entryWord.toLowerCase() !== word.toLowerCase()) {
              anagrams.add(entryWord.replace(/_/g, ' '))
            }
          }
        }

        this.setState({
          'currentState': 'done',
          anagrams: anagrams
        })
      })
    })

    /* let length = originalWord.length
    fetch('/words-by-length/' + length + '.txt').then((response) => {
      response.text().then((text) => {
        this.setState({
          currentState: 'calculating'
        })

        let anagrams = new Set()
        let words = {}

        for (let word of text.split('\n')) {
          words[normalizeWord(word)] = word
        }

        const worker = new Worker('permutation-worker.js')
        worker.postMessage(originalWord)

        worker.onmessage = (event) => {
          if (event.data == 0) {
            this.setState({
              currentState: 'done',
              anagrams: anagrams
            })
          } else {
            let permutation = event.data

            let wiktionaryWord = words[permutation]
            if (wiktionaryWord && permutation !== originalWord) {
              anagrams.add(wiktionaryWord)
            }
          }
        }
      })
    }) */
  }
}

export default IndexPage
