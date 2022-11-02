export default function ModeController (props) {
  const { setMode } = props
  return (
    <div className='mode__controller'>
      <button
        className="mode__controller--button mode__controller--self"
        onClick={() => {
          setMode("self");
        }}>
        自己位置
      </button>
      <button
        className="mode__controller--button mode__controller--quick"
        onClick={() => {
          setMode("screen-center");
        }}>
        即時搜尋
      </button>
    </div>
  )
}