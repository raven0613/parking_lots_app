import { useState } from "react"

export default function Speech (props) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { speechRef } = props

  //先判斷瀏覽器是否有語音辨識物件
  if (!('webkitSpeechRecognition' in window)) {
    return console.log('您的裝置不支援語音辨識')
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

    speechRef.current = result
    setIsProcessing(false)
  }
  //如果出錯
  recognition.onerror = (event) => {
    console.log('錯誤: ', event)
    setIsProcessing(false)
    //如果收不到音可以提醒是否有設定正確麥克風或是權限
  }
  //結束辨識
  recognition.onend = () => {
    console.log('結束辨識')
  }

  if (isProcessing) return (
    <button disabled>辨識</button>
  )
  return (
    <button onClick={() => {
      if (isProcessing) return
      setIsProcessing(true)
      recognition.start()
    }}>辨識</button>
  )
}