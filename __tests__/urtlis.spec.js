import { asyncGet, asyncPost } from '../src/client/js/utils';

describe('asyncPost()', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('post statement to api and get result', async () => {
    fetch.mockResponseOnce(JSON.stringify(
      {
        polarity: 'neutral',
        subjectivity: 'objective',
        text: 'Amazon and Microsoft are accusing each other of playing dirty to get JEDI contract',
        polarity_confidence: 0.8252037763595581,
        subjectivity_confidence: 0.9993238016607506
      }
    ))

    const text = 'Amazon and Microsoft are accusing each other of playing dirty to get JEDI contract'
    let response = await asyncPost('URL', {text})
    expect(response).toEqual({
      polarity: 'neutral',
      subjectivity: 'objective',
      text: 'Amazon and Microsoft are accusing each other of playing dirty to get JEDI contract',
      polarity_confidence: 0.8252037763595581,
      subjectivity_confidence: 0.9993238016607506
    })

  })
})

describe('asyncGet()', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('Fetch data from the api', async () => {
    fetch.mockResponseOnce(JSON.stringify(
      {
        polarity: 'neutral',
        subjectivity: 'objective',
        text: 'Amazon and Microsoft are accusing each other of playing dirty to get JEDI contract',
        polarity_confidence: 0.8252037763595581,
        subjectivity_confidence: 0.9993238016607506
      }
    ))

    let response = await asyncGet('API_URL')
    expect(response).toEqual({
      polarity: 'neutral',
      subjectivity: 'objective',
      text: 'Amazon and Microsoft are accusing each other of playing dirty to get JEDI contract',
      polarity_confidence: 0.8252037763595581,
      subjectivity_confidence: 0.9993238016607506
    })

  })
})
