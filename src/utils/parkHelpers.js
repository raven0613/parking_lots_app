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

//初次取得資料時把需要的key都加進去
export const formattedParksData = (parks, coordinatesConvert) => {
  if (!parks || !coordinatesConvert) return

  const formattedParks = parks.map(park => {
    const {id, area, name, summary, address, tel, payex, serviceTime, tw97x, tw97y, totalcar, totalmotor, totalbike, Pregnancy_First, Handicap_First, FareInfo: {...FareInfo}, ChargingStation} = park
    //TWD97轉經緯度
    const { lng, lat } = coordinatesConvert(Number(tw97x), Number(tw97y))
    
    return {
      id, area, name, summary, address, tel, payex, serviceTime, lat, lng, totalcar, totalmotor, totalbike, Pregnancy_First, Handicap_First, FareInfo, availablecar: 0, availablemotor: 0, travelTime: '- 分鐘', pay: '-', ChargingStation: ChargingStation? ChargingStation : '0'
    }
  })
  return formattedParks
}
//篩選條件
export const userFilterParks = (conditions, parks) => {
  if (!parks || !conditions) return
  let filterContainer = []
  conditions.forEach(condition => {
    if (condition === 'disabled') {
      if (filterContainer.length) {
        filterContainer = filterContainer.filter(park => Number(park.Handicap_First) > 0 || park.summary.includes('身障'))
        return
      }
      filterContainer = parks.filter(park => Number(park.Handicap_First) > 0 || park.summary.includes('身障'))
    }
    if (condition === 'pregnancy') {
      if (filterContainer.length) {
        filterContainer = filterContainer.filter(park => Number(park.Pregnancy_First) > 0)
        return
      }
      filterContainer = parks.filter(park => Number(park.Pregnancy_First) > 0)
    }
    if (condition === 'charging') {
      if (filterContainer.length) {
        filterContainer = filterContainer.filter(park => Number(park.ChargingStation) > 0)
        return
      }
      filterContainer = parks.filter(park => Number(park.ChargingStation) > 0)
    }
    if (condition === 'all') {
      filterContainer = []
    }
  })
  
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