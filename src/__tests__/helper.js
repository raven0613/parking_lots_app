import { getStraightDistance, formattedParksData, coordinatesConvert, parksTransFilter, parksWithRemainings, payexFilter } from '../utils/helpers'


const parkArray = [ {
      "id" : "001",
      "area" : "信義區",
      "name" : "府前廣場地下停車場",
      "type" : "1",
      "type2" : "2",
      "summary" : "為地下二層停車場，計有1998個小型車停車格，1337個機車停車位",
      "address" : "松壽路1號地下",
      "tel" : "27057716",
      "payex" : "小型車全日月票4200元，周邊里里民全日月票3360元，所在里里民全日月票2940元，夜間月票1000元(限周一至周五19-8，及周六、日與行政機關放假之紀念日、民俗日)，小型車計時30元(9-18)，夜間計時10元(18-9)；機車計時10元(當日當次上限20元)，機車月票300元。",
      "serviceTime" : "00:00:00~23:59:59",
      "tw97x" : "306812.928",
      "tw97y" : "2769892.95",
      "totalcar" : 1998,
      "totalmotor" : 1360,
      "totalbike" : 0,
      "totalbus" : 0,
      "Pregnancy_First" : "40",
      "Handicap_First" : "45",
      "Taxi_OneHR_Free" : "0",
      "AED_Equipment" : "0",
      "CellSignal_Enhancement" : "0",
      "Accessibility_Elevator" : "0",
      "Phone_Charge" : "0",
      "Child_Pickup_Area" : "0",
      "FareInfo" : {
        "WorkingDay" : [ {
          "Period" : "00~09",
          "Fare" : "10"
        }, {
          "Period" : "09~18",
          "Fare" : "30"
        }, {
          "Period" : "18~24",
          "Fare" : "10"
        } ],
        "Holiday" : [ {
          "Period" : "00~09",
          "Fare" : "10"
        }, {
          "Period" : "09~18",
          "Fare" : "30"
        }, {
          "Period" : "18~24",
          "Fare" : "10"
        } ]
      },
      "EntranceCoord" : {
        "EntrancecoordInfo" : [ {
          "Xcod" : "25.03648987",
          "Ycod" : "121.5621068",
          "Address" : "基隆路一段"
        }, {
          "Xcod" : "25.036014",
          "Ycod" : "121.563163",
          "Address" : "松壽路"
        }, {
          "Xcod" : "25.035975",
          "Ycod" : "121.561532",
          "Address" : "基隆路一段車行地下道"
        } ]
      }
    }, {
      "id" : "002",
      "area" : "信義區",
      "name" : "松壽廣場地下停車場",
      "type" : "1",
      "type2" : "2",
      "summary" : "立體式小型車446格(含身心障礙停車位6格)。",
      "address" : "松智路15號地下",
      "tel" : "27057716",
      "payex" : "計時：30元/時(周一至周五9-22)、40元/時(周六至周日與行政機關放假之紀念日與民俗日9-22)、10元/時(每日22-9)，全程半小時計費。",
      "serviceTime" : "00:00:00~23:59:59",
      "tw97x" : "307143.740",
      "tw97y" : "2770011.52",
      "totalcar" : 455,
      "totalmotor" : 0,
      "totalbike" : 0,
      "totalbus" : 0,
      "Pregnancy_First" : "8",
      "Handicap_First" : "9",
      "totallargemotor" : "0",
      "ChargingStation" : "4",
      "Taxi_OneHR_Free" : "0",
      "AED_Equipment" : "0",
      "CellSignal_Enhancement" : "0",
      "Accessibility_Elevator" : "0",
      "Phone_Charge" : "0",
      "Child_Pickup_Area" : "0",
      "FareInfo" : {
        "WorkingDay" : [ {
          "Period" : "00~09",
          "Fare" : "10"
        }, {
          "Period" : "09~22",
          "Fare" : "30"
        }, {
          "Period" : "22~24",
          "Fare" : "10"
        } ],
        "Holiday" : [ {
          "Period" : "00~09",
          "Fare" : "10"
        }, {
          "Period" : "09~22",
          "Fare" : "40"
        }, {
          "Period" : "22~24",
          "Fare" : "10"
        } ]
      },
      "EntranceCoord" : {
        "EntrancecoordInfo" : [ {
          "Xcod" : "25.036966",
          "Ycod" : "121.565523",
          "Address" : ""
        } ]
      }
}]

//formattedParksData
test('should get correct data format transformed from API data', () => {
  const formattedParks = formattedParksData(parkArray, coordinatesConvert)
  const { lat, lng, availablecar, availablemotor, travelTime, pay } = formattedParks[0]
  expect(lat && lng && availablecar && availablemotor && travelTime && pay).toBeDefined()
  expect(lat && lng).toBeLessThan(130)
})

