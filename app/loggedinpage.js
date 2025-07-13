
// app/loggedinpage.js
import { StyleSheet, Text, View } from 'react-native';

export default function LoggedInPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>✅ You are logged in!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#C41E3A',
    fontWeight: 'bold',
  },
});
