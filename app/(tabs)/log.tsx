import { Image, View } from 'react-native';
const apiBaseUrl = process.env.EXPO_PUBLIC_BASE_URL;

export default function LogScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* <Text>riski</Text> */}
      <Image
        source={{ uri: `${apiBaseUrl}/users/picture/2` }}
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}
