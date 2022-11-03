export default function DetailPanel (props) {
  const { currentPark } = props

  return (
    <div className="detail__panel active">
      <p>{currentPark? currentPark.name: ''}</p>
    </div>
  )
}