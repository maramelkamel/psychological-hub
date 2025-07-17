// app/about.js
import { ScrollView, StatusBar, StyleSheet, Text } from 'react-native';

export default function AboutPage() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />
      <Text style={styles.title}>About Psychological Hub</Text>
      <Text style={styles.text}>
        Psychological Hub is created to provide accessible, confidential, and professional psychological help.
        Whether you're dealing with stress, anxiety, burnout, or just want someone to talk to — we're here for you.
        {'\n\n'}
        Developed by passionate students and mental health advocates, this app bridges the gap between users and psychological care.
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
