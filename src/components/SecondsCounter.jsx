export default function SecondsCounter ({ afterLastFetch }) {
  
  return (
    <div className="counter">
      <span>距離上次更新：</span>
      <span className="number">{afterLastFetch}</span>
      <span> 秒鐘</span>
    </div>
  )
}