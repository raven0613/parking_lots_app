import cancel from '../assets/images/cancel.svg'
import { useFetcher, useLocation, useNavigate } from 'react-router-dom'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import useOnclickOutside from "react-cool-onclickoutside";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"
import "@reach/combobox/styles.css"
import { useEffect, useState, useRef } from 'react'


export default function Place ({ setTarget, speech, getPlaceResult, targetAddressRef, setMode, inputingVal, setInputingVal }) {
  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
      language: 'zh-TW'
    },
    debounce: 300,
  })
  const location = useLocation()
  const navigate = useNavigate()

  const [isOnComposition, setIsOnComposition] = useState(false)


  useEffect(() => {
    const text = speech? speech : ''
    setInputingVal(text)
    setValue(text)
  }, [speech])



  //網址上有地址進來的時候設定target，並且寫入inputValue
  useEffect(() => {
    if (!targetAddressRef.current) return
    setInputingVal(targetAddressRef.current)
    setV(targetAddressRef.current)

    const handleSearch = async () => {
      setValue(targetAddressRef.current, false)
      const results = await getGeocode({ address: targetAddressRef.current })
      //results[0]裡面不會有真的座標資料，要用 getLatLng() 才能取出來
      const { lat, lng } = await getLatLng(results[0])
      //把點選結果的座標存進 target
      setTarget({ lat, lng })
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
      setV(value)
      // setInputingVal(e.target.value)

      if (!isOnComposition && e.target.value) {
        console.log("compositionend", e.target.value);
      }
    } else {
      setIsOnComposition(true);
    }
  }

  //點選選項時
  const renderSuggestions = () =>
    data.map((suggestion) => {
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

  const handleSelect =
    ({ description }) =>
    () => {
      //傳入的 description 為地址
      setInputingVal(description)
      //這邊要傳入 false，不然建議框不會消失
      setValue(description, false);
      //把地址回傳給Home以更新網址
      getPlaceResult(description)
      //關掉建議窗
      clearSuggestions();
      //把地址傳進 getGeocode 
      getGeocode({ address: description }).then((results) => {
        //results[0]裡面不會有真的座標資料，要用 getLatLng() 才能取出來
        const { lat, lng } = getLatLng(results[0]);
        //把點選結果的座標存進 target
        setTarget({ lat, lng })
      })
    }

    const ref = useOnclickOutside(() => {
      clearSuggestions()
    })
    const [v, setV] = useState('')

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
      </div>
      <button 
        className='combobox-clear'
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setInputingVal('')
          setValue('')
          setV('')
          setTarget(null)
          setMode('screen-mode')

          navigate(`${location.pathname}`, {push: true})
        }}>
        <img src={cancel} alt='cancel'></img>
      </button>
    </>


  )
}