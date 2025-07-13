import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../services/supabase';

export default function ProfileSetupScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    yearsAtCompany: '',
    hasPsychologicalDisorders: false,
    hasDepressionHistory: false,
    takesMedication: false,
    hasTherapyHistory: false,
    maritalStatus: 'single',
    hasChildren: false,
    numberOfChildren: '0',
    sleepHours: '',
    sleepWellOrganized: false,
  });

  const router = useRouter();

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.position || !formData.department) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data: user } = await supabase.auth.getUser();

      if (!user?.user) {
        Alert.alert('Error', 'Please log in first');
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('user_profiles').upsert({
        id: user.user.id,
        email: user.user.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        position: formData.position,
        department: formData.department,
        years_at_company: parseInt(formData.yearsAtCompany) || 0,
        has_psychological_disorders: formData.hasPsychologicalDisorders,
        has_depression_history: formData.hasDepressionHistory,
        takes_medication: formData.takesMedication,
        has_therapy_history: formData.hasTherapyHistory,
        marital_status: formData.maritalStatus,
        has_children: formData.hasChildren,
        number_of_children: parseInt(formData.numberOfChildren) || 0,
        sleep_hours: parseInt(formData.sleepHours) || 0,
        sleep_well_organized: formData.sleepWellOrganized,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success!', 'Profile created successfully!', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Help us personalize your experience</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          {[
            { key: 'firstName', icon: 'person-outline', placeholder: 'First Name *' },
            { key: 'lastName', icon: 'person-outline', placeholder: 'Last Name *' },
            { key: 'position', icon: 'briefcase-outline', placeholder: 'Position *' },
            { key: 'department', icon: 'business-outline', placeholder: 'Department *' },
            { key: 'yearsAtCompany', icon: 'calendar-outline', placeholder: 'Years at Ettijari', keyboard: 'numeric' },
          ].map(({ key, icon, placeholder, keyboard }) => (
            <View style={styles.inputWrapper} key={key}>
              <Ionicons name={icon} size={20} color="#004E64" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={formData[key]}
                onChangeText={(text) => updateFormData(key, text)}
                keyboardType={keyboard || 'default'}
              />
            </View>
          ))}

          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.pickerWrapper}>
            <Ionicons name="heart-outline" size={20} color="#004E64" style={styles.inputIcon} />
            <Picker
              selectedValue={formData.maritalStatus}
              onValueChange={(value) => updateFormData('maritalStatus', value)}
              style={styles.picker}
            >
              <Picker.Item label="Single" value="single" />
              <Picker.Item label="Married" value="married" />
              <Picker.Item label="Divorced" value="divorced" />
              <Picker.Item label="Widowed" value="widowed" />
            </Picker>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Do you have children?</Text>
            <Switch
              value={formData.hasChildren}
              onValueChange={(value) => updateFormData('hasChildren', value)}
              trackColor={{ false: '#ccc', true: '#004E64' }}
              thumbColor={formData.hasChildren ? '#fff' : '#f4f3f4'}
            />
          </View>

          {formData.hasChildren && (
            <View style={styles.inputWrapper}>
              <Ionicons name="people-outline" size={20} color="#004E64" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Number of children"
                placeholderTextColor="#999"
                value={formData.numberOfChildren}
                onChangeText={(text) => updateFormData('numberOfChildren', text)}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Ionicons name="moon-outline" size={20} color="#004E64" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Hours of sleep per night"
              placeholderTextColor="#999"
              value={formData.sleepHours}
              onChangeText={(text) => updateFormData('sleepHours', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Is your sleep well organized?</Text>
            <Switch
              value={formData.sleepWellOrganized}
              onValueChange={(value) => updateFormData('sleepWellOrganized', value)}
              trackColor={{ false: '#ccc', true: '#004E64' }}
              thumbColor={formData.sleepWellOrganized ? '#fff' : '#f4f3f4'}
            />
          </View>

          <Text style={styles.sectionTitle}>Mental Health (Optional)</Text>

          {[
            { key: 'hasPsychologicalDisorders', label: 'Do you have any psychological disorders?' },
            { key: 'hasDepressionHistory', label: 'Have you experienced depression?' },
            { key: 'takesMedication', label: 'Do you take medication?' },
            { key: 'hasTherapyHistory', label: 'Have you been to therapy before?' },
          ].map(({ key, label }) => (
            <View key={key} style={styles.switchContainer}>
              <Text style={styles.switchLabel}>{label}</Text>
              <Switch
                value={formData[key]}
                onValueChange={(value) => updateFormData(key, value)}
                trackColor={{ false: '#ccc', true: '#004E64' }}
                thumbColor={formData[key] ? '#fff' : '#f4f3f4'}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Complete Profile'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004E64',
  },
  subtitle: {
    fontSize: 14,
    color: '#5A5A5E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#004E64',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D9E2EC',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#1C1C1E',
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D9E2EC',
  },
  picker: {
    flex: 1,
    height: 44,
    ...Platform.select({ android: { color: '#000' } }),
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 15,
    flex: 1,
    color: '#333',
    paddingRight: 10,
  },
  saveButton: {
    backgroundColor: '#004E64',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#A9A9AE',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
