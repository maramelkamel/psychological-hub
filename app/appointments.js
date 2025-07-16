
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../services/supabase';

const { width } = Dimensions.get('window');

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('individual');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchAppointments();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/');
      return;
    }
    setUser(session.user);
  };

  const fetchAppointments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('appointment_date', { ascending: true });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch appointments');
    }
  };

  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select date and time');
      return;
    }

    setLoading(true);
    try {
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: user.id,
            appointment_date: appointmentDateTime.toISOString(),
            type: selectedType,
            notes: notes,
            status: 'scheduled'
          }
        ]);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Appointment booked successfully!');
        setSelectedDate('');
        setSelectedTime('');
        setNotes('');
        fetchAppointments();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', appointmentId);

              if (error) {
                Alert.alert('Error', error.message);
              } else {
                Alert.alert('Success', 'Appointment cancelled');
                fetchAppointments();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: '#FF9800',
      confirmed: '#4CAF50',
      cancelled: '#F44336',
      completed: '#2196F3',
    };
    return colors[status] || '#607D8B';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const appointmentTypes = [
    { value: 'individual', label: 'Individual Session', icon: 'person-outline' },
    { value: 'group', label: 'Group Session', icon: 'people-outline' },
    { value: 'online', label: 'Online Session', icon: 'videocam-outline' },
    { value: 'in_person', label: 'In-Person', icon: 'location-outline' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Book New Appointment */}
        <View style={styles.bookingSection}>
          <Text style={styles.sectionTitle}>Schedule New Appointment</Text>
          
          {/* Date Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Date</Text>
            <TextInput
              style={styles.input}
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#A9A9AE"
            />
          </View>

          {/* Time Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.timeSlots}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.selectedTimeSlot
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Appointment Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Appointment Type</Text>
            <View style={styles.typeGrid}>
              {appointmentTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeCard,
                    selectedType === type.value && styles.selectedTypeCard
                  ]}
                  onPress={() => setSelectedType(type.value)}
                >
                  <Ionicons 
                    name={type.icon} 
                    size={24} 
                    color={selectedType === type.value ? '#FFF' : '#004E64'} 
                  />
                  <Text style={[
                    styles.typeText,
                    selectedType === type.value && styles.selectedTypeText
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional notes or concerns..."
              placeholderTextColor="#A9A9AE"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.bookButton, loading && styles.disabledButton]}
            onPress={bookAppointment}
            disabled={loading}
          >
            <Text style={styles.bookButtonText}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Existing Appointments */}
        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>My Appointments</Text>
          {appointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#D3D3D3" />
              <Text style={styles.emptyText}>No appointments scheduled</Text>
              <Text style={styles.emptySubtext}>Book your first appointment above</Text>
            </View>
          ) : (
            appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentDate}>
                      {formatDate(appointment.appointment_date)}
                    </Text>
                    <Text style={styles.appointmentTime}>
                      {formatTime(appointment.appointment_date)}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>
                
                <View style={styles.appointmentDetails}>
                  <Text style={styles.appointmentType}>
                    Type: {appointment.type.replace('_', ' ').toUpperCase()}
                  </Text>
                  {appointment.notes && (
                    <Text style={styles.appointmentNotes}>
                      Notes: {appointment.notes}
                    </Text>
                  )}
                </View>

                {appointment.status === 'scheduled' && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelAppointment(appointment.id)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Ettijari Bank. All rights reserved.</Text>
          <Text style={styles.footerSubtext}>Confidential & Secure</Text>
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
  header: {
    backgroundColor: '#004E64',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bookingSection: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#1C1C1E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeSlots: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  timeSlot: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F7F9FC',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTimeSlot: {
    backgroundColor: '#004E64',
    borderColor: '#004E64',
  },
  timeSlotText: {
    color: '#004E64',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedTimeSlotText: {
    color: '#FFF',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeCard: {
    width: (width - 80) / 2,
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTypeCard: {
    backgroundColor: '#004E64',
    borderColor: '#004E64',
  },
  typeText: {
    color: '#004E64',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  selectedTypeText: {
    color: '#FFF',
  },
  bookButton: {
    backgroundColor: '#004E64',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appointmentsSection: {
    marginBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5A5A5E',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A9A9AE',
    marginTop: 5,
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#5A5A5E',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  appointmentDetails: {
    marginBottom: 15,
  },
  appointmentType: {
    fontSize: 14,
    color: '#5A5A5E',
    marginBottom: 5,
  },
  appointmentNotes: {
    fontSize: 14,
    color: '#5A5A5E',
    fontStyle: 'italic',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#5A5A5E',
    fontSize: 12,
    textAlign: 'center',
  },
  footerSubtext: {
    color: '#A9A9AE',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});