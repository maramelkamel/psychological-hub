import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../services/supabase';

const { width } = Dimensions.get('window');

export default function WorkshopsScreen() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationNotes, setRegistrationNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setWorkshops(data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch workshops');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!selectedWorkshop) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'Please log in to register');
        return;
      }

      const { error } = await supabase
        .from('workshop_registrations')
        .insert({
          workshop_id: selectedWorkshop.id,
          user_id: user.id,
          notes: registrationNotes,
        });

      if (error) {
        if (error.code === '23505') {
          Alert.alert('Already Registered', 'You are already registered for this workshop');
        } else {
          Alert.alert('Error', error.message);
        }
      } else {
        Alert.alert('Success', 'Registration submitted successfully!');
        setShowRegistrationModal(false);
        setRegistrationNotes('');
        setSelectedWorkshop(null);
        fetchWorkshops(); // Refresh the list
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register for workshop');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      mental_stability: '#4CAF50',
      soft_skills: '#2196F3',
      stress_management: '#FF9800',
      time_management: '#9C27B0',
      public_speaking: '#E91E63',
    };
    return colors[category] || '#607D8B';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      mental_stability: 'heart-outline',
      soft_skills: 'people-outline',
      stress_management: 'leaf-outline',
      time_management: 'time-outline',
      public_speaking: 'mic-outline',
    };
    return icons[category] || 'school-outline';
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading workshops...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness Workshops</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color="#004E64" />
            <Text style={styles.infoText}>
              Join our workshops to develop skills for mental stability, stress management, and workplace success.
            </Text>
          </View>
        </View>

        {/* Workshops List */}
        <View style={styles.workshopsList}>
          {workshops.map((workshop) => (
            <TouchableOpacity
              key={workshop.id}
              style={[styles.workshopCard, { borderLeftColor: getCategoryColor(workshop.category) }]}
              onPress={() => {
                setSelectedWorkshop(workshop);
                setShowRegistrationModal(true);
              }}
            >
              <View style={styles.workshopHeader}>
                <Ionicons
                  name={getCategoryIcon(workshop.category)}
                  size={24}
                  color={getCategoryColor(workshop.category)}
                  style={styles.workshopIcon}
                />
                <Text style={styles.workshopTitle}>{workshop.title}</Text>
              </View>
              <Text style={styles.workshopDate}>{formatDate(workshop.start_date)}</Text>
              <Text style={styles.workshopCategory}>{formatCategory(workshop.category)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Registration Modal */}
      <Modal
        visible={showRegistrationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRegistrationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Register for {selectedWorkshop?.title}</Text>
            <TextInput
              placeholder="Any notes or preferences?"
              value={registrationNotes}
              onChangeText={setRegistrationNotes}
              style={styles.input}
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegistration}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowRegistrationModal(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004E64',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 24, // To balance the back button
  },
  content: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#004E64',
    flex: 1,
  },
  workshopsList: {
    gap: 12,
  },
  workshopCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    elevation: 3,
  },
  workshopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  workshopIcon: {
    marginRight: 8,
  },
  workshopTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workshopDate: {
    fontSize: 14,
    color: '#666',
  },
  workshopCategory: {
    fontSize: 13,
    color: '#999',
    marginTop: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '85%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#004E64',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#004E64',
    textAlign: 'center',
  },
});
