import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../services/supabase';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

      <View style={styles.header}>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Emergency</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Details</Text>
          </TouchableOpacity>
          <Link href="/profile-setup" asChild>
            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Ettijari</Text>
            <Text style={styles.logoSubtext}>Psychological Hub</Text>
          </View>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Your Mental Wellness Hub</Text>
          <Text style={styles.welcomeSubtitle}>
            Your well-being matters. Access professional support, resources, and tools designed for Ettijari Bank employees.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/register" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {user && (
          <Text style={{ color: '#004E64', marginTop: 20 }}>
            Logged in as: {user.email}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Ettijari Bank. All rights reserved.</Text>
        <Text style={styles.footerSubtext}>Confidential & Secure</Text>
      </View>
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
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E6EEF1',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navText: {
    color: '#004E64',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: '#DDEAF0',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: '#C3DCE3',
  },
  logoText: {
    color: '#004E64',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logoSubtext: {
    color: '#5A5A5E',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeTitle: {
    color: '#1C1C1E',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 34,
  },
  welcomeSubtitle: {
    color: '#5A5A5E',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#004E64',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#FFA500',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 30,
    paddingHorizontal: 20,
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
