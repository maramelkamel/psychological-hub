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
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../services/supabase';

const { width } = Dimensions.get('window');

export default function QuizzesScreen() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setQuizzes(data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };
     const getQuestionCount = (questions) => {
     try {
     const parsed = typeof questions === 'string' ? JSON.parse(questions) : questions;
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch (error) {
    return 0;
  }
};


  const getCategoryColor = (category) => {
    const colors = {
      stress_level: '#E91E63',
      public_speaking: '#2196F3',
      burnout_detection: '#FF5722',
      anxiety_level: '#9C27B0',
      work_satisfaction: '#4CAF50',
    };
    return colors[category] || '#607D8B';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      stress_level: 'pulse-outline',
      public_speaking: 'mic-outline',
      burnout_detection: 'flame-outline',
      anxiety_level: 'heart-outline',
      work_satisfaction: 'happy-outline',
    };
    return icons[category] || 'help-circle-outline';
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleQuizStart = (quiz) => {
    Alert.alert('Quiz selected', `You tapped quiz: ${quiz.title}`);
    //router.push(`/quiz/${quiz.id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading quizzes...</Text>
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
        <Text style={styles.headerTitle}>Wellness Assessments</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color="#004E64" />
            <Text style={styles.infoText}>
              Take these assessments to better understand your mental wellness and get personalized recommendations.
            </Text>
          </View>
        </View>

        {/* Quizzes List */}
        <View style={styles.quizzesSection}>
          <Text style={styles.sectionTitle}>Available Assessments</Text>
          {quizzes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="help-circle-outline" size={64} color="#D3D3D3" />
              <Text style={styles.emptyText}>No quizzes available</Text>
              <Text style={styles.emptySubtext}>Check back later for new assessments</Text>
            </View>
          ) : (
            quizzes.map((quiz) => (
              <TouchableOpacity
                key={quiz.id}
                style={styles.quizCard}
                
                onPress={() => router.push(`/quizzes/${quiz.id}`)}

                

              >
                <View style={styles.quizHeader}>
                  <View style={[styles.quizIcon, { backgroundColor: getCategoryColor(quiz.category) }]}>
                    <Ionicons name={getCategoryIcon(quiz.category)} size={24} color="#FFF" />
                  </View>
                  <View style={styles.quizInfo}>
                    <Text style={styles.quizTitle}>{quiz.title}</Text>
                    <Text style={styles.quizCategory}>{formatCategory(quiz.category)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#A9A9AE" />
                </View>
                <Text style={styles.quizDescription}>{quiz.description}</Text>
                <View style={styles.quizFooter}>
                  <Text style={styles.quizDuration}>
                    {getQuestionCount(quiz.questions)} questions

                  </Text>
                  <TouchableOpacity style={[styles.startButton, { backgroundColor: getCategoryColor(quiz.category) }]}>
                    <Text style={styles.startButtonText}>Start Assessment</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Previous Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Previous Results</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>View your previous assessment results and track your progress over time.</Text>
            <TouchableOpacity style={styles.viewResultsButton}>
              <Text style={styles.viewResultsButtonText}>View Results History</Text>
            </TouchableOpacity>
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
  infoSection: {
    marginVertical: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F3FF',
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#004E64',
  },
  infoText: {
    marginLeft: 15,
    fontSize: 14,
    color: '#004E64',
    flex: 1,
    lineHeight: 20,
  },
  quizzesSection: {
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
  },
  quizCard: {
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
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  quizIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  quizCategory: {
    fontSize: 12,
    color: '#A9A9AE',
    fontWeight: '600',
  },
  quizDescription: {
    fontSize: 14,
    color: '#5A5A5E',
    lineHeight: 20,
    marginBottom: 15,
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizDuration: {
    fontSize: 12,
    color: '#A9A9AE',
  },
  startButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  resultsSection: {
    marginBottom: 30,
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 14,
    color: '#5A5A5E',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  viewResultsButton: {
    backgroundColor: '#004E64',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  viewResultsButtonText: {
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