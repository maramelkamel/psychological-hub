import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../services/supabase';

const { width } = Dimensions.get('window');

export default function ArticlesScreen() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setArticles(data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      anxiety: '#E91E63',
      burnout: '#FF5722',
      stress_management: '#2196F3',
      time_management: '#FF9800',
      depression: '#9C27B0',
      work_life_balance: '#4CAF50',
    };
    return colors[category] || '#607D8B';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      anxiety: 'heart-outline',
      burnout: 'flame-outline',
      stress_management: 'leaf-outline',
      time_management: 'time-outline',
      depression: 'sad-outline',
      work_life_balance: 'balance-outline',
    };
    return icons[category] || 'document-text-outline';
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading articles...</Text>
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
        <Text style={styles.headerTitle}>Wellness Articles</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {['All', 'Anxiety', 'Burnout', 'Stress Management', 'Time Management', 'Depression', 'Work Life Balance'].map((category, index) => (
              <TouchableOpacity key={index} style={[styles.categoryChip, index === 0 && styles.activeCategoryChip]}>
                <Text style={[styles.categoryText, index === 0 && styles.activeCategoryText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Articles Grid */}
        <View style={styles.articlesSection}>
          <Text style={styles.sectionTitle}>Recent Articles</Text>
          {articles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="library-outline" size={64} color="#D3D3D3" />
              <Text style={styles.emptyText}>No articles available</Text>
              <Text style={styles.emptySubtext}>Check back later for new content</Text>
            </View>
          ) : (
            <View style={styles.articlesGrid}>
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`} asChild>
                  <TouchableOpacity style={styles.articleCard}>
                    <View style={styles.articleImageContainer}>
                      {article.image_url ? (
                        <Image source={{ uri: article.image_url }} style={styles.articleImage} />
                      ) : (
                        <View style={[styles.articlePlaceholder, { backgroundColor: getCategoryColor(article.category) }]}>
                          <Ionicons name={getCategoryIcon(article.category)} size={32} color="#FFF" />
                        </View>
                      )}
                      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(article.category) }]}>
                        <Text style={styles.categoryBadgeText}>
                          {formatCategory(article.category)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.articleContent}>
                      <Text style={styles.articleTitle} numberOfLines={2}>
                        {article.title}
                      </Text>
                      <Text style={styles.articleSummary} numberOfLines={3}>
                        {article.summary || article.content.substring(0, 100) + '...'}
                      </Text>
                      <View style={styles.articleFooter}>
                        <Text style={styles.articleAuthor}>
                          By {article.author || 'Anonymous'}
                        </Text>
                        <Text style={styles.articleDate}>
                          {new Date(article.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          )}
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
  categoriesSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeCategoryChip: {
    backgroundColor: '#004E64',
  },
  categoryText: {
    color: '#004E64',
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#FFF',
  },
  articlesSection: {
    marginBottom: 30,
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
  articlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  articleCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  articleImageContainer: {
    position: 'relative',
    height: 120,
  },
  articleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  articlePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  articleContent: {
    padding: 15,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
    lineHeight: 18,
  },
  articleSummary: {
    fontSize: 12,
    color: '#5A5A5E',
    lineHeight: 16,
    marginBottom: 10,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleAuthor: {
    fontSize: 10,
    color: '#A9A9AE',
    flex: 1,
  },
  articleDate: {
    fontSize: 10,
    color: '#A9A9AE',
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