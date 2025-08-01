// app/admin/index.js

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../services/supabase';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('workshops');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Workshop states
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [workshopRegistrations, setWorkshopRegistrations] = useState([]);
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [showAddWorkshopModal, setShowAddWorkshopModal] = useState(false);
  
  // New workshop form states
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    description: '',
    category: 'mental_stability',
    max_participants: '',
    start_date: '',
    end_date: '',
  });
  
  // Messages states
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // Appointments states
  const [appointments, setAppointments] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin, activeTab]);

  const checkAdminAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/login');
        return;
      }

      setUser(session.user);

      // Check if user is admin
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !adminData) {
        Alert.alert('Access Denied', 'You do not have admin privileges');
        router.replace('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to verify admin access');
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      if (activeTab === 'workshops') {
        await fetchWorkshops();
      } else if (activeTab === 'messages') {
        await fetchMessages();
      } else if (activeTab === 'appointments') {
        await fetchAppointments();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Workshop functions
  const fetchWorkshops = async () => {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setWorkshops(data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch workshops');
    }
  };

  const fetchWorkshopRegistrations = async (workshopId) => {
    try {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .select(`
          *,
          user_profiles (
            first_name,
            last_name,
            email,
            position,
            department
          )
        `)
        .eq('workshop_id', workshopId);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setWorkshopRegistrations(data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch registrations');
    }
  };

  const addWorkshop = async () => {
    if (!newWorkshop.title || !newWorkshop.description || !newWorkshop.max_participants) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('workshops')
        .insert([{
          title: newWorkshop.title,
          description: newWorkshop.description,
          category: newWorkshop.category,
          max_participants: parseInt(newWorkshop.max_participants),
          start_date: newWorkshop.start_date || null,
          end_date: newWorkshop.end_date || null,
        }]);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Workshop added successfully');
        setShowAddWorkshopModal(false);
        setNewWorkshop({
          title: '',
          description: '',
          category: 'mental_stability',
          max_participants: '',
          start_date: '',
          end_date: '',
        });
        fetchWorkshops();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add workshop');
    }
  };

  const deleteWorkshop = async (workshopId) => {
    Alert.alert(
      'Delete Workshop',
      'Are you sure you want to delete this workshop? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('workshops')
                .delete()
                .eq('id', workshopId);

              if (error) {
                Alert.alert('Error', error.message);
              } else {
                Alert.alert('Success', 'Workshop deleted successfully');
                fetchWorkshops();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete workshop');
            }
          },
        },
      ]
    );
  };

  // Messages functions
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          from_user:user_profiles!from_user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch messages');
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        fetchMessages();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to mark message as read');
    }
  };

  const replyToMessage = async () => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Please enter a reply message');
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          from_user_id: user.id,
          to_user_id: selectedMessage.from_user_id,
          subject: `Re: ${selectedMessage.subject}`,
          message: replyText,
        }]);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Reply sent successfully');
        setReplyText('');
        setShowMessageModal(false);
        await markMessageAsRead(selectedMessage.id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send reply');
    }
  };

  // Appointments functions
  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          user_profiles (
            first_name,
            last_name,
            email,
            position,
            department
          )
        `)
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

  // Utility functions
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

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: '#FF9800',
      confirmed: '#4CAF50',
      cancelled: '#F44336',
      completed: '#2196F3',
      pending: '#9C27B0',
    };
    return colors[status] || '#607D8B';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Verifying admin access...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Access Denied</Text>
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
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileButton}>
          <Ionicons name="person" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'workshops' && styles.activeTab]}
          onPress={() => setActiveTab('workshops')}
        >
          <Ionicons name="school-outline" size={20} color={activeTab === 'workshops' ? '#004E64' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'workshops' && styles.activeTabText]}>
            Workshops
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Ionicons name="mail-outline" size={20} color={activeTab === 'messages' ? '#004E64' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
            Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'appointments' && styles.activeTab]}
          onPress={() => setActiveTab('appointments')}
        >
          <Ionicons name="calendar-outline" size={20} color={activeTab === 'appointments' ? '#004E64' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'appointments' && styles.activeTabText]}>
            Appointments
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Workshops Tab */}
        {activeTab === 'workshops' && (
          <View style={styles.tabContent}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manage Workshops</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddWorkshopModal(true)}
              >
                <Ionicons name="add" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Add Workshop</Text>
              </TouchableOpacity>
            </View>

            {workshops.map((workshop) => (
              <View key={workshop.id} style={styles.workshopCard}>
                <View style={styles.workshopHeader}>
                  <View style={styles.workshopInfo}>
                    <Text style={styles.workshopTitle}>{workshop.title}</Text>
                    <Text style={styles.workshopCategory}>
                      {formatCategory(workshop.category)}
                    </Text>
                    <Text style={styles.workshopDate}>
                      Start: {formatDate(workshop.start_date)}
                    </Text>
                  </View>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(workshop.category) }]}>
                    <Text style={styles.categoryBadgeText}>
                      {workshop.current_participants || 0}/{workshop.max_participants}
                    </Text>
                  </View>
                </View>

                <Text style={styles.workshopDescription} numberOfLines={2}>
                  {workshop.description}
                </Text>

                <View style={styles.workshopActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={async () => {
                      setSelectedWorkshop(workshop);
                      await fetchWorkshopRegistrations(workshop.id);
                      setShowRegistrationsModal(true);
                    }}
                  >
                    <Ionicons name="people-outline" size={16} color="#004E64" />
                    <Text style={styles.actionButtonText}>View Registrations</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteWorkshop(workshop.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#F44336" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Messages</Text>
            {messages.map((message) => (
              <TouchableOpacity
                key={message.id}
                style={[styles.messageCard, !message.is_read && styles.unreadMessage]}
                onPress={() => {
                  setSelectedMessage(message);
                  setShowMessageModal(true);
                }}
              >
                <View style={styles.messageHeader}>
                  <Text style={styles.messageSender}>
                    {message.from_user?.first_name} {message.from_user?.last_name}
                  </Text>
                  <Text style={styles.messageDate}>
                    {formatDateTime(message.created_at)}
                  </Text>
                </View>
                <Text style={styles.messageSubject}>{message.subject}</Text>
                <Text style={styles.messagePreview} numberOfLines={2}>
                  {message.message}
                </Text>
                {!message.is_read && (
                  <View style={styles.unreadIndicator}>
                    <Text style={styles.unreadText}>New</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Appointments</Text>
            {appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentUser}>
                      {appointment.user_profiles?.first_name} {appointment.user_profiles?.last_name}
                    </Text>
                    <Text style={styles.appointmentEmail}>
                      {appointment.user_profiles?.email}
                    </Text>
                    <Text style={styles.appointmentDepartment}>
                      {appointment.user_profiles?.position} - {appointment.user_profiles?.department}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>

                <View style={styles.appointmentDetails}>
                  <Text style={styles.appointmentDate}>
                    {formatDateTime(appointment.appointment_date)}
                  </Text>
                  <Text style={styles.appointmentType}>
                    Type: {appointment.type?.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.appointmentDuration}>
                    Duration: {appointment.duration_minutes} minutes
                  </Text>
                  {appointment.notes && (
                    <Text style={styles.appointmentNotes}>
                      Notes: {appointment.notes}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Workshop Modal */}
      <Modal
        visible={showAddWorkshopModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddWorkshopModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Workshop</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Workshop Title *"
              value={newWorkshop.title}
              onChangeText={(text) => setNewWorkshop({...newWorkshop, title: text})}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description *"
              value={newWorkshop.description}
              onChangeText={(text) => setNewWorkshop({...newWorkshop, description: text})}
              multiline
              numberOfLines={4}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Category:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['mental_stability', 'soft_skills', 'stress_management', 'time_management', 'public_speaking'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      newWorkshop.category === category && styles.selectedCategoryOption
                    ]}
                    onPress={() => setNewWorkshop({...newWorkshop, category})}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      newWorkshop.category === category && styles.selectedCategoryOptionText
                    ]}>
                      {formatCategory(category)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Max Participants *"
              value={newWorkshop.max_participants}
              onChangeText={(text) => setNewWorkshop({...newWorkshop, max_participants: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Start Date (YYYY-MM-DD HH:MM)"
              value={newWorkshop.start_date}
              onChangeText={(text) => setNewWorkshop({...newWorkshop, start_date: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="End Date (YYYY-MM-DD HH:MM)"
              value={newWorkshop.end_date}
              onChangeText={(text) => setNewWorkshop({...newWorkshop, end_date: text})}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={addWorkshop}
              >
                <Text style={styles.submitButtonText}>Add Workshop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddWorkshopModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Workshop Registrations Modal */}
      <Modal
        visible={showRegistrationsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRegistrationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Registrations for "{selectedWorkshop?.title}"
            </Text>
            <ScrollView style={styles.registrationsList}>
              {workshopRegistrations.map((registration) => (
                <View key={registration.id} style={styles.registrationCard}>
                  <Text style={styles.registrationName}>
                    {registration.user_profiles?.first_name} {registration.user_profiles?.last_name}
                  </Text>
                  <Text style={styles.registrationEmail}>
                    {registration.user_profiles?.email}
                  </Text>
                  <Text style={styles.registrationDepartment}>
                    {registration.user_profiles?.position} - {registration.user_profiles?.department}
                  </Text>
                  <Text style={styles.registrationDate}>
                    Registered: {formatDate(registration.registration_date)}
                  </Text>
                  <View style={[styles.registrationStatus, { backgroundColor: getStatusColor(registration.status) }]}>
                    <Text style={styles.registrationStatusText}>{registration.status}</Text>
                  </View>
                  {registration.notes && (
                    <Text style={styles.registrationNotes}>Notes: {registration.notes}</Text>
                  )}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRegistrationsModal(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Message Reply Modal */}
      <Modal
        visible={showMessageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Message Details</Text>
            {selectedMessage && (
              <>
                <View style={styles.messageDetails}>
                  <Text style={styles.messageDetailLabel}>From:</Text>
                  <Text style={styles.messageDetailText}>
                    {selectedMessage.from_user?.first_name} {selectedMessage.from_user?.last_name}
                  </Text>
                  <Text style={styles.messageDetailText}>
                    {selectedMessage.from_user?.email}
                  </Text>
                  
                  <Text style={styles.messageDetailLabel}>Subject:</Text>
                  <Text style={styles.messageDetailText}>{selectedMessage.subject}</Text>
                  
                  <Text style={styles.messageDetailLabel}>Message:</Text>
                  <Text style={styles.messageDetailText}>{selectedMessage.message}</Text>
                  
                  <Text style={styles.messageDetailLabel}>Date:</Text>
                  <Text style={styles.messageDetailText}>
                    {formatDateTime(selectedMessage.created_at)}
                  </Text>
                </View>
                
                <Text style={styles.inputLabel}>Reply:</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Type your reply..."
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                  numberOfLines={4}
                />
              </>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={replyToMessage}
              >
                <Text style={styles.submitButtonText}>Send Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  if (selectedMessage && !selectedMessage.is_read) {
                    markMessageAsRead(selectedMessage.id);
                  }
                  setShowMessageModal(false);
                  setReplyText('');
                }}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: 16,
    color: '#666',
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
  profileButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
    borderBottomWidth: 3,
    borderBottomColor: '#004E64',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#004E64',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004E64',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  workshopCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  workshopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  workshopInfo: {
    flex: 1,
  },
  workshopTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  workshopCategory: {
    fontSize: 14,
    color: '#666',  },
  workshopDate: {
    fontSize: 12,
    color: '#888',
  },
  categoryBadge: {
    backgroundColor: '#EEE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  workshopDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  workshopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    padding: 8,
    borderRadius: 10,
  },
  actionButtonText: {
    marginLeft: 6,
    color: '#004E64',
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 10,
  },
  deleteButtonText: {
    marginLeft: 6,
    color: '#F44336',
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  unreadMessage: {
    borderColor: '#004E64',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  messageSender: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  messageDate: {
    fontSize: 12,
    color: '#888',
  },
  messageSubject: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 13,
    color: '#555',
  },
  unreadIndicator: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#004E64',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadText: {
    fontSize: 10,
    color: '#FFF',
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#004E64',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentUser: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  appointmentEmail: {
    fontSize: 13,
    color: '#555',
  },
  appointmentDepartment: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  appointmentDetails: {
    marginTop: 10,
  },
  appointmentDate: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 13,
    color: '#666',
  },
  appointmentDuration: {
    fontSize: 13,
    color: '#666',
  },
  appointmentNotes: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#004E64',
  },
  input: {
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontWeight: '600',
    marginBottom: 6,
  },
  categoryOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#EEE',
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryOption: {
    backgroundColor: '#004E64',
  },
  categoryOptionText: {
    fontSize: 13,
    color: '#555',
  },
  selectedCategoryOptionText: {
    color: '#FFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  submitButton: {
    backgroundColor: '#004E64',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#DDD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  registrationsList: {
    marginTop: 10,
  },
  registrationCard: {
    backgroundColor: '#F7F9FC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  registrationName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  registrationEmail: {
    fontSize: 13,
    color: '#555',
  },
  registrationDepartment: {
    fontSize: 12,
    color: '#777',
  },
  registrationDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  registrationStatus: {
    marginTop: 5,
    padding: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  registrationStatusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  registrationNotes: {
    marginTop: 5,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
  },
  messageDetails: {
    marginBottom: 15,
  },
  messageDetailLabel: {
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  messageDetailText: {
    fontSize: 13,
    color: '#555',
  },
});
