
// app/details.js
import { ScrollView, StatusBar, StyleSheet, Text } from 'react-native';

export default function DetailsPage() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />
      <Text style={styles.title}>App Details</Text>
      <Text style={styles.text}>
        Psychological Hub is a mobile application designed to support mental wellness. 
        Users can book appointments with professionals, read helpful articles, participate in quizzes and workshops, 
        and track their wellness progress in a secure and confidential environment.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#004E64',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#5A5A5E',
    lineHeight: 24,
  },
});
