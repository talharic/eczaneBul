import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ navigation }: RootTabScreenProps<'Map'>) {
  const [location, setLocation] = React.useState({coords:{latitude: 0, longitude: 0}});
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      setLocation(await Location.getCurrentPositionAsync({}));
      getPharmacy(location.coords.latitude, location.coords.longitude, "Pharmacy");
    })();
  }, []);
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.001,
        }}
      >
      </MapView>
    </View>
  );
}

function getPharmacy(latitude: any, longitude: any, keyword: string){
  let parameters: any = {
    location: `${latitude},${longitude}`,
    radius: 1500,
    keyword: keyword,
    key: "AIzaSyDiq02ouFmrWs-YCB0QTi4W0pt_BqS1Agw"
  }
  let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join("&");
  console.log(url);
  fetch(url).then(res => res.json()).then(data => console.log(data)).catch(error => console.log(error));
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
