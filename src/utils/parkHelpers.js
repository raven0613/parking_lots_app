import proj4 from 'proj4'


//TWD97的座標轉換成經緯度
export function coordinatesConvert (tw97x, tw97y) {
  //設定
    proj4.defs([
        [
            'EPSG:4326',
            '+title=WGS84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
        [
            'EPSG:3826',
            '+title=TWD97 TM2 +proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
        ]
    ]);
    //EPSG
    let EPSG3826 = new proj4.Proj('EPSG:3826'); //TWD97 TM2(121分帶)
    let EPSG4326 = new proj4.Proj('EPSG:4326'); //WGS84

    //TWD97轉經緯度
    const [lng, lat] = proj4(EPSG3826, EPSG4326, [Number(tw97x), Number(tw97y)]);
    return {lng, lat}
}

//求兩個地點間最短直線距離
export function getStraightDistance ( a, b ) {
    if (!a || !b) return
    const aX = a.lng
    const aY = a.lat
    const bX = b.lng
    const bY = b.lat
    const sum = (aX - bX) * (aX - bX) + (aY - bY) * (aY - bY)
    const distance = Math.sqrt(sum)
    return distance
}

//得到距離(這邊是經緯度)少於某數的所有停車場資料
export const getPointsInDistance = (datas, targetPoint, distance) => {
  if(!datas) return
  if (isNaN(distance)) return datas

  return datas.filter(data => 
    getStraightDistance(targetPoint, {lng: data.lng, lat: data.lat}) < distance)
}

//初次取得資料時把需要的key都加進去
export const formattedParksData = (parks, coordinatesConvert) => {
  if (!parks || !coordinatesConvert) return

  const formattedParks = parks.map(park => {
    const {id, area, name, summary, address, tel, payex, serviceTime, tw97x, tw97y, totalcar, totalmotor, totalbike, Pregnancy_First, Handicap_First, FareInfo: {...FareInfo}, ChargingStation} = park
    //TWD97轉經緯度
    const { lng, lat } = coordinatesConvert(Number(tw97x), Number(tw97y))
    
    return {
      id, area, name, summary, address, tel, payex, serviceTime, lat, lng, totalcar, totalmotor, totalbike, Pregnancy_First, Handicap_First, FareInfo, availablecar: 0, availablemotor: 0, travelTime: '- 分鐘', pay: '-', ChargingStation: ChargingStation? ChargingStation : '0', weather: '-'
    }
  })
  return formattedParks
}

//整理天氣格式
export const weatherData = (allWeather) => {
  if(!allWeather) return
  //得到資料中最近一次是幾點鐘
  const firstTime = Number(allWeather[0].weatherElement[0].time[0].startTime.slice(11, -6))
  const dateItem = new Date().getHours()
  //算出現在的時間在資料陣列裡是第幾個
  const index = Math.floor((dateItem - firstTime) / 3) < 0 ? 0 : Math.floor((dateItem - firstTime) / 3)

  const data = allWeather.map(weather => {
    return {
      area: weather.locationName, 
      weather: weather.weatherElement[0].time[index].elementValue[0].value,
      startTime: weather.weatherElement[0].time[index].startTime
    }
  })
  return data
}


//篩選條件
export const userFilterParks = (conditions, parks) => {
  if (!parks || !conditions) return
  let filterContainer = []

  if (conditions.some(con => con === 'all')) {
    return []
  }

  if (conditions.some(con => con === 'disabled')) {
    if (filterContainer.length) {
      filterContainer = filterContainer.filter(park => Number(park.Handicap_First) > 0 || park.summary.includes('身障') || park.summary.includes('身心障礙'))
    } 
    else {
      filterContainer = parks.filter(park => Number(park.Handicap_First) > 0 || park.summary.includes('身障') || park.summary.includes('身心障礙'))
    }
  }

  if (conditions.some(con => con === 'pregnancy')) {
    if (filterContainer.length) {
      filterContainer = filterContainer.filter(park => Number(park.Pregnancy_First) > 0)
    }
    else {
      filterContainer = parks.filter(park => Number(park.Pregnancy_First) > 0)
    }
  }
  if (conditions.some(con => con === 'charging')) {
    if (filterContainer.length) {
      filterContainer = filterContainer.filter(park => Number(park.ChargingStation) > 0)
    }
    else {
      filterContainer = parks.filter(park => Number(park.ChargingStation) > 0)
    }
  }
  return filterContainer
}


//篩選汽車/機車資料
export const parksTransFilter = (parkings, transOption) => {
  if(!parkings) return []

  if (transOption === 'car') {
    return parkings.filter(park => park.totalcar !== 0)
  }
  if (transOption === 'motor') {
    return parkings.filter(park => park.totalmotor !== 0)
  }
}

//得到單一目標不同車種的剩餘車位資料
export const availableCounts = (transOption, place) => {
  if (!transOption || !place) return
  if (transOption === 'car') return place.availablecar.toString()
  
  if (transOption === 'motor') return place.availablemotor.toString()
}
//得到單一目標不同車種的費率資料
export const payment = (transOption, place) => {
  if (transOption === 'car') return place.pay.toString()
  
  if (transOption === 'motor') return place.pay.toString()
}

//把剩餘車位的資料合併進停車場資料(回傳陣列資料)
export const parksWithRemainings = (parkings, remainings) => {
  if (!parkings) return []
  if (!remainings) return parkings

  return parkings.map(park => {
    //find 找出 id 相符的資料
    const data = remainings.find(rm => rm.id === park.id)
    if (data) {
      return {
        ...park,
        FareInfo: {...park.FareInfo},
        availablecar: data.availablecar > 0?  data.availablecar : 0,
        availablemotor: data.availablemotor > 0? data.availablemotor : 0
      }
    }
    //沒找到就返回原資料
    return park
  }) 
}
//把天氣的資料合併進停車場資料(回傳陣列資料)
export const parksWithWeather = (parks, weathers) => {
  if (!parks) return []
  if (!weathers) return parks
  const data = parks.map(park => {
    const data = weathers.find(weatherData => weatherData.area === park.area)
    if (data) {
      return {
        ...park, weather: data.weather
      }
    }
    return park
  })
  return data
}

//目前問題: 中山堂  中山雅樂軒
//土法煉鋼篩價格
export const payexFilter = (allParks) => {
  if (!allParks) return
  const digit = 4
  const allParksWithPayex = allParks.map(park => {
    if (park.id === '310') return { ...park, pay: 20 }
    else if (park.FareInfo.WorkingDay) {
      return {
        ...park, pay: park.FareInfo.WorkingDay[0].Fare
      }
    }
    else if (park.payex.includes('元/時')) {
      //篩出文字
      const index = park.payex.indexOf('元/時')
      const start = index - digit >= 0 ? index - digit : 0
      const payStr = park.payex.slice(start, index)
      const pay = Number(payStr.replace(/[^0-9]/ig,'')) > 200? '10' : payStr.replace(/[^0-9]/ig,'').replace(/\b(0+)/gi,'').replace(/\b(0+)/gi,'') //去掉頭的0
      return {
        ...park, pay: pay? pay: '-'
      }
    }
    else if (park.payex.includes('元/次')) {
      //篩出文字+
      const index = park.payex.indexOf('元/次')
      const start = index - digit >= 0 ? index - digit : 0
      const payStr = park.payex.slice(start, index)
      const pay = Number(payStr.replace(/[^0-9]/ig,'')) > 200? '10' : payStr.replace(/[^0-9]/ig,'').replace(/\b(0+)/gi,'').replace(/\b(0+)/gi,'') //去掉頭的0
      return {
        ...park, pay: pay? pay: '-'
      }
    }
    else if (park.payex.includes('計時')) {
      //篩出文字
      const index = park.payex.indexOf('計時')
      const end = index + digit + 2
      const payStr = park.payex.slice(index, end)
      const pay = Number(payStr.replace(/[^0-9]/ig,'')) > 200? '10' : payStr.replace(/[^0-9]/ig,'').replace(/\b(0+)/gi,'')
      return {
        ...park, pay: pay? pay: '-'
      }
    }
    else if (park.payex.includes('元/季') || park.payex.includes('元/月')) {
      return { ...park, pay: '-' }
    }
    else if (park.payex.includes('元')) {
      //篩出文字
      const index = park.payex.indexOf('元')
      const start = index - digit >= 0 ? index - digit : 0
      const payStr = park.payex.slice(start, index)
      const pay = Number(payStr.replace(/[^0-9]/ig,'')) > 200? '10' : payStr.replace(/[^0-9]/ig,'').replace(/\b(0+)/gi,'').replace(/\b(0+)/gi,'') //去掉頭的0
      return {
        ...park, pay: pay? pay: '-'
      }
    }
    return { ...park, pay: '-' }
  })
  return allParksWithPayex
}


export const serviceTimeFilter = (allParks) => {
  if (!allParks) return
  const allParksWithService = allParks.map(park => {
    if (park.serviceTime.includes('臨停')) {
      return { ...park, service: park.serviceTime }
    }
    else if (park.serviceTime.includes('平日')) {
      return { ...park, service: park.serviceTime }
    }
    else if (park.serviceTime.includes('全日')) {
      return { ...park, service: '24小時' }
    }
    else if (park.serviceTime.includes('00:00:00~23:59')) {
      return { ...park, service: '24小時' }
    }
    else if (park.serviceTime.includes('24小時')) {
      return { ...park, service: '24小時' }
    }
    else if (park.serviceTime.length === 17) {
      const start = park.serviceTime.slice(0, 5)
      const end = park.serviceTime.slice(8, -2)
      return { ...park, service: `${start}${end}` }
    }
    return { ...park, service: park.serviceTime }
  })
  return allParksWithService
}

//得到query string 的土法煉鋼法
// const targetQuery = queryParams.has('target') ? `target=${queryParams.get('target')}` : ''
// const nearbyQuery = queryParams.has('nearby') ? `nearby=${queryParams.get('nearby')}` : ''
// let and = ''
// let question = ''
// if(queryParams.has('target') || queryParams.has('nearby')) {
// question = '?'
// }
// if(queryParams.has('target') && queryParams.has('nearby')) {
// and = '&'
// }
// const queryString = `${question}${targetQuery}${and}${nearbyQuery}`