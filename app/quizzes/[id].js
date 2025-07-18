import { useRouter, useSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../services/supabase';

export default function QuizDetail() {
  const router = useRouter();
  const { id } = useSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
        setQuiz(null);
      } else {
        setQuiz(data);
      }
    } catch (e) {
      setError('Failed to fetch quiz details');
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004E64" />
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  if (error || !quiz) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Quiz not found.'}</Text>
        <Button title="Retry" onPress={fetchQuiz} color="#004E64" />
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004E64" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonTop}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{quiz.title}</Text>
        <Text style={styles.description}>{quiz.description}</Text>
      </View>

      {/* Quiz questions or instructions placeholder */}
      <View style={styles.content}>
        <Text style={styles.instructions}>Quiz questions will be displayed here.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F7F9FC' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: { marginTop: 10, color: '#004E64', fontSize: 16 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginBottom: 20 },
  backButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#004E64',
    borderRadius: 8,
  },
  backButtonTop: {
    marginBottom: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  backButtonText: {
    color: '#004E64',
    fontSize: 16,
    fontWeight: '600',
  },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#004E64' },
  description: { fontSize: 16, color: '#5A5A5E', marginTop: 5 },
  content: { marginTop: 30 },
  instructions: { fontSize: 14, color: '#333' },
});
