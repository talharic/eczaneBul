import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from './Themed';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen(props: { term: string }) {
  const [location, setLocation] = React.useState({coords:{latitude: 0, longitude: 0}});
  const [markers, setMarkers] = React.useState([]);
  const [pharmacies, setPharmacies] = React.useState([]);
  const {term} = props;

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      var loc = await Location.getCurrentPositionAsync({})
      setLocation(loc);
      if(term.toLowerCase() == "pharmacy" && new Date().getHours() >= 18) { 
        getPharmacyOnDuty(loc.coords.latitude, loc.coords.longitude);
      } else getPlaces(loc.coords.latitude, loc.coords.longitude, term);
    })();
  }, []);

  async function getPharmacyOnDuty(latitude: any, longitude: any){
    let info : any;
    let city : string = '';

    let parameters: any = {
      latlng: `${latitude},${longitude}`,
      key: "AIzaSyBvJdlk21u2NUmvJVHdVNxqOMeZOlOTMpc"
    }
    let url = "https://maps.googleapis.com/maps/api/geocode/json?" + Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join("&");
    await fetch(url).then(res => res.json()).then(data => info = data["results"][0]).catch(error => console.log(error));
    info != undefined &&  info["address_components"].forEach((item : any) =>{
      if(item["types"].includes("administrative_area_level_1")) city = item["long_name"];
    });
    city != '' && fetch(`https://www.nosyapi.com/apiv2/pharmacy?city=${city.toLowerCase()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer VTDG83DOpNx1G6t17bGb8RPREIRJkpB0P9IQyqkPJEdxmcXb9slmMXjTTiGc'
      }
    }).then(res => res.json()).then(data => setPharmacies(data["data"]));
  }

  function getPlaces(latitude: any, longitude: any, keyword: string){
    let parameters: any = {
      location: `${latitude},${longitude}`,
      radius: 5000,
      keyword: keyword,
      key: "AIzaSyBvJdlk21u2NUmvJVHdVNxqOMeZOlOTMpc"
    }
    let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join("&");
    fetch(url).then(res => res.json()).then(data => setMarkers(data.results)).catch(error => console.log(error));
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true} //konumumuzu mavi olarak gösteriyor
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.001,
        }}
      >
        {
          pharmacies.length ?
            pharmacies.map(marker => {
              return <Marker key={`${marker["EczaneAdi"]} - ${marker["Telefon"]}`} title={marker["EczaneAdi"]} coordinate={{latitude: marker["latitude"], longitude: marker["longitude"]}} />
            }) : markers.map(marker => {
              return <Marker key={marker["place_id"]} title={marker["name"]} coordinate={{latitude: marker["geometry"]["location"]["lat"], longitude: marker["geometry"]["location"]["lng"]}} />
            })
        }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
