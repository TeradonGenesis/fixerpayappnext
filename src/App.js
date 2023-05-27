import { useWhisper } from '@chengsokdara/use-whisper'
import { useState } from 'react';

const App = () => {
  /**
   * you have more control like this
   * do whatever you want with the recorded speech
   * send it to your own custom server
   * and return the response back to useWhisper
   */

  const [transText, setTransTest] = useState('')

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
    const response = await axios.post('http://127.0.0.1:5000/api/v1/payagent/whisper', body, {
      headers,
    })
    const { text } = await response.data
    setTransTest(text)
    // you must return result from your server in Transcript format
    const data = await axios.post('http://127.0.0.1:5000/api/v1/payagent/', {query: text})
    console.log(data)
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
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "24px", color: "#333", marginBottom: "20px" }}>
        Transcribed Text: {transText}
      </p>
      <div>
        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            fontFamily: "Open Sans, Helvetica, sans-serif",
            fontSize: "16px",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={() => startRecording()}
        >
          Start
        </button>
        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            fontFamily: "Open Sans, Helvetica, sans-serif",
            fontSize: "16px",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => stopRecording()}
        >
          Stop
        </button>
      </div>
    </div>
  );
  
};

export default App;