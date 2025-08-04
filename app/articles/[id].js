import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../services/supabase';

export default function ArticleDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) setArticle(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F9FC' }}>
        <ActivityIndicator size="large" color="#004E64" />
        <Text style={{ marginTop: 10, color: '#004E64', fontWeight: '600' }}>Loading article...</Text>
      </View>
    );
  }

  if (!article) return <Text style={{ padding: 20 }}>Article not found.</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F9FC' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#004E64',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>Article</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Title */}
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 5 }}>
          {article.title}
        </Text>

        {/* Author & Date */}
        <Text style={{ color: 'gray', fontSize: 14, marginBottom: 15 }}>
          By {article.author || 'Anonymous'} • {new Date(article.created_at).toLocaleDateString()}
        </Text>

        {/* Image */}
        {article.image_url && (
          <Image
            source={{ uri: article.image_url }}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 15,
              marginBottom: 20,
            }}
          />
        )}

        {/* Content */}
        <Text style={{ fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 40 }}>
          {article.content}
        </Text>

        {/* Footer */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: '#5A5A5E', fontSize: 12, textAlign: 'center' }}>
            © 2025 Ettijari Bank. All rights reserved.
          </Text>
          <Text style={{ color: '#A9A9AE', fontSize: 10, textAlign: 'center', marginTop: 2 }}>
            Confidential & Secure
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
