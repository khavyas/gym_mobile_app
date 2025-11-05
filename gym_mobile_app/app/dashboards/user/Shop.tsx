import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { HeartIcon, ShoppingCartIcon, StarIcon } from "react-native-heroicons/solid";
import { HeartIcon as HeartOutlineIcon } from "react-native-heroicons/outline";

const { width } = Dimensions.get('window');

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  featured?: boolean;
  description: string;
}

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<number[]>([1, 3]);

  const categories = ["All", "Equipment", "Supplements", "Apparel", "Accessories"];

  const products: Product[] = [
    {
      id: 1,
      name: "Premium Whey Protein",
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.8,
      reviews: 1250,
      image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop",
      category: "Supplements",
      inStock: true,
      featured: true,
      description: "High-quality whey protein for muscle building"
    },
    {
      id: 2,
      name: "Adjustable Dumbbells",
      price: 299.99,
      rating: 4.9,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop",
      category: "Equipment",
      inStock: true,
      description: "Space-saving adjustable dumbbells 5-50lbs"
    },
    {
      id: 3,
      name: "Gym Performance T-Shirt",
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.6,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      category: "Apparel",
      inStock: true,
      featured: true,
      description: "Moisture-wicking performance fabric"
    },
    {
      id: 4,
      name: "Resistance Band Set",
      price: 19.99,
      rating: 4.7,
      reviews: 1034,
      image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop",
      category: "Equipment",
      inStock: true,
      description: "5-piece resistance band set with handles"
    },
    {
      id: 5,
      name: "Pre-Workout Supplement",
      price: 34.99,
      rating: 4.5,
      reviews: 789,
      image: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400&h=400&fit=crop",
      category: "Supplements",
      inStock: false,
      description: "Energy boost for intense workouts"
    },
    {
      id: 6,
      name: "Yoga Mat Premium",
      price: 39.99,
      rating: 4.8,
      reviews: 445,
      image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
      category: "Equipment",
      inStock: true,
      description: "Non-slip premium yoga mat"
    },
    {
      id: 7,
      name: "Wireless Earbuds",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.4,
      reviews: 2103,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      category: "Accessories",
      inStock: true,
      description: "Sweat-proof wireless earbuds"
    },
    {
      id: 8,
      name: "Gym Gloves",
      price: 15.99,
      rating: 4.3,
      reviews: 334,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
      category: "Accessories",
      inStock: true,
      description: "Anti-slip workout gloves"
    },
    {
      id: 9,
      name: "Foam Roller",
      price: 29.99,
      rating: 4.6,
      reviews: 678,
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=400&fit=crop",
      category: "Equipment",
      inStock: true,
      description: "Deep tissue massage roller"
    },
    {
      id: 10,
      name: "Protein Shaker Bottle",
      price: 12.99,
      rating: 4.5,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&h=400&fit=crop",
      category: "Accessories",
      inStock: true,
      description: "Leak-proof shaker with mixer ball"
    },
    {
      id: 11,
      name: "Sports Water Bottle",
      price: 18.99,
      rating: 4.7,
      reviews: 1205,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
      category: "Accessories",
      inStock: true,
      description: "Insulated stainless steel bottle"
    },
    {
      id: 12,
      name: "Compression Shorts",
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.4,
      reviews: 523,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
      category: "Apparel",
      inStock: true,
      featured: true,
      description: "Performance compression wear"
    },
    {
      id: 13,
      name: "Jump Rope",
      price: 14.99,
      rating: 4.6,
      reviews: 745,
      image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=400&fit=crop",
      category: "Equipment",
      inStock: true,
      description: "Speed jump rope for cardio"
    },
    {
      id: 14,
      name: "Creatine Monohydrate",
      price: 27.99,
      rating: 4.8,
      reviews: 1567,
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
      category: "Supplements",
      inStock: true,
      description: "Pure creatine for strength gains"
    },
    {
      id: 15,
      name: "Training Sneakers",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.7,
      reviews: 934,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      category: "Apparel",
      inStock: true,
      description: "Lightweight training shoes"
    },
    {
      id: 16,
      name: "Kettlebell Set",
      price: 129.99,
      rating: 4.9,
      reviews: 456,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
      category: "Equipment",
      inStock: true,
      description: "Cast iron kettlebells 10-35lbs"
    }
  ];

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} size={12} color="#F59E0B" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <View key="half" style={styles.halfStar}>
          <StarIcon size={12} color="#374151" />
          <View style={styles.halfStarOverlay}>
            <StarIcon size={12} color="#F59E0B" />
          </View>
        </View>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} size={12} color="#374151" />
      );
    }

    return stars;
  };

  const renderCategoryTab = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryTab,
        selectedCategory === category ? styles.categoryTabActive : styles.categoryTabInactive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryTabText,
        selectedCategory === category ? styles.categoryTabTextActive : styles.categoryTabTextInactive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = (product: Product) => {
    const isFavorite = favorites.includes(product.id);
    
    return (
      <View key={product.id} style={styles.productCard}>
        {product.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(product.id)}
        >
          {isFavorite ? (
            <HeartIcon size={20} color="#EF4444" />
          ) : (
            <HeartOutlineIcon size={20} color="#94A3B8" />
          )}
        </TouchableOpacity>

        <View style={styles.productImageContainer}>
          <Image 
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(product.rating)}
            </View>
            <Text style={styles.ratingText}>({product.reviews})</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[
              styles.addToCartButton,
              !product.inStock && styles.addToCartButtonDisabled
            ]}
            disabled={!product.inStock}
          >
            <ShoppingCartIcon size={16} color={product.inStock ? "#FFFFFF" : "#6B7280"} />
            <Text style={[
              styles.addToCartText,
              !product.inStock && styles.addToCartTextDisabled
            ]}>
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const featuredProducts = products.filter(product => product.featured);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Fitness Shop</Text>
            <Text style={styles.subtitle}>Everything you need for your fitness journey</Text>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <ShoppingCartIcon size={24} color="#FFFFFF" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Featured Products</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {featuredProducts.map(product => (
                <View key={`featured-${product.id}`} style={styles.featuredCard}>
                  {renderProductCard(product)}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(renderCategoryTab)}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === "All" ? "🛍️ All Products" : `🛍️ ${selectedCategory}`}
            </Text>
            <Text style={styles.productCount}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
          
          <View style={styles.productsGrid}>
            {filteredProducts.map(renderProductCard)}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.length}+</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.7★</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>Free</Text>
            <Text style={styles.statLabel}>Shipping</Text>
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
  scrollContainer: {
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  cartButton: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  productCount: {
    fontSize: 14,
    color: '#94A3B8',
  },
  featuredContainer: {
    paddingLeft: 20,
  },
  featuredCard: {
    marginRight: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  categoryTabActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  categoryTabInactive: {
    backgroundColor: 'transparent',
    borderColor: '#374151',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  categoryTabTextInactive: {
    color: '#94A3B8',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: (width - 40) / 2,
    marginHorizontal: 4,
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  productImageContainer: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    height: 36,
  },
  productDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
    lineHeight: 16,
    height: 32,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  halfStar: {
    position: 'relative',
  },
  halfStarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    overflow: 'hidden',
  },
  ratingText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#374151',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addToCartTextDisabled: {
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});