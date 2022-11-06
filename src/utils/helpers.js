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