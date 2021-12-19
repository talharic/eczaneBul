import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from './Themed';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen(props: { term: string }) {
  const [location, setLocation] = React.useState({coords:{latitude: 0, longitude: 0}});
  const [markers, setMarkers] = React.useState([]);
  const {term} = props;

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      var loc = await Location.getCurrentPositionAsync({})
      setLocation(loc);
      getPlaces(loc.coords.latitude, loc.coords.longitude, term);
    })();
  }, []);

  function getPlaces(latitude: any, longitude: any, keyword: string){
    let parameters: any = {
      location: `${latitude},${longitude}`, //konumumuz
      radius: 1500, // arama çapı
      keyword: keyword, //neyi aradığımız
      key: "AIzaSyBvJdlk21u2NUmvJVHdVNxqOMeZOlOTMpc"
    }
    let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join("&");
    fetch(url).then(res => res.json()).then(data => setMarkers(data.results)).catch(error => console.log(error));
  }

  return (
    <View style={styles.container}>
      <MapView //harita competenti
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
          markers.map(marker => {
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
