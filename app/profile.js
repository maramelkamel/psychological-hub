
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../services/supabase';

const { width } = Dimensions.get('window');

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMaritalModal, setShowMaritalModal] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  const maritalOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/');
        return;
      }

      setUser(session.user);

      // Load profile
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(userProfile);
      setEditedProfile(userProfile || {});

      // Load quiz results
      const { data: quizData } = await supabase
        .from('quiz_results')
        .select(`
          *,
          quizzes:quiz_id (title, category)
        `)
        .eq('user_id', session.user.id)
        .order('taken_at', { ascending: false });

      setQuizResults(quizData || []);

      // Load messages
      const { data: messageData } = await supabase
        .from('messages')
        .select('*')
        .eq('from_user_id', session.user.id)
        .order('created_at', { ascending: false });

      setMessages(messageData || []);

      // Load appointments
      const { data: appointmentData } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('appointment_date', { ascending: false });

      setAppointments(appointmentData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...editedProfile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  const renderProfileSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editButton}
        >
          <Ionicons 
            name={isEditing ? "close" : "pencil"} 
            size={20} 
            color="#004E64" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={editedProfile.first_name || ''}
              onChangeText={(text) => setEditedProfile({...editedProfile, first_name: text})}
              editable={isEditing}
              placeholder="Enter first name"
            />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={editedProfile.last_name || ''}
              onChangeText={(text) => setEditedProfile({...editedProfile, last_name: text})}
              editable={isEditing}
              placeholder="Enter last name"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={user?.email || ''}
            editable={false}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Position</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={editedProfile.position || ''}
              onChangeText={(text) => setEditedProfile({...editedProfile, position: text})}
              editable={isEditing}
              placeholder="Enter position"
            />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={editedProfile.department || ''}
              onChangeText={(text) => setEditedProfile({...editedProfile, department: text})}
              editable={isEditing}
              placeholder="Enter department"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Years at Company</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={editedProfile.years_at_company?.toString() || ''}
            onChangeText={(text) => setEditedProfile({...editedProfile, years_at_company: parseInt(text) || 0})}
            editable={isEditing}
            placeholder="Enter years"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Marital Status</Text>
          <TouchableOpacity
            style={[styles.input, !isEditing && styles.inputDisabled]}
            onPress={() => isEditing && setShowMaritalModal(true)}
          >
            <Text style={[styles.inputText, !editedProfile.marital_status && styles.placeholder]}>
              {editedProfile.marital_status ? 
                maritalOptions.find(opt => opt.value === editedProfile.marital_status)?.label : 
                'Select marital status'}
            </Text>
            {isEditing && <Ionicons name="chevron-down" size={20} color="#666" />}
          </TouchableOpacity>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Has Children</Text>
          <Switch
            value={editedProfile.has_children || false}
            onValueChange={(value) => setEditedProfile({...editedProfile, has_children: value})}
            disabled={!isEditing}
            trackColor={{ false: '#E0E0E0', true: '#004E64' }}
          />
        </View>

        {editedProfile.has_children && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of Children</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={editedProfile.number_of_children?.toString() || ''}
              onChangeText={(text) => setEditedProfile({...editedProfile, number_of_children: parseInt(text) || 0})}
              editable={isEditing}
              placeholder="Enter number"
              keyboardType="numeric"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sleep Hours per Night</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={editedProfile.sleep_hours?.toString() || ''}
            onChangeText={(text) => setEditedProfile({...editedProfile, sleep_hours: parseInt(text) || 0})}
            editable={isEditing}
            placeholder="Enter hours"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Well-organized Sleep Schedule</Text>
          <Switch
            value={editedProfile.sleep_well_organized || false}
            onValueChange={(value) => setEditedProfile({...editedProfile, sleep_well_organized: value})}
            disabled={!isEditing}
            trackColor={{ false: '#E0E0E0', true: '#004E64' }}
          />
        </View>

        {/* Health Information */}
        <View style={styles.healthSection}>
          <Text style={styles.healthTitle}>Health Information</Text>
          <Text style={styles.healthNote}>This information is confidential and helps us provide better support</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Has Psychological Disorders</Text>
            <Switch
              value={editedProfile.has_psychological_disorders || false}
              onValueChange={(value) => setEditedProfile({...editedProfile, has_psychological_disorders: value})}
              disabled={!isEditing}
              trackColor={{ false: '#E0E0E0', true: '#004E64' }}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Has Depression History</Text>
            <Switch
              value={editedProfile.has_depression_history || false}
              onValueChange={(value) => setEditedProfile({...editedProfile, has_depression_history: value})}
              disabled={!isEditing}
              trackColor={{ false: '#E0E0E0', true: '#004E64' }}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Takes Medication</Text>
            <Switch
              value={editedProfile.takes_medication || false}
              onValueChange={(value) => setEditedProfile({...editedProfile, takes_medication: value})}
              disabled={!isEditing}
              trackColor={{ false: '#E0E0E0', true: '#004E64' }}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Has Therapy History</Text>
            <Switch
              value={editedProfile.has_therapy_history || false}
              onValueChange={(value) => setEditedProfile({...editedProfile, has_therapy_history: value})}
              disabled={!isEditing}
              trackColor={{ false: '#E0E0E0', true: '#004E64' }}
            />
          </View>
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderQuizResults = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quiz Results</Text>
      {quizResults.length > 0 ? (
        <FlatList
          data={quizResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>{item.quizzes?.title}</Text>
                <Text style={styles.resultDate}>
                  {new Date(item.taken_at).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.resultCategory}>{item.result_category}</Text>
              <Text style={styles.resultScore}>Score: {item.score}</Text>
              {item.recommendations && (
                <Text style={styles.resultRecommendations}>{item.recommendations}</Text>
              )}
            </View>
          )}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="help-circle-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No quiz results yet</Text>
          <Text style={styles.emptySubtext}>Take a quiz to see your results here</Text>
        </View>
      )}
    </View>
  );

  const renderMessages = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>My Messages</Text>
      {messages.length > 0 ? (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageSubject}>{item.subject}</Text>
                <Text style={styles.messageDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.messageContent} numberOfLines={2}>
                {item.message}
              </Text>
              <View style={styles.messageStatus}>
                <Ionicons 
                  name={item.is_read ? "checkmark-circle" : "time"} 
                  size={16} 
                  color={item.is_read ? "#4CAF50" : "#FF9800"} 
                />
                <Text style={styles.messageStatusText}>
                  {item.is_read ? 'Read' : 'Sent'}
                </Text>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="mail-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No messages sent</Text>
          <Text style={styles.emptySubtext}>Your sent messages will appear here</Text>
        </View>
      )}
    </View>
  );

  const renderAppointments = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>My Appointments</Text>
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentDate}>
                  {new Date(item.appointment_date).toLocaleDateString()}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.appointmentTime}>
                {new Date(item.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.appointmentType}>{item.type} session</Text>
              <Text style={styles.appointmentDuration}>{item.duration_minutes} minutes</Text>
              {item.notes && (
                <Text style={styles.appointmentNotes}>{item.notes}</Text>
              )}
            </View>
          )}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No appointments booked</Text>
          <Text style={styles.emptySubtext}>Book an appointment to see it here</Text>
        </View>
      )}
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'scheduled': return '#2196F3';
      case 'cancelled': return '#F44336';
      case 'completed': return '#607D8B';
      default: return '#999';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'profile', label: 'Profile', icon: 'person-outline' },
          { key: 'quizzes', label: 'Quizzes', icon: 'help-circle-outline' },
          { key: 'messages', label: 'Messages', icon: 'mail-outline' },
          { key: 'appointments', label: 'Appointments', icon: 'calendar-outline' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons 
              name={tab.icon} 
              size={16} 
              color={activeTab === tab.key ? '#004E64' : '#999'} 
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'profile' && renderProfileSection()}
        {activeTab === 'quizzes' && renderQuizResults()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'appointments' && renderAppointments()}
      </ScrollView>

      {/* Marital Status Modal */}
      <Modal
        visible={showMaritalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMaritalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Marital Status</Text>
            {maritalOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  setEditedProfile({...editedProfile, marital_status: option.value});
                  setShowMaritalModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowMaritalModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
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
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    color: '#004E64',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#004E64',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E6EEF1',
  },
  tabText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  activeTabText: {
    color: '#004E64',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  editButton: {
    padding: 8,
  },
  formContainer: {
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputHalf: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
  inputText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  placeholder: {
    color: '#999',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  healthSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  healthNote: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#004E64',
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    width: width * 0.8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  modalCancel: {
    padding: 15,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#004E64',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  resultCard: {
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    flex: 1,
  },
  resultDate: {
    fontSize: 12,
    color: '#666',
  },
  resultCategory: {
    fontSize: 14,
    color: '#004E64',
    fontWeight: '600',
    marginBottom: 5,
  },
  resultScore: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resultRecommendations: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  messageCard: {
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    flex: 1,
  },
  messageDate: {
    fontSize: 12,
    color: '#666',
  },
  messageContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageStatusText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  appointmentCard: {
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#004E64',
    fontWeight: '600',
    marginBottom: 5,
  },
  appointmentType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  appointmentDuration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  appointmentNotes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});