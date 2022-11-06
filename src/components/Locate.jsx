export default function Locate ({setMapCenter, mapRef, selfPos, mapInstance}) {


  return (
    <button 
      onClick={() => {
        console.log('定位到user')
        // setMapCenter(selfPos) //screen模式可用
        mapInstance.setCenter(selfPos) //原本self模式可用，但點了screen模式再切回來 mapInstance 就不見了
        // mapRef?.current.setCenter(selfPos)
      }} 
      className="locate">
      定位
    </button>
  )
}