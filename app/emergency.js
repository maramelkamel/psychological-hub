
// app/emergency.js
import { Ionicons } from '@expo/vector-icons';
import { Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EmergencyPage() {
  const emergencyNumber = '190'; // You can replace with local psychological support line

  const callNow = () => {
    Linking.openURL(`tel:${emergencyNumber}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />
      <Ionicons name="alert-circle-outline" size={48} color="#E91E63" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>Emergency Help</Text>
      <Text style={styles.text}>
        If you or someone you know is in danger or needs urgent mental health support, please call the emergency services.
      </Text>
      <TouchableOpacity onPress={callNow} style={styles.callButton}>
        <Ionicons name="call-outline" size={20} color="#FFF" />
        <Text style={styles.callText}>Call {emergencyNumber}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#004E64',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#5A5A5E',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: '#004E64',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    gap: 10,
  },
  callText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
