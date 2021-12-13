import * as React from 'react';
import { StyleSheet, ViewProperties } from 'react-native';

import { View } from './Themed';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

type Props = {
  term: string
}

export default class MapScreen extends React.Component<Props> {
  constructor(arg: any){
    super(arg);
    this.state = {
      location: {coords:{latitude: 0, longitude: 0}},
      markers: [],
    }
  }

  getPlaces(latitude: any, longitude: any, keyword: string){
    let parameters: any = {
      location: `${latitude},${longitude}`, //konumumuz
      radius: 1500, // arama çapı
      keyword: keyword, //neyi aradığımız
      key: "AIzaSyBvJdlk21u2NUmvJVHdVNxqOMeZOlOTMpc"
    }
    let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join("&");
    fetch(url).then(res => res.json()).then(data => this.setState(data.results)).catch(error => console.log(error));
  }

  render() {
    const { location, markers } = this.state;
    React.useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        var loc = await Location.getCurrentPositionAsync({})
        this.setState(loc);
        this.getPlaces(loc.coords.latitude, loc.coords.longitude, this.props.term);
      })();
    }, []);
    return (
      <View style={styles.container}>
        <MapView //harita competenti
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true} //konumumuzu mavi olarak gösteriyor
          region={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.001,
          }}
        >
          {
            this.state.markers.map(marker => {
              return <Marker title={marker["name"]} coordinate={{latitude: marker["geometry"]["location"]["lat"], longitude: marker["geometry"]["location"]["lng"]}} />
            })
          }
        </MapView>
      </View>
    );
  }
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
