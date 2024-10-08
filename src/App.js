import { useWhisper } from '@chengsokdara/use-whisper'
import { useState } from 'react';

const App = () => {
  /**
   * you have more control like this
   * do whatever you want with the recorded speech
   * send it to your own custom server
   * and return the response back to useWhisper
   */
  document.body.style.backgroundColor = "#8077e7";
  document.body.style.color = "#eee";

  const [transText, setTransTest] = useState('')
  const [agentMessage, setAgentMessage] = useState('')

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
    const payagent = await axios.post('http://127.0.0.1:5000/api/v1/payagent/', {query: text})
    const { message } = await payagent.data
    setAgentMessage(message)

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
    <div style={{ textAlign: "center",  fontWeight: "700"}}>
      <h1 style={{fontFamily: "Roboto, Arial, sans-serif", fontSize: "52px"}}>FixerPay:<br></br><span style={{color:"#77e7ad"}}>Speak</span> & <span style={{color:"#77e7ad"}}>Get</span></h1>
      <h2 style={{fontFamily: "Roboto, Arial, sans-serif", fontSize: "20px"}}>Whatever Payment Needs You Have</h2>
      <div>
        <button
          className="button"
          style={{
            backgroundColor: "green",
            fontFamily: "Roboto, Arial, sans-serif",
            fontSize: "20px",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={() => {
            startRecording()
            setTransTest('')
            setAgentMessage('')
          }}
        >
          <span style={{fontFamily: "Roboto, Arial, sans-serif", fontWeight: "700", color: "#eee"}}>Speak</span>
        </button>
        <button
          className="button"
          style={{
            backgroundColor: "red",
            fontFamily: "Roboto, Arial, sans-serif",
            fontSize: "20px",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => stopRecording()}
        >
          <span style={{fontFamily: "Roboto, Arial, sans-serif", fontWeight: "700", color: "#eee"}}>Stop</span>
        </button>
      </div>
      <br>
      </br>
      <p style={{ fontSize: "20px", marginBottom: "20px", fontFamily: "Roboto, Arial, sans-serif", }}>
        What you said: {transText}
      </p>
      <p style={{ fontSize: "20px", marginBottom: "20px", fontFamily: "Roboto, Arial, sans-serif", }}>
        What FixerPay said: {agentMessage}
      </p>
    </div>
  );
  
};

export default App;