import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function Emergency() {
  const router = useRouter();
  const [expandedCard, setExpandedCard] = useState(null);

  const emergencyContacts = [
    {
      id: 1,
      title: 'Crisis Hotline',
      number: '197',
      description: 'National Crisis Intervention Hotline',
      available: '24/7',
      color: '#E53E3E',
      icon: 'call',
    },
    {
      id: 2,
      title: 'Emergency Services',
      number: '190',
      description: 'Police, Fire, Medical Emergency',
      available: '24/7',
      color: '#D53F8C',
      icon: 'medical',
    },
    {
      id: 3,
      title: 'Mental Health Crisis',
      number: '+216 71 560 300',
      description: 'Professional Mental Health Support',
      available: 'Mon-Fri 8AM-6PM',
      color: '#9F7AEA',
      icon: 'heart',
    },
    {
      id: 4,
      title: 'Employee Assistance',
      number: '+216 71 123 456',
      description: 'Ettijari Bank Employee Support',
      available: 'Mon-Fri 9AM-5PM',
      color: '#4299E1',
      icon: 'business',
    },
  ];

  const emergencyTips = [
    {
      title: 'If you\'re having suicidal thoughts',
      steps: [
        'Call the crisis hotline immediately (197)',
        'Stay with someone you trust',
        'Remove any means of self-harm',
        'Go to the nearest emergency room',
        'Remember: This feeling is temporary'
      ],
      color: '#E53E3E',
      icon: 'shield-checkmark',
    },
    {
      title: 'If you\'re experiencing panic attacks',
      steps: [
        'Focus on your breathing (4-7-8 technique)',
        'Ground yourself using 5-4-3-2-1 method',
        'Find a quiet, safe space',
        'Call a trusted friend or family member',
        'Consider professional help if frequent'
      ],
      color: '#4299E1',
      icon: 'leaf',
    },
    {
      title: 'If a colleague needs help',
      steps: [
        'Listen without judgment',
        'Encourage them to seek professional help',
        'Offer to accompany them to get help',
        'Follow up regularly',
        'Know your limits - you\'re not a therapist'
      ],
      color: '#38A169',
      icon: 'people',
    },
  ];

  const handleCall = (number) => {
    Alert.alert(
      'Emergency Call',
      `Call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          },
        },
      ]
    );
  };

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Support</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Crisis Warning Banner */}
      <View style={styles.warningBanner}>
        <Ionicons name="warning" size={20} color="#E53E3E" />
        <Text style={styles.warningText}>
          If this is a life-threatening emergency, call 190 immediately
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <Text style={styles.sectionSubtitle}>
            Immediate help is available 24/7
          </Text>
          
          {emergencyContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactCard, { borderLeftColor: contact.color }]}
              onPress={() => handleCall(contact.number)}
            >
              <View style={styles.contactHeader}>
                <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
                  <Ionicons name={contact.icon} size={24} color="#FFF" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{contact.title}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                  <Text style={styles.contactDescription}>{contact.description}</Text>
                </View>
                <View style={styles.contactAction}>
                  <Ionicons name="call" size={20} color={contact.color} />
                  <Text style={[styles.contactAvailable, { color: contact.color }]}>
                    {contact.available}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Response Guide</Text>
          <Text style={styles.sectionSubtitle}>
            Quick actions to take in crisis situations
          </Text>
          
          {emergencyTips.map((tip) => (
            <TouchableOpacity
              key={tip.title}
              style={[styles.tipCard, expandedCard === tip.title && styles.expandedCard]}
              onPress={() => toggleCard(tip.title)}
            >
              <View style={styles.tipHeader}>
                <View style={[styles.tipIcon, { backgroundColor: tip.color }]}>
                  <Ionicons name={tip.icon} size={20} color="#FFF" />
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Ionicons 
                  name={expandedCard === tip.title ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#5A5A5E" 
                />
              </View>
              
              {expandedCard === tip.title && (
                <View style={styles.tipContent}>
                  {tip.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={[styles.stepNumber, { backgroundColor: tip.color }]}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          
          <Link href="/messages" asChild>
            <TouchableOpacity style={styles.resourceCard}>
              <View style={[styles.resourceIcon, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="mail-outline" size={24} color="#FFF" />
              </View>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Contact Counselors</Text>
                <Text style={styles.resourceDescription}>
                  Send a message to our professional counselors
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#5A5A5E" />
            </TouchableOpacity>
          </Link>

          <Link href="/appointments" asChild>
            <TouchableOpacity style={styles.resourceCard}>
              <View style={[styles.resourceIcon, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="calendar-outline" size={24} color="#FFF" />
              </View>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>Book Urgent Appointment</Text>
                <Text style={styles.resourceDescription}>
                  Schedule an emergency counseling session
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#5A5A5E" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your safety and well-being are our top priority
          </Text>
          <Text style={styles.footerSubtext}>
            All communications are confidential and secure
          </Text>
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
  },
  headerContent: {
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
  warningBanner: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#E53E3E',
  },
  warningText: {
    color: '#E53E3E',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#5A5A5E',
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004E64',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: '#5A5A5E',
  },
  contactAction: {
    alignItems: 'center',
  },
  contactAvailable: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  tipCard: {
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
  expandedCard: {
    paddingBottom: 25,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  tipContent: {
    marginTop: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
  },
  resourceCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resourceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#5A5A5E',
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#5A5A5E',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#A9A9AE',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});