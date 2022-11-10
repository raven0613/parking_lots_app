import cancel from '../assets/images/cancel.svg'
import { useFetcher, useLocation, useNavigate } from 'react-router-dom'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"
import "@reach/combobox/styles.css"
import { useEffect, useState, useRef } from 'react'


export default function Place ({ setTarget, speech, getPlaceResult, targetAddressRef, inputingVal, setInputingVal, setMode }) {
  
  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  })
  const location = useLocation()
  const navigate = useNavigate()

  const inputRef = useRef('')

  useEffect(() => {
    const text = speech? speech : ''
    setInputingVal(text)
    setValue(text)
  }, [speech])

  //網址上有地址進來的時候設定target
  useEffect(() => {
    if (!targetAddressRef.current) return
    setInputingVal(targetAddressRef.current)

    const handleSelect = async () => {
      setValue(targetAddressRef.current, false)
      const results = await getGeocode({ address: targetAddressRef.current })
      //results[0]裡面不會有真的座標資料，要用 getLatLng() 才能取出來
      const { lat, lng } = await getLatLng(results[0])
      //把點選結果的座標存進 target
      setTarget({ lat, lng })
    }
    
    handleSelect()
  }, [targetAddressRef.current])

  const [isOnComposition, setIsOnComposition] = useState(false)

  //點選選項時
  const handleSelect = async (val) => {
    //傳入的 val 為地址
    //這邊要傳入 false，不然建議框不會消失
    setValue(val, false)
    //關掉建議窗
    clearSuggestions()  
    //把地址傳進 getGeocode 
    const results = await getGeocode({ address: val })
    //results[0]裡面不會有真的座標資料，要用 getLatLng() 才能取出來
    console.log(results)
    const { lat, lng } = await getLatLng(results[0])
    //把點選結果的座標存進 target
    setTarget({ lat, lng })
    
    //把值傳回去給map
    getPlaceResult(val)
  }
  

  const handleComposition = (e) => {
    console.log('type', e.type)
    if (e.type === 'compositionend') {
      setIsOnComposition(false)
      if (!isOnComposition) {
        setValue(e.target.value)
      }
    } else {
      setIsOnComposition(true)
    }
  }


  const handleChange = event => {
    console.log("handleChange");
    if(isOnComposition) return
    // inputRef.current = event.target.value
    // setInputingVal(event.target.value)
    // handleCompsition(event);

    console.log(event.target)
    setValue(event.target.value)
  }
  // useEffect(() => {  
  //   inputRef.current = value 
  // }, [value])
  


  const handleInput = e => {
    console.log(e.target)
    setValue(e.target.value);
  };

  return (
    <>
      {/* <input 
        value={value}
        type="text"
        onChange={(e) => {handleChange(e)}}
        className="combobox"
        disabled={!ready}
        placeholder='請輸入地點'
        ></input>
        {status === "OK" && <ul>{renderSuggestions()}</ul>} */}

      <Combobox className='combobox' onSelect={ handleSelect }>
        <ComboboxInput 
        value={value} 
        onChange={handleInput}
        onCompositionStart={handleComposition}
        onCompositionUpdate={handleComposition}
        onCompositionEnd={handleComposition}
        // onChange={e => setValue(e.target.value)} 
        // onChange={handleChange} 
        disabled={!ready}
        className="combobox-input" 
        placeholder='請輸入地點'/>
        <ComboboxPopover className='combobox-pop'>
          <ComboboxList className=''>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={ place_id } value={ description } className='combobox-option'/>
              ))
            }
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <button 
        className='combobox-clear'
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setInputingVal('')
          setValue('')
          setTarget(null)
          setMode('screen-mode')
          navigate(`${location.pathname}`, {push: true})
        }}>
        <img src={cancel} alt='cancel'></img>
      </button>
    </>


  )
}