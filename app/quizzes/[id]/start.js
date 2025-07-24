import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../services/supabase';

export default function QuizStart() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [resultMsg, setResultMsg] = useState('');
  
  useEffect(() => {
  const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error.message);
    } else {
      setUserId(user.id);
    }
  };

  getUser();
}, []);

  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      const { data, error } = await supabase
        .from('quizzes')
        .select('title, questions, scoring_rules')
        .eq('id', id)
        .single();

      if (error) setError('Failed to load quiz');
      else setQuiz(data);
      setLoading(false);
    }
    if (id) fetchQuiz();
  }, [id]);

  const handleAnswer = (val) => {
    setAnswers(prev => [...prev, val]);
    const next = page + 1;
    if (next < quiz.questions.length) setPage(next);
    else finishQuiz([...answers, val]);
  };

  const finishQuiz = (allAnswers) => {
    const total = allAnswers.reduce((a, b) => a + b, 0);
    setScore(total);
    // Decide category based on scoring_rules:
    const rule = Object.values(quiz.scoring_rules).find(r => total >= r.min && total <= r.max);
    setResultMsg(rule ? rule.message : 'Result unavailable');
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator /><Text>Loading quiz...</Text></View>
  );
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;

  if (score !== null) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{quiz.title}</Text>
        <Text style={styles.result}>Your score: {score}</Text>
        <Text style={styles.resultMsg}>{resultMsg}</Text>
        <TouchableOpacity onPress={() => router.replace(`/quizzes/${id}`)} style={styles.button}>
          <Text style={styles.buttonText}>Back to Quiz Info</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const q = quiz.questions[page];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{quiz.title}</Text>
      <Text style={styles.question}>{q.question}</Text>
      {q.options.map((opt, i) => (
        <TouchableOpacity key={i} style={styles.option} onPress={() => handleAnswer(q.scores[i])}>
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.pageInfo}>Question {page + 1} of {quiz.questions.length}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  question: { fontSize: 18, marginBottom: 20 },
  option: {
    backgroundColor: '#E0F2F1',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  optionText: { fontSize: 16 },
  pageInfo: { marginTop: 20, textAlign: 'center', color: '#888' },
  result: { fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  resultMsg: { fontSize: 18, marginBottom: 30 },
  button: {
    backgroundColor: '#004E64',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: '600' },
  error: { color: 'red', fontSize: 16 },
});
