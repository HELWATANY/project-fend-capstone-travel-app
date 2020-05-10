import { handleSubmit } from '../src/client/js/formHandler';
import { validateForm } from '../src/client/js/validateForm';

describe('asyncPost()', () => {
  beforeEach(() => {
    fetch.resetMocks()
    global.Client = { validateForm }
  })

  it('post statement to api and get result', async () => {
    document.body.innerHTML = `
      <input name="name" id="name" value="Amazon and Microsoft are accusing each other of playing dirty to get JEDI contract" />
      <div id="polarity"></div>
      <div id="subjectivity"></div>
      <div id="text"></div>
      <div id="polarity_confidence"></div>
      <div id="subjectivity_confidence"></div>
    `

    fetch.mockResponseOnce(JSON.stringify(
      {
        polarity: 'neutral',
        subjectivity: 'objective',
        text: 'Amazon and Microsoft are accusing each other of playing dirty to get JEDI contract',
        polarity_confidence: 0.8252037763595581,
        subjectivity_confidence: 0.9993238016607506
      }
    ))

    await handleSubmit()
    expect(document.getElementById('polarity').innerHTML)
      .toEqual('neutral')
    expect(document.getElementById('subjectivity').innerHTML)
      .toEqual('objective');
    expect(document.getElementById('text').innerHTML)
      .toEqual('Amazon and Microsoft are accusing each other of playing dirty to get JEDI contract');
    expect(document.getElementById('polarity_confidence').innerHTML)
      .toEqual('82.52%');
    expect(document.getElementById('subjectivity_confidence').innerHTML)
      .toEqual('99.93%');

  })
})
