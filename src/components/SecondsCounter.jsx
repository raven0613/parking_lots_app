import { useEffect, useState } from 'react'

export default function SecondsCounter ({remainings}) {
  const [afterLastFetch, setAfterLastFetch] = useState(0)
  // 距離上次抓到資料隔多久
  useEffect(() => {
    if (afterLastFetch === undefined) return
    const interval = setInterval(() => {
      setAfterLastFetch(afterLastFetch + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [afterLastFetch])


  //剩餘車位資料成功抓進來後計時歸0
  useEffect(() => {
    if (!remainings) return
    if (afterLastFetch > 0) {
      setAfterLastFetch(0)
    }
  }, [remainings])
  

  return (
    <div className="counter">
      <span>距離上次資料更新：</span>
      <span className="number">{afterLastFetch}</span>
      <span> 秒鐘</span>
    </div>
  )
}