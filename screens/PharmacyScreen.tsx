
import * as React from 'react';

import MapScreen from '../components/MapScreen';
import { View } from '../components/Themed';

export default class PharmacyScreen extends React.Component {
  render() {
    return (
      <View>
        <MapScreen term={"pharmacy"} />
      </View>
    );
  }
}