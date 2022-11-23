import { ReactComponent as SpeechIcon } from '../assets/images/speech.svg'
import { useState } from "react"

import { setWarningMsg } from '../reducer/reducer'
import { useDispatch } from 'react-redux'

export default function Speech ({setSpeech}) {

  const [isProcessing, setIsProcessing] = useState(false)
  const dispatch = useDispatch()

  //先判斷瀏覽器是否有語音辨識物件
  if (!('webkitSpeechRecognition' in window)) {
    dispatch(setWarningMsg('您的裝置不支援語音辨識'))
    return
  } 
  
  const recognition = new window.webkitSpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang="cmn-Hant-TW";
  //開始辨識
  recognition.onstart = () => {
    console.log('開始辨識')
  }
  //辨識結果
  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript

    setSpeech(result)
    setIsProcessing(false)
  }
  //如果出錯
  recognition.onerror = (event) => {
    console.log('錯誤: ', event)
    if (event.error === 'network') {
      dispatch(setWarningMsg('您的裝置不支援語音辨識'))
    }
    else if (event.error === 'no-speech') {
      dispatch(setWarningMsg('未收到音，請確認瀏覽器是否開啟麥克風權限'))
    }
    setIsProcessing(false)
  }
  //結束辨識
  recognition.onend = () => {
    console.log('結束辨識')
  }

  if (isProcessing) return (
    <button 
      className="speech isProcessing">
      {/* <img className="speech__img" src={speech} alt="speech"></img> */}
      <div className='speech__isProcessing'>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </button>
  )
  return (
    <button 
      className="speech"
      onClick={() => {
      if (isProcessing) return
      setIsProcessing(true)
      recognition.start()
    }}>
      <SpeechIcon className="icon" alt="speech"></SpeechIcon>
    </button>
  )
}