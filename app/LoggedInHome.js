import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../services/supabase';

const { width } = Dimensions.get('window');

export default function LoggedInHome() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.replace('/');
          return;
        }

        setUser(session.user);

        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(userProfile);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const menuItems = [
    {
      title: 'Send Message',
      icon: 'mail-outline',
      description: 'Contact counselors or HR',
      route: '/messages',
      color: '#4CAF50',
    },
    {
      title: 'Book Appointment',
      icon: 'calendar-outline',
      description: 'Schedule counseling sessions',
      route: '/appointments',
      color: '#2196F3',
    },
    {
      title: 'Workshops',
      icon: 'people-outline',
      description: 'Join wellness workshops',
      route: '/workshops',
      color: '#FF9800',
    },
    {
      title: 'Articles',
      icon: 'library-outline',
      description: 'Read wellness articles',
      route: '/articles',
      color: '#9C27B0',
    },
    {
      title: 'Quizzes',
      icon: 'help-circle-outline',
      description: 'Take wellness assessments',
      route: '/quizzes',
      color: '#E91E63',
    },
    {
      title: 'My Profile',
      icon: 'person-outline',
      description: 'View and edit profile',
      route: '/profile',
      color: '#607D8B',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Welcome back,</Text>
            <Text style={styles.headerSubtitle}>
              {profile?.first_name || 'User'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navbar}>
       <Link href="/emergency" asChild>
  <TouchableOpacity style={styles.navItem}>
    <Ionicons name="call-outline" size={18} color="#004E64" />
    <Text style={styles.navText}>Emergency</Text>
  </TouchableOpacity>
</Link>

<Link href="/about" asChild>
  <TouchableOpacity style={styles.navItem}>
    <Ionicons name="information-circle-outline" size={18} color="#004E64" />
    <Text style={styles.navText}>About</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/details" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="document-text-outline" size={18} color="#004E64" />
            <Text style={styles.navText}>Details</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/profile" asChild>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={18} color="#004E64" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Your Mental Wellness Hub</Text>
          <Text style={styles.welcomeText}>
            Access professional support, resources, and tools designed for your well-being.
          </Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.route} asChild>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={32} color="#FFF" />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Workshops Joined</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Articles Read</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Quizzes Taken</Text>
            </View>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    opacity: 0.9,
  },
  headerSubtitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E6EEF1',
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navText: {
    color: '#004E64',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
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
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuItem: {
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
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    color: '#5A5A5E',
    textAlign: 'center',
    lineHeight: 16,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004E64',
    marginBottom: 5,
  },
  statLabel: {
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