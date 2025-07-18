import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text } from 'react-native';
import { supabase } from '../../services/supabase';

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) setArticle(data);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator size="large" />;

  if (!article) return <Text>Article not found.</Text>;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{article.title}</Text>
      <Text style={{ color: 'gray', marginVertical: 8 }}>By {article.author || 'Anonymous'}</Text>
      {article.image_url && (
        <Image source={{ uri: article.image_url }} style={{ width: '100%', height: 200 }} />
      )}
      <Text style={{ marginTop: 20, fontSize: 16 }}>{article.content}</Text>
    </ScrollView>
  );
}
