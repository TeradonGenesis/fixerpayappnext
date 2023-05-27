import { useWhisper } from '@chengsokdara/use-whisper'

const App = () => {
  /**
   * you have more control like this
   * do whatever you want with the recorded speech
   * send it to your own custom server
   * and return the response back to useWhisper
   */
  const onTranscribe = async (blob) => {
    const base64 = await new Promise(
      (resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      }
    )
    const body = JSON.stringify({ file: base64, model: 'whisper-1' })
    const headers = { 'Content-Type': 'application/json' }
    const { default: axios } = await import('axios')
    const response = await axios.post('/api/whisper', body, {
      headers,
    })
    const { text } = await response.data
    // you must return result from your server in Transcript format
    return {
      blob,
      text,
    }
  }

  const {
    transcript,
    startRecording,
    stopRecording,
  } = useWhisper({
    onTranscribe,
  })

  return (
    <div>
      <p>Transcribed Text: {transcript.text}</p>
      <button onClick={() => startRecording()}>Start</button>
      <button onClick={() => stopRecording()}>Stop</button>
    </div>
  )
}

export default App;