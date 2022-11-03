export default function DetailPanel (props) {
  const { currentPark } = props
  let className = ''
  if (currentPark) {
    className = 'detail__panel active'
  } else {
    className = 'detail__panel'
  }
  return (
    <div className={className}>
      <p>{currentPark? currentPark.name: ''}</p>
    </div>
  )
}