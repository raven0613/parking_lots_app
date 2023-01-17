import { useEffect, useState } from 'react'

export default function SecondsCounter ({remainingsData}) {

  const [afterLastFetch, setAfterLastFetch] = useState(0)
  // 距離上次抓到資料隔多久

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAfterLastFetch((prev) => prev + 1)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [])

  //剩餘車位資料成功抓進來後計時歸0
  useEffect(() => {
    if (!remainingsData) return 
    setAfterLastFetch(0)
  }, [remainingsData])
  
  return (
    <div className="counter">
      <span>距離上次資料更新：</span>
      <span className="number">{afterLastFetch}</span>
      <span> 秒鐘</span>
    </div>
  )
}