// app/admin/index.js
import { StyleSheet, Text, View } from 'react-native';

export default function AdminPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>
      {/* Add admin-specific UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold' },
});
