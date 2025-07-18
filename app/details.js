import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function Details() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState(null);

  const services = [
    {
      id: 'counseling',
      title: 'Individual Counseling',
      icon: 'person-outline',
      color: '#4CAF50',
      description: 'One-on-one sessions with licensed counselors',
      details: [
        'Personalized therapy sessions tailored to your needs',
        'Confidential environment for open discussion',
        'Evidence-based therapeutic approaches',
        'Flexible scheduling including virtual sessions',
        'Crisis intervention support when needed'
      ],
      duration: '45-60 minutes per session',
      availability: 'Monday-Friday 8AM-6PM, Emergency 24/7'
    },
    {
      id: 'group',
      title: 'Group Therapy',
      icon: 'people-outline',
      color: '#2196F3',
      description: 'Structured group sessions with peers',
      details: [
        'Small groups of 6-8 participants maximum',
        'Peer support and shared experiences',
        'Guided by professional facilitators',
        'Topics include stress management, anxiety, depression',
        'Safe space for community building'
      ],
      duration: '90 minutes per session',
      availability: 'Weekly sessions, various time slots'
    },
    {
      id: 'workshops',
      title: 'Wellness Workshops',
      icon: 'school-outline',
      color: '#FF9800',
      description: 'Educational sessions on mental health topics',
      details: [
        'Interactive learning experiences',
        'Practical tools and techniques',
        'Expert-led presentations',
        'Mindfulness and meditation training',
        'Stress reduction techniques'
      ],
      duration: '2-3 hours per workshop',
      availability: 'Monthly workshops, weekend options'
    },
    {
      id: 'assessment',
      title: 'Psychological Assessment',
      icon: 'analytics-outline',
      color: '#9C27B0',
      description: 'Comprehensive mental health evaluations',
      details: [
        'Standardized psychological testing',
        'Detailed reports and recommendations',
        'Baseline assessments for treatment planning',
        'Progress monitoring tools',
        'Cognitive and emotional evaluations'
      ],
      duration: '2-3 hours across multiple sessions',
      availability: 'By appointment only'
    }
  ];

  const policies = [
    {
      title: 'Confidentiality Policy',
      icon: 'lock-closed',
      color: '#4CAF50',
      content: [
        'All sessions are strictly confidential',
        'Information is not shared with employers',
        'Records are securely stored and encrypted',
        'Only you and your counselor have access',
        'Legal exceptions only in cases of imminent danger'
      ]
    },
    {
      title: 'Appointment Policy',
      icon: 'calendar',
      color: '#2196F3',
      content: [
        'Book appointments up to 2 weeks in advance',
        '24-hour cancellation notice required',
        'Emergency appointments available within 24 hours',
        'Virtual sessions available for all services',
        'Missed appointments may incur fees'
      ]
    },
    {
      title: 'Crisis Support Policy',
      icon: 'medical',
      color: '#E53E3E',
      content: [
        '24/7 crisis hotline available',
        'Same-day emergency appointments',
        'Immediate intervention for safety concerns',
        'Coordination with emergency services when needed',
        'Follow-up support after crisis resolution'
      ]
    }
  ];

  const eligibility = [
    {
      title: 'All Ettijari Bank Employees',
      description: 'Full-time, part-time, and contract employees',
      icon: 'business',
      color: '#4CAF50'
    },
    {
      title: 'Immediate Family Members',
      description: 'Spouses and dependent children',
      icon: 'home',
      color: '#2196F3'
    },
    {
      title: 'Retirees',
      description: 'Former employees with pension benefits',
      icon: 'time',
      color: '#FF9800'
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
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
          <Text style={styles.headerTitle}>Service Details</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Services Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <Text style={styles.sectionSubtitle}>
            Comprehensive mental health support tailored to your needs
          </Text>
          
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, expandedSection === service.id && styles.expandedCard]}
              onPress={() => toggleSection(service.id)}
            >
              <View style={styles.serviceHeader}>
                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                  <Ionicons name={service.icon} size={24} color="#FFF" />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
                <Ionicons 
                  name={expandedSection === service.id ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#5A5A5E" 
                />
              </View>
              
              {expandedSection === service.id && (
                <View style={styles.serviceDetails}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailTitle}>What's Included:</Text>
                    {service.details.map((detail, index) => (
                      <View key={index} style={styles.detailItem}>
                        <View style={[styles.detailBullet, { backgroundColor: service.color }]} />
                        <Text style={styles.detailText}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.serviceInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={16} color={service.color} />
                      <Text style={styles.infoText}>Duration: {service.duration}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={16} color={service.color} />
                      <Text style={styles.infoText}>Availability: {service.availability}</Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Eligibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who Can Access Our Services</Text>
          <Text style={styles.sectionSubtitle}>
            These services are available to the following groups at no cost
          </Text>
          
          <View style={styles.eligibilityGrid}>
            {eligibility.map((item, index) => (
              <View key={index} style={styles.eligibilityCard}>
                <View style={[styles.eligibilityIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={24} color="#FFF" />
                </View>
                <Text style={styles.eligibilityTitle}>{item.title}</Text>
                <Text style={styles.eligibilityDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Policies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Policies</Text>
          <Text style={styles.sectionSubtitle}>
            Please review these policies before using our services
          </Text>
          
          {policies.map((policy, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.policyCard, expandedSection === policy.title && styles.expandedCard]}
              onPress={() => toggleSection(policy.title)}
            >
              <View style={styles.policyHeader}>
                <View style={[styles.policyIcon, { backgroundColor: policy.color }]}>
                  <Ionicons name={policy.icon} size={20} color="#FFF" />
                </View>
                <Text style={styles.policyTitle}>{policy.title}</Text>
                <Ionicons 
                  name={expandedSection === policy.title ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#5A5A5E" 
                />
              </View>
              
              {expandedSection === policy.title && (
                <View style={styles.policyContent}>
                  {policy.content.map((item, idx) => (
                    <View key={idx} style={styles.policyItem}>
                      <View style={[styles.policyBullet, { backgroundColor: policy.color }]} />
                      <Text style={styles.policyText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactGrid}>
            <View style={styles.contactCard}>
              <Ionicons name="call" size={24} color="#4CAF50" />
              <Text style={styles.contactTitle}>General Inquiries</Text>
              <Text style={styles.contactInfo}>+216 71 123 456</Text>
              <Text style={styles.contactTime}>Mon-Fri 9AM-5PM</Text>
            </View>
            
            <View style={styles.contactCard}>
              <Ionicons name="medical" size={24} color="#E53E3E" />
              <Text style={styles.contactTitle}>Crisis Hotline</Text>
              <Text style={styles.contactInfo}>197</Text>
              <Text style={styles.contactTime}>24/7 Available</Text>
            </View>
            
            <View style={styles.contactCard}>
              <Ionicons name="mail" size={24} color="#2196F3" />
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactInfo}>wellness@ettijari.com</Text>
              <Text style={styles.contactTime}>24-48 hour response</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <Link href="/appointments" asChild>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="calendar" size={24} color="#2196F3" />
                <Text style={styles.actionTitle}>Book Appointment</Text>
                <Text style={styles.actionDescription}>Schedule your first session</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/messages" asChild>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="mail" size={24} color="#4CAF50" />
                <Text style={styles.actionTitle}>Send Message</Text>
                <Text style={styles.actionDescription}>Contact a counselor</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/workshops" asChild>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="people" size={24} color="#FF9800" />
                <Text style={styles.actionTitle}>Join Workshop</Text>
                <Text style={styles.actionDescription}>Explore group sessions</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/emergency" asChild>
              <TouchableOpacity style={styles.actionCard}>
                <Ionicons name="medical" size={24} color="#E53E3E" />
                <Text style={styles.actionTitle}>Get Help Now</Text>
                <Text style={styles.actionDescription}>Crisis support</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Have questions about our services? Contact us anytime.
          </Text>
          <Text style={styles.footerSubtext}>
            © 2025 Ettijari Bank Wellness Hub • All rights reserved
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
  serviceCard: {
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
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#5A5A5E',
  },
  serviceDetails: {
    marginTop: 20,
  },
  detailSection: {
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 7,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#5A5A5E',
    marginLeft: 8,
  },
  eligibilityGrid: {
    marginTop: 10,
  },
  eligibilityCard: {
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
  eligibilityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  eligibilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 2,
    flex: 1,
  },
  eligibilityDescription: {
    fontSize: 14,
    color: '#5A5A5E',
    flex: 1,
  },
  policyCard: {
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
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  policyIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  policyTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  policyContent: {
    marginTop: 15,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  policyBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 7,
  },
  policyText: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactCard: {
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
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004E64',
    marginBottom: 5,
    textAlign: 'center',
  },
  contactTime: {
    fontSize: 12,
    color: '#5A5A5E',
    textAlign: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
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
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#5A5A5E',
    textAlign: 'center',
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
  },
});