
import { Ionicons } from '@expo/vector-icons';


import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../services/supabase';

export default function MessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newMessage, setNewMessage] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.subject.trim() || !newMessage.message.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll send to a default counselor/admin
      // In a real app, you'd have a way to select recipients
      const { error } = await supabase
        .from('messages')
        .insert({
          from_user_id: user.id,
          to_user_id: user.id, // Temporary - would be counselor ID
          subject: newMessage.subject,
          message: newMessage.message,
        });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Message sent successfully!');
        setNewMessage({ subject: '', message: '' });
        setShowComposeModal(false);
        fetchMessages();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading messages...</Text>
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
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={() => setShowComposeModal(true)} style={styles.composeButton}>
          <Ionicons name="create-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
  <TouchableOpacity
    style={styles.actionCard}
    onPress={() => router.push('/details')}
  >
    <Ionicons name="people-outline" size={24} color="#004E64" />
    <Text style={styles.actionText}>Contact Counselor</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionCard}
    onPress={() => router.push('/about')}
  >
    <Ionicons name="business-outline" size={24} color="#004E64" />
    <Text style={styles.actionText}>HR Support</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionCard}
    onPress={() => router.push('/emergency')}
  >
    <Ionicons name="call-outline" size={24} color="#004E64" />
    <Text style={styles.actionText}>Emergency</Text>
  </TouchableOpacity>
</View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Messages List */}
        <View style={styles.messagesSection}>
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-outline" size={64} color="#D3D3D3" />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start a conversation with a counselor</Text>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={() => setShowComposeModal(true)}
              >
                <Text style={styles.startButtonText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          ) : (
            messages.map((message) => (
              <TouchableOpacity key={message.id} style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <View style={styles.messageIcon}>
                    <Ionicons name="person-outline" size={20} color="#004E64" />
                  </View>
                  <View style={styles.messageInfo}>
                    <Text style={styles.messageSubject}>{message.subject}</Text>
                    <Text style={styles.messageDate}>{formatDate(message.created_at)}</Text>
                  </View>
                  {!message.is_read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.messagePreview} numberOfLines={2}>
                  {message.message}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>How confidential are my messages?</Text>
            <Text style={styles.faqAnswer}>
              All messages are completely confidential and only accessible to authorized counselors and HR personnel.
            </Text>
          </View>
          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>When will I receive a response?</Text>
            <Text style={styles.faqAnswer}>
              Most messages are responded to within 24-48 hours during business days.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Ettijari Bank. All rights reserved.</Text>
          <Text style={styles.footerSubtext}>Confidential & Secure</Text>
        </View>
      </ScrollView>

      {/* Compose Modal */}
      <Modal
        visible={showComposeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComposeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <TouchableOpacity onPress={() => setShowComposeModal(false)}>
                <Ionicons name="close" size={24} color="#004E64" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.subjectInput}
              placeholder="Subject"
              value={newMessage.subject}
              onChangeText={(text) => setNewMessage({...newMessage, subject: text})}
            />
            
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              value={newMessage.message}
              onChangeText={(text) => setNewMessage({...newMessage, message: text})}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={sending}
            >
              <Text style={styles.sendButtonText}>
                {sending ? 'Sending...' : 'Send Message'}
              </Text>
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
  composeButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionText: {
    color: '#004E64',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
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
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#004E64',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#E6F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageInfo: {
    flex: 1,
  },
  messageSubject: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  messageDate: {
    fontSize: 12,
    color: '#A9A9AE',
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
  },
  messagePreview: {
    fontSize: 13,
    color: '#5A5A5E',
    lineHeight: 18,
  },
  faqSection: {
    marginBottom: 30,
  },
  faqCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#5A5A5E',
    lineHeight: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subjectInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#004E64',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});