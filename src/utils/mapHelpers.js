//計算到達時間
export const getNearParksTime = (origin, destinations, setNearParks) => {
  
  if (!origin || !destinations.length) return
  const google = window.google;
  const service = new google.maps.DistanceMatrixService()
  service.getDistanceMatrix({
    origins: [origin],
    destinations,
    travelMode: google.maps.TravelMode.DRIVING,
    avoidHighways: true,
    avoidTolls: true
  }, (response, status) => {
    if (status === "OK" && response) {
      const resArr = response.rows[0].elements
      
      let i = 0
      const newParks = destinations.map(park => {
        i = i + 1
        return {
          ...park, travelTime: resArr[i - 1].duration.text
        } 
      })
      setNearParks(newParks)
    }
  })
}

//獲得路線資訊
export const handleFetchDirections = (origin, destination, state, setter) => {
  //如果已經有路線，就把他清除
  if (state) {
    setter(null)
  }
  if (!origin || !destination) return 
  
  const google = window.google;

  //創建距離api的實例
  const service = new google.maps.DirectionsService();
  //調用DirectionsService.route來發送請求
  service.route(
    {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === "OK" && result) {
        setter(result)
        console.log(result)
      }
    }
  )
}


//一次性取得使用者的 currentPosition並且設為地圖中央
export const getUserPos = (dispatch, setSelfPos, mode, setMapCenter, setMode, setIsLocateDenied, setWarningMsg) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (setSelfPos) {
          dispatch(setSelfPos({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          ))
          if(mode !== 'self') return
          if(!position) return
          
          dispatch(setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }))
        }
      },
      (error) => {
        if (error.code === 1) {
          dispatch(setIsLocateDenied(true))
          //不給的話就定居台北市
          dispatch(setMapCenter({lat: 25.0408065, lng: 121.5397976}))
          dispatch(setMode('screen-center'))
          dispatch(setWarningMsg('您將無法使用定位及路線功能'))
          return
        }
      }
    );
  } else {
    dispatch(setIsLocateDenied(true))
    dispatch(setMapCenter({lat: 25.0408065, lng: 121.5397976}))
    dispatch(setMode('screen-center'))
    dispatch(setWarningMsg('你的裝置不支援地理位置功能。'))
    return
  }
}

//監控使用者的 currentPosition
export const watchUserPos = (dispatch, setSelfPos, setMapCenter, setMode, setIsLocateDenied, setWarningMsg) => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        dispatch(setSelfPos({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }))
      },
      (error) => {
        if (error.code === 1) {
          dispatch(setIsLocateDenied(true))
          dispatch(setMapCenter({lat: 25.0408065, lng: 121.5397976}))
          dispatch(setMode('screen-center'))
          dispatch(setWarningMsg('您無法使用定位及路線功能，可於瀏覽器設定開啟權限。'))
          return
        }
      }
    );
  } else {
    dispatch(setIsLocateDenied(true))
    dispatch(setMapCenter({lat: 25.0408065, lng: 121.5397976}))
    dispatch(setMode('screen-center'))
    dispatch(setWarningMsg('你的裝置不支援地理位置功能。'))
    return
  }
}