import cancel from '../assets/images/cancel.svg'
import { useLocation, useNavigate } from 'react-router-dom'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"
import "@reach/combobox/styles.css"
import { useEffect } from 'react'


export default function Place ({ setTarget, speech, getPlaceResult, targetAddressRef, inputingVal, setInputingVal, setMode }) {
  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete()
  const location = useLocation()
  const navigate = useNavigate()

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

  // const [isOnComposition, setIsOnComposition] = useState(false);

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
  
  // const [isInputing, setIsInputing] = useState(false)

  // const handleCompsition = (event) => {
  //   const { type } = event
  //   console.log(type)

  //   if (type === 'compositionstart') {
  //     setIsInputing(true)
  //   }
  //   else if (type === 'compositionupdate') {
  //   }
  //   else if (type === 'compositionend') {
  //     setIsInputing(false)
  //     setInputingVal(event.target.value)
  //   }
  //   else if (type === 'change') {
  //     if (!isInputing) {
  //       setInputingVal(event.target.value)
  //     }
  //   }
  // }
  const handleChange = event => {
    console.log("handleChange");
    setInputingVal(' ' + event.target.value)
    // handleCompsition(event);
  }
  

  return (
    <>
      <Combobox className='combobox' onSelect={ handleSelect }>
        <ComboboxInput 
        value={inputingVal} 
        // onCompositionStart={handleCompsition}
        // onCompositionUpdate={handleCompsition}
        onCompositionEnd={() => setValue(inputingVal)}
        // onChange={e => setValue(e.target.value)} 
        onChange={handleChange} 
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