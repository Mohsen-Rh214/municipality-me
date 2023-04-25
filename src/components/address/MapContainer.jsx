import React, { useState } from "react"

// style
import style from "./address.module.css"

// Mapir
import "mapir-react-component/dist/index.css"
import Mapir from "mapir-react-component"
import { MAP_IR_KEY } from "../../configs/constants"
import itemIcon from "../../assets/svg/modal-item.svg"
import addressMarker from "../../assets/svg/address-marker.svg"

const Map = Mapir.setToken({
  transformRequest: (url) => {
    return {
      url: url,
      headers: {
        "x-api-key": MAP_IR_KEY, //Mapir api key
        "Mapir-SDK": "reactjs",
      },
    }
  },
})

const MapContainer = ({ label, onClick, setGeo }) => {
  const [markerArray, setMarkerArray] = useState([])
  const [coord, setCoord] = useState([56.2992, 27.1916])

  function reverseFunction(map, e) {
    var url = `https://map.ir/reverse/no?lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MAP_IR_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => onClick(data))
    setCoord([e.lngLat.lng, e.lngLat.lat])
    setGeo({ type: "Point", coordinates: [e.lngLat.lng, e.lngLat.lat] })
    const array = []
    array.push(
      <Mapir.Marker
        coordinates={[e.lngLat.lng, e.lngLat.lat]}
        anchor='bottom'
        Image={addressMarker}
      />
    )
    setMarkerArray(array)
  }

  // boundaries for BANDAR ABBAS
  // const bounds = [
  //   { lng: 56.4326, lat: 27.2952 },
  //   { lng: 56.191, lat: 27.1217 },
  // ]
  return (
    <div className={style.wide_field}>
      <p>{label}</p>
      <div className={style.mapContainer}>
        <Mapir
          className={style.mapSize}
          Map={Map}
          zoom={[12]}
          center={coord}
          zoomOnClick={false}
          // fitBounds={bounds}
          onClick={reverseFunction}
        >
          {markerArray}
        </Mapir>
      </div>
    </div>
  )
}

export default MapContainer
