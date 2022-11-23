# 啾啾停車

## 專案介紹

這是一個可以幫你在台北市快速找到適合停車場的 WebApp
[網站連結](https://raven0613.github.io/parking_lots_app/#)

*  電腦版

![PC01](https://user-images.githubusercontent.com/93082842/201565101-401fd4f1-5404-4a55-b43e-e6546b45f580.gif)

＊  深色模式

![深色模式](https://user-images.githubusercontent.com/93082842/203660535-bcc3cdac-4d6d-4216-ab71-657b160bab27.gif)

＊  手機版

![MB01](https://user-images.githubusercontent.com/93082842/201565122-06bf9967-6ebf-43f0-8dd6-139cc9aa8687.gif)


### 在這個網站，你可以——


1. 尋找適合的停車場
<ul>
<li>直接使用地圖定位自身，移動時即時顯示附近停車場</li>
<li>以圖標顏色分辨車位數足夠的停車場</li>
<li>滑動地圖後即時顯示中心點附近的停車場位置</li>
<li>一鍵切換顯示機車或汽車停車場</li>
<li>一鍵切換顯示價格或剩餘車位數</li>
<li>快速篩選有充電站、身障車位、孕婦優先的停車場</li>
<li>定位回自身位置</li>
<li>以更新後秒數來確認畫面上是否為最新資料</li>
<li>夜間行車切換深色模式保護眼睛</li>
</ul>

2. 確認詳細資訊
<ul>
<li>點選圖標可以看見停車場的詳細資訊（車位數量、名稱、費率、營業時間、該區天氣等）</li>
<li>電腦版右側欄；手機板點選底部的附近停車場，可以概覽附近所有停車場資料</li>
<li>從附近停車場可以直接點選停車場卡片，查看詳細資訊並在地圖上顯示</li>
<li>點選路線按紐，得知推薦的行駛路線、所需時間</li>
<li>在目標停車場剩餘車位歸零時得到提醒</li>
</ul>

3. 搜尋目的地
<ul>
<li>輸入目的地搜尋附近的停車場（支援語音辨識）</li>
<li>按 X 一鍵刪除搜尋資料與內容</li>
</ul>

## 安裝專案

### 在 terminal 輸入以下文字，複製專案至本機資料夾中

```
git clone https://github.com/raven0613/parking_lots_app
```

※以下步驟請確認 terminal 的目前資料夾位置是在 parking_lots_app※

### 下載 node_modules

```
npm install
```

### 啟動專案

```
npm start
```

### 在任一瀏覽器網址列輸入以下網址，開始體驗！

```
http://localhost:3000/
```

關閉專案請在 terminal 輸入 ctrl / command + C

## 開發工具

<ul dir="auto">
<li>react 18.2.0</li>
<li>react-router-dom 1.9.0</li>
<li>axios 0.19.2</li>
<li>@react-google-maps/api 2.13.1</li>
<li>use-places-autocomplete 4.0.0</li>
<li>proj4 2.8.0</li>
<li>gh-pages 4.0.0</li>
<li>Figma</li>
詳細可參考 package.json
</ul>

## 素材來源

[svgrepo](https://www.svgrepo.com/)

[brandcolors](https://brandcolors.net/)

## 外接資料

[臺北市停車場資訊、剩餘停車位數](https://data.gov.tw/dataset/128435)

[中央氣象局開放資料平臺之資料擷取 API](https://opendata.cwb.gov.tw/dist/opendata-swagger.html#/)