//getStraightDistance
test('should get distance from two points', () => {
  const point1 = {lat: 0, lng: 1}
  const point2 = {lat: Math.sqrt(3), lng: 0}
  expect(getStraightDistance(point1, point2)).toBeCloseTo(2)
})

//parksWithRemainings
test('should get remaining data form parks data', () => {
  const inputParks = [{
    id: 1,
    name: 'park1',
    FareInfo: {
      WorkingDay: [{
        Period: '00-09',
        Fare: '10'
      },{
        Holiday: [{
        Period: '00-09',
        Fare: '10'
        }]
      }]
    },
    availablecar: 0,
    availablemotor: 0
  }]
  const inputRemainings = [{
    id: 1,
    availablecar: 20,
    availablemotor: 10,
  }]
  const results = [{
    id: 1,
    name: 'park1',
    FareInfo: {
      WorkingDay: [{
        Period: '00-09',
        Fare: '10'
      },{
        Holiday: [{
        Period: '00-09',
        Fare: '10'
        }]
      }]
    },
    availablecar: 20,
    availablemotor: 10,
  }]
  const newPark = parksWithRemainings(inputParks, inputRemainings)
  expect(newPark).toEqual(results)

})

//parksTransFilter
test('should get correct remainings by different transOptions', () => {
  const inputParks = [{
    id: 1,
    totalcar: 10,
    totalmotor: 0
  },{
    id: 2,
    totalcar: 0,
    totalmotor: 10
  }]
  const carResult = [{
    id: 1,
    totalcar: 10,
    totalmotor: 0
  }]
  const motorResult = [{
    id: 2,
    totalcar: 0,
    totalmotor: 10
  }]
  expect(parksTransFilter(inputParks, 'car')).toEqual(carResult)
  expect(parksTransFilter(inputParks, 'motor')).toEqual(motorResult)
})

//payexFilter
test('should get simple pay information form payex', () => {
  const inputParks = [{
    id: 1,
    payex: '計時：小型車40元/時，全程以半小時計。計次：機車20元/次。',
    FareInfo: {},
    pay: '-'
  },{
    id: 2,
    payex: '場地租用:每次100元(限3小時)。夜間租用:每月2,500元。',
    FareInfo: {},
    pay: '-'
  },{
    id: 3,
    payex: '計時：小型車40元/時(16-22)；30元/時(22-翌日16)；機車10元/時，當日最高收費上限20元(隔日另計)，全程以半小時計費。月租：小型車全日5,760元，機車300元/月。',
    FareInfo: {},
    pay: '-'
  },{
    id: 4,
    payex: '1.夜間停車：6000元/季。2.全日停車：9000元/季。3.臨停：30元/次。',
    FareInfo: {},
    pay: '-'
  },{
    id: 5,
    payex: '月租：全日車輛3,000元/月；日間車輛2,500元/月(7：30-18：30)；夜間車輛2,000元/月(18：30-7：30)',
    FareInfo: {},
    pay: '-'
  },{
    id: 6,
    payex: '詳見現場公告',
    FareInfo: {},
    pay: '-'
  },{
    id: 7,
    payex: '以現場公告為主',
    FareInfo: {
      WorkingDay: [{
        Period: '00-09',
        Fare: '10'
      }],
        Holiday: [{
        Period: '00-09',
        Fare: '10'
        }]
    },
    pay: '-'
  }]
  const results = [{
    id: 1,
    payex: '計時：小型車40元/時，全程以半小時計。計次：機車20元/次。',
    FareInfo: {},
    pay: '40'
  },{
    id: 2,
    payex: '場地租用:每次100元(限3小時)。夜間租用:每月2,500元。',
    FareInfo: {},
    pay: '100'
  },{
    id: 3,
    payex: '計時：小型車40元/時(16-22)；30元/時(22-翌日16)；機車10元/時，當日最高收費上限20元(隔日另計)，全程以半小時計費。月租：小型車全日5,760元，機車300元/月。',
    FareInfo: {},
    pay: '40'
  },{
    id: 4,
    payex: '1.夜間停車：6000元/季。2.全日停車：9000元/季。3.臨停：30元/次。',
    FareInfo: {},
    pay: '30'
  },{
    id: 5,
    payex: '月租：全日車輛3,000元/月；日間車輛2,500元/月(7：30-18：30)；夜間車輛2,000元/月(18：30-7：30)',
    FareInfo: {},
    pay: '-'
  },{
    id: 6,
    payex: '詳見現場公告',
    FareInfo: {},
    pay: '-'
  },{
    id: 7,
    payex: '以現場公告為主',
    FareInfo: {
      WorkingDay: [{
        Period: '00-09',
        Fare: '10'
      }],
        Holiday: [{
        Period: '00-09',
        Fare: '10'
        }]
    },
    pay: '10'
  }]
  expect(payexFilter(inputParks)).toEqual(results)
})


