import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
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

export default function HRSupportPage() {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL('mailto:hr@psychhub.org');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+21671000000');
  };

  const supportOptions = [
    {
      title: 'Email Support',
      icon: 'mail-outline',
      description: 'hr@psychhub.org',
      color: '#4CAF50',
      action: handleEmailPress,
    },
    {
      title: 'Phone Support',
      icon: 'call-outline',
      description: '+216 71 000 000',
      color: '#2196F3',
      action: handlePhonePress,
    },
    {
      title: 'Schedule Meeting',
      icon: 'calendar-outline',
      description: 'Book a private session',
      color: '#FF9800',
      action: () => router.push('/appointments'),
    },
    {
      title: 'Anonymous Report',
      icon: 'shield-outline',
      description: 'Submit confidential complaint',
      color: '#E91E63',
      action: () => console.log('Anonymous report'),
    },
  ];

  const reportableIssues = [
    {
      icon: 'people-outline',
      title: 'Workplace Harassment',
      description: 'Report any form of workplace harassment or discrimination',
    },
    {
      icon: 'flame-outline',
      title: 'Burnout & Overload',
      description: 'Get support for work-related stress and burnout',
    },
    {
      icon: 'balance-outline',
      title: 'Work-Life Balance',
      description: 'Discuss issues affecting your work-life balance',
    },
    {
      icon: 'chatbubbles-outline',
      title: 'Interpersonal Conflicts',
      description: 'Resolve conflicts with colleagues or supervisors',
    },
    {
      icon: 'lock-closed-outline',
      title: 'Confidential Matters',
      description: 'Discuss sensitive workplace issues privately',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>HR Support</Text>
            <Text style={styles.headerSubtitle}>We're here to help</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="business-outline" size={24} color="#FFF" />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Professional HR Support</Text>
          <Text style={styles.welcomeText}>
            If you're experiencing workplace-related stress, harassment, burnout, or need general support, 
            our HR team is here to provide confidential assistance.
          </Text>
        </View>

        {/* Contact Options Grid */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact Options</Text>
          <View style={styles.optionsGrid}>
            {supportOptions.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.optionItem}
                onPress={option.action}
              >
                <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon} size={28} color="#FFF" />
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* What You Can Report Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>What You Can Report</Text>
          <View style={styles.issuesContainer}>
            {reportableIssues.map((issue, index) => (
              <View key={index} style={styles.issueCard}>
                <View style={styles.issueIconContainer}>
                  <Ionicons name={issue.icon} size={24} color="#004E64" />
                </View>
                <View style={styles.issueContent}>
                  <Text style={styles.issueTitle}>{issue.title}</Text>
                  <Text style={styles.issueDescription}>{issue.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Availability Info */}
        <View style={styles.availabilitySection}>
          <View style={styles.availabilityCard}>
            <View style={styles.availabilityHeader}>
              <Ionicons name="time-outline" size={24} color="#004E64" />
              <Text style={styles.availabilityTitle}>Availability</Text>
            </View>
            <Text style={styles.availabilityText}>Monday - Friday: 9:00 AM - 5:00 PM</Text>
            <Text style={styles.availabilitySubtext}>
              For urgent matters outside business hours, please contact emergency support.
            </Text>
          </View>
        </View>

        {/* Confidentiality Notice */}
        <View style={styles.confidentialitySection}>
          <View style={styles.confidentialityCard}>
            <View style={styles.confidentialityIcon}>
              <Ionicons name="shield-checkmark-outline" size={32} color="#4CAF50" />
            </View>
            <Text style={styles.confidentialityTitle}>100% Confidential</Text>
            <Text style={styles.confidentialityText}>
              All conversations and reports are kept strictly confidential and handled 
              with the utmost professionalism and care.
            </Text>
          </View>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#FFF',
    fontSize: 16,
    opacity: 0.9,
  },
  headerIcon: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#5A5A5E',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionItem: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 12,
    color: '#5A5A5E',
    textAlign: 'center',
    lineHeight: 16,
  },
  issuesContainer: {
    gap: 12,
  },
  issueCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  issueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6EEF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  issueContent: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  issueDescription: {
    fontSize: 14,
    color: '#5A5A5E',
    lineHeight: 20,
  },
  availabilitySection: {
    marginBottom: 30,
  },
  availabilityCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  availabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  availabilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginLeft: 12,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004E64',
    marginBottom: 8,
  },
  availabilitySubtext: {
    fontSize: 14,
    color: '#5A5A5E',
    lineHeight: 20,
  },
  confidentialitySection: {
    marginBottom: 30,
  },
  confidentialityCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  confidentialityIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  confidentialityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  confidentialityText: {
    fontSize: 16,
    color: '#5A5A5E',
    textAlign: 'center',
    lineHeight: 24,
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