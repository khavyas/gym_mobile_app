// BlogDetail.tsx - Individual blog post detail screen
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, User, Share2, Bookmark } from 'lucide-react-native';
import { getBlogPostById } from './blogPosts';
import { useState } from 'react';

export default function BlogDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const blogPost = getBlogPostById(params.id as string);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!blogPost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Blog post not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Share2 size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark 
              size={20} 
              color={isBookmarked ? "#10B981" : "#FFFFFF"}
              fill={isBookmarked ? "#10B981" : "none"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <Image 
          source={{ uri: blogPost.imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{blogPost.category}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{blogPost.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <User size={16} color="#94A3B8" />
              <Text style={styles.metaText}>
                {blogPost.author}, {blogPost.credentials}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color="#94A3B8" />
              <Text style={styles.metaText}>{blogPost.readTime} read</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{blogPost.description}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content */}
          <View style={styles.articleContent}>
            {blogPost.content.split('\n').map((paragraph, index) => {
              // Handle headers
              if (paragraph.startsWith('# ')) {
                return (
                  <Text key={index} style={styles.h1}>
                    {paragraph.replace('# ', '')}
                  </Text>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <Text key={index} style={styles.h2}>
                    {paragraph.replace('## ', '')}
                  </Text>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <Text key={index} style={styles.h3}>
                    {paragraph.replace('### ', '')}
                  </Text>
                );
              }
              // Handle bullet points
              if (paragraph.startsWith('- ')) {
                return (
                  <View key={index} style={styles.bulletContainer}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>
                      {paragraph.replace('- ', '')}
                    </Text>
                  </View>
                );
              }
              // Handle bold text with **
              if (paragraph.includes('**')) {
                const parts = paragraph.split('**');
                return (
                  <Text key={index} style={styles.paragraph}>
                    {parts.map((part, i) => (
                      i % 2 === 0 ? (
                        <Text key={i}>{part}</Text>
                      ) : (
                        <Text key={i} style={styles.bold}>{part}</Text>
                      )
                    ))}
                  </Text>
                );
              }
              // Regular paragraph
              if (paragraph.trim()) {
                return (
                  <Text key={index} style={styles.paragraph}>
                    {paragraph}
                  </Text>
                );
              }
              return null;
            })}
          </View>

          {/* Author Card */}
          <View style={styles.authorCard}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitial}>
                {blogPost.author.charAt(0)}
              </Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{blogPost.author}</Text>
              <Text style={styles.authorCredentials}>{blogPost.credentials}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#1E293B',
  },
  contentContainer: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  description: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginBottom: 24,
  },
  articleContent: {
    marginBottom: 32,
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  paragraph: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 26,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 16,
  },
  bullet: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 12,
    lineHeight: 26,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 26,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  authorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  authorInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  authorCredentials: {
    fontSize: 14,
    color: '#94A3B8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});