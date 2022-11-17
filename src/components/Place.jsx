import cancel from '../assets/images/cancel.svg'
import { useFetcher, useLocation, useNavigate } from 'react-router-dom'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import useOnclickOutside from "react-cool-onclickoutside"
import "@reach/combobox/styles.css"
import { useEffect, useState, useRef, useContext } from 'react'
import { mapContext } from '../store/UIDataProvider'

import { useDispatch } from 'react-redux'
import { setMode, setMapCenter, setTarget } from '../reducer/reducer'
import Speech from './Speech'

export default function Place () {
  const dispatch = useDispatch()

  const { mapInstance } = useContext(mapContext)
  const targetAddressRef = useRef(null)

  const [ speech, setSpeech ] =  useState()
  const [v, setV] = useState('')

  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      language: 'zh-TW'
    },
    debounce: 300,
  })


  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [isOnComposition, setIsOnComposition] = useState(false)


  useEffect(() => {
    const text = speech? speech : ''
    setV(text)
    setValue(text)
  }, [speech])

  //網址改變時
  useEffect(() => {
    if (!queryParams.has('target')) return
    if (targetAddressRef.current === queryParams.get('target')) return
    dispatch(setMode('target'))

      targetAddressRef.current = queryParams.get('target')
  }, [location])

  // 網址上有地址進來的時候設定target，並且寫入inputValue
  useEffect(() => {
    if (!targetAddressRef.current) return 
    setV(targetAddressRef.current)

    const handleSearch = async () => {
      setValue(targetAddressRef.current, false)
      const results = await getGeocode({ address: targetAddressRef.current })
      //results[0]裡面不會有真的座標資料，要用 getLatLng() 才能取出來
      const { lat, lng } = await getLatLng(results[0])
      //把點選結果的座標存進 target
      dispatch(setTarget({ lat, lng }))
      mapInstance.panTo({ lat, lng })
    }
    handleSearch()
  }, [targetAddressRef.current])


  const onChange = (e) => {
    setV(e.target.value)
    if (!isOnComposition && e.target.value) {
      setValue(e.target.value)
    }
  }
  const handleComposition = (e) => {
    if (e.type === "compositionend") {
      let isOnComposition = false;
      setIsOnComposition(isOnComposition)
      setValue(e.target.value)
      

      if (!isOnComposition && e.target.value) {
      }
    } else {
      setIsOnComposition(true);
    }
  }

  //render推薦清單
  const renderSuggestions = () =>
    data.map((suggestion) => {
      console.log('suggestion', suggestion)
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion
      return (
        <div className='combobox-option' key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </div>
      );
    });

  //點選選項時
  const handleSelect =
    ({ description }) =>
    () => {
      //傳入的 description 為地址
      //這邊要傳入 false，不然建議框不會消失
      setValue(description, false);
      //把地址回傳給Home以更新網址
      targetAddressRef.current = description
      
      // getPlaceResult(description)
      //關掉建議窗
      clearSuggestions();
      //把地址傳進 getGeocode 
      getGeocode({ address: description }).then((results) => {
        //results[0]裡面不會有真的座標資料，要用 getLatLng() 才能取出來
        const { lat, lng } = getLatLng(results[0]);

        //把點選結果的座標存進 target
        dispatch(setMode("target"))
        dispatch(setTarget({ lat, lng }))
        //移動地圖中心至 target
        dispatch(setMapCenter({ lat, lng }))
      })
      navigate(`/map?target=${targetAddressRef.current}`, {push: true})
    }

    const ref = useOnclickOutside(() => {
      clearSuggestions()
    })
    

    useEffect(() => {
      if (status === 'ZERO_RESULTS') {
        console.log('status', status)
      }
    }, [status])

    //value成功存起來後才放進input框
    useEffect(() => {
      if (value) {
        setV(value)
      }
    }, [value])

  return (
    <>
      <div className='combobox' ref={ref}>
        <input 
          value={v}
          type="text"
          onChange={onChange}
          onCompositionStart={handleComposition}
          onCompositionUpdate={handleComposition}
          onCompositionEnd={handleComposition}
          className="combobox-input"
          disabled={!ready}
          placeholder='請輸入地點'
          ></input>
          {status === "OK" && <div className='combobox-pop'>{renderSuggestions()}</div>}
          {status === "ZERO_RESULTS" && <div className='combobox-pop'>      
            <div className='combobox-option' onClick={clearSuggestions}>
              <p>查無目的地資料</p>
            </div>
          </div>}
      </div>
      <button 
        className='combobox-clear'
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setValue('')
          setV('')
          dispatch(setTarget(null))
          dispatch(setMode('screen-mode'))

          navigate(`${location.pathname}`, {push: true})
        }}>
        <img src={cancel} alt='cancel'></img>
      </button>
      <Speech setSpeech={setSpeech}/>
    </>
  )
}