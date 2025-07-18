import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function About() {
  const router = useRouter();

  const features = [
    {
      icon: 'shield-checkmark',
      title: 'Confidential & Secure',
      description: 'All your conversations and data are encrypted and completely confidential',
      color: '#4CAF50',
    },
    {
      icon: 'people',
      title: 'Professional Support',
      description: 'Access to licensed counselors and mental health professionals',
      color: '#2196F3',
    },
    {
      icon: 'calendar',
      title: 'Flexible Scheduling',
      description: 'Book appointments at your convenience, including urgent sessions',
      color: '#FF9800',
    },
    {
      icon: 'library',
      title: 'Rich Resources',
      description: 'Extensive library of wellness articles and self-help materials',
      color: '#9C27B0',
    },
    {
      icon: 'school',
      title: 'Interactive Workshops',
      description: 'Join group sessions and workshops on various wellness topics',
      color: '#E91E63',
    },
    {
      icon: 'analytics',
      title: 'Progress Tracking',
      description: 'Monitor your wellness journey with personalized assessments',
      color: '#607D8B',
    },
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Ben Ahmed',
      role: 'Chief Clinical Psychologist',
      experience: '15+ years',
      specialties: ['Anxiety', 'Depression', 'Workplace Stress'],
    },
    {
      name: 'Dr. Mohamed Trabelsi',
      role: 'Counseling Psychologist',
      experience: '12+ years',
      specialties: ['Trauma', 'Relationship Issues', 'Career Counseling'],
    },
    {
      name: 'Dr. Leila Hajji',
      role: 'Psychiatric Nurse',
      experience: '10+ years',
      specialties: ['Crisis Intervention', 'Medication Management'],
    },
  ];

  const stats = [
    { number: '500+', label: 'Employees Supported' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Crisis Support' },
    { number: '100%', label: 'Confidential' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Wellness Hub</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mission Section */}
        <View style={styles.section}>
          <View style={styles.missionCard}>
            <View style={styles.missionIcon}>
              <Ionicons name="heart" size={40} color="#004E64" />
            </View>
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              To provide comprehensive mental health and wellness support to all Ettijari Bank 
              employees, creating a healthier, more productive workplace where everyone can thrive.
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Impact</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <Text style={styles.sectionSubtitle}>
            Comprehensive mental health support tailored for your needs
          </Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <Ionicons name={feature.icon} size={24} color="#FFF" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meet Our Team</Text>
          <Text style={styles.sectionSubtitle}>
            Licensed professionals dedicated to your well-being
          </Text>
          
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamCard}>
              <View style={styles.teamAvatar}>
                <Ionicons name="person" size={30} color="#004E64" />
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
                <Text style={styles.teamExperience}>{member.experience} experience</Text>
                <View style={styles.specialties}>
                  {member.specialties.map((specialty, idx) => (
                    <View key={idx} style={styles.specialtyTag}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Confidentiality</Text>
          
          <View style={styles.privacyCard}>
            <View style={styles.privacyHeader}>
              <Ionicons name="lock-closed" size={24} color="#4CAF50" />
              <Text style={styles.privacyTitle}>Your Privacy is Protected</Text>
            </View>
            <Text style={styles.privacyText}>
              We follow strict confidentiality protocols in accordance with medical ethics and 
              Tunisian healthcare regulations. Your personal information and conversations are:
            </Text>
            <View style={styles.privacyPoints}>
              <View style={styles.privacyPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.privacyPointText}>End-to-end encrypted</Text>
              </View>
              <View style={styles.privacyPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.privacyPointText}>Never shared with employers</Text>
              </View>
              <View style={styles.privacyPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.privacyPointText}>Stored securely on protected servers</Text>
              </View>
              <View style={styles.privacyPoint}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.privacyPointText}>Accessible only to your assigned counselor</Text>
              </View>
            </View>
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Sign Up & Assessment</Text>
                <Text style={styles.stepDescription}>
                  Complete a brief wellness assessment to help us understand your needs
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Choose Your Support</Text>
                <Text style={styles.stepDescription}>
                  Select from counseling sessions, workshops, or self-help resources
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#FF9800' }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Connected</Text>
                <Text style={styles.stepDescription}>
                  Start your wellness journey with professional guidance and support
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Ettijari Bank Wellness Hub</Text>
          <Text style={styles.footerSubtext}>
            Licensed by the Tunisian Ministry of Health
          </Text>
          <Text style={styles.footerSubtext}>
            All rights reserved • Confidential & Secure
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
  missionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  missionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  missionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  missionText: {
    fontSize: 16,
    color: '#5A5A5E',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#004E64',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#5A5A5E',
    textAlign: 'center',
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#5A5A5E',
    textAlign: 'center',
    lineHeight: 16,
  },
  teamCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  teamRole: {
    fontSize: 14,
    color: '#004E64',
    fontWeight: '600',
    marginBottom: 2,
  },
  teamExperience: {
    fontSize: 12,
    color: '#5A5A5E',
    marginBottom: 10,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: '#E6F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  specialtyText: {
    fontSize: 10,
    color: '#004E64',
    fontWeight: '600',
  },
  privacyCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginLeft: 10,
  },
  privacyText: {
    fontSize: 14,
    color: '#5A5A5E',
    lineHeight: 20,
    marginBottom: 15,
  },
  privacyPoints: {
    marginTop: 10,
  },
  privacyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  privacyPointText: {
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 10,
  },
  stepsContainer: {
    marginTop: 10,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#5A5A5E',
    lineHeight: 20,
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
    marginBottom: 5,
  },
  footerSubtext: {
    color: '#A9A9AE',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
});