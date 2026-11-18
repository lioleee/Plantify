import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Image,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
const API_BASE_URL = 'http://192.168.100.29:5000';
// ==========================================
// CONSTANTS & MOCK DATA
// ==========================================
const DEFAULT_PLANT_IMAGE =
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80';

const LOGIN_HERO_IMAGE =
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1000&q=80';

const CATEGORIES = ['All', 'Indoor', 'Succulents', 'Tropical', 'Ferns'];
const HEALTH_OPTIONS = ['Healthy', 'Needs Water', 'Critical'];
const WATERING_PRESETS = ['Every 3 days', 'Every 7 days', 'Every 14 days', 'Every 21 days'];

const INITIAL_PLANTS = [
  {
    id: '1',
    name: 'Monty',
    species: 'Monstera Deliciosa',
    category: 'Tropical',
    health: 'Healthy',
    wateringSchedule: 'Every 7 days',
    isWateredToday: false,
    lastWatered: '5 days ago',
    imageUrl:
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Spike',
    species: 'Sansevieria Trifasciata',
    category: 'Succulents',
    health: 'Needs Water',
    wateringSchedule: 'Every 14 days',
    isWateredToday: false,
    lastWatered: 'Due today',
    imageUrl:
      'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Figgy',
    species: 'Ficus Lyrata',
    category: 'Indoor',
    health: 'Healthy',
    wateringSchedule: 'Every 7 days',
    isWateredToday: true,
    lastWatered: 'Today, 9:30 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    name: 'Fernie',
    species: 'Nephrolepis Exaltata',
    category: 'Ferns',
    health: 'Critical',
    wateringSchedule: 'Every 3 days',
    isWateredToday: false,
    lastWatered: 'Overdue (2d)',
    imageUrl:
      'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
  },
];

const SHOP_CATALOG = [
  {
    id: 'shop-1',
    name: 'Calathea Orbifolia',
    species: 'Prayer Plant',
    price: 34,
    difficulty: 'Moderate',
    category: 'Tropical',
    wateringSchedule: 'Every 7 days',
    imageUrl:
      'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'shop-2',
    name: 'String of Pearls',
    species: 'Curio Rowleyanus',
    price: 22,
    difficulty: 'Easy',
    category: 'Succulents',
    wateringSchedule: 'Every 14 days',
    imageUrl:
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'shop-3',
    name: 'Bird of Paradise',
    species: 'Strelitzia Nicolai',
    price: 58,
    difficulty: 'Moderate',
    category: 'Tropical',
    wateringSchedule: 'Every 7 days',
    imageUrl:
      'https://images.unsplash.com/photo-1598880940371-c756e015faf1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'shop-4',
    name: 'ZZ Raven',
    species: 'Zamioculcas Zamiifolia',
    price: 29,
    difficulty: 'Beginner',
    category: 'Indoor',
    wateringSchedule: 'Every 21 days',
    imageUrl:
      'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'shop-5',
    name: 'Maidenhair Fern',
    species: 'Adiantum Raddianum',
    price: 25,
    difficulty: 'Expert',
    category: 'Ferns',
    wateringSchedule: 'Every 3 days',
    imageUrl:
      'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'shop-6',
    name: 'Aloe Vera',
    species: 'Aloe Barbadensis',
    price: 19,
    difficulty: 'Beginner',
    category: 'Succulents',
    wateringSchedule: 'Every 14 days',
    imageUrl:
      'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&w=800&q=80',
  },
];

// ==========================================
// MAIN APP ROOT
// ==========================================
export default function App() {
  const [appState, setAppState] = useState('Splash'); // 'Splash' | 'Auth' | 'Main' | 'AddPlant'
  const [activeTab, setActiveTab] = useState('Jungle'); // 'Jungle' | 'Shop' | 'Cart' | 'Profile'
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [authToken, setAuthToken] = useState(null);

  // Shared State
  const [plants, setPlants] = useState(INITIAL_PLANTS);
  const [dbPlants, setDbPlants] = useState([]);
  const fetchPlants = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/plants`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
     console.log('DATABASE PLANT IMAGE:', data.plants[0]?.image_url);
setDbPlants(data.plants);
    } else {
      console.log('Fetch Plants Error:', data.message);
    }
  } catch (error) {
    console.log('Fetch Plants Error:', error.message);
  }
};
useEffect(() => {
  if (authToken) {
    fetchPlants();
  }
}, [authToken]);
useEffect(() => {
  setPlants((prevPlants) => {
    const mockPlants = prevPlants.filter(
      (plant) => !plant.isFromDatabase
    );

    const realPlants = dbPlants.map((plant) => ({
      ...plant,
      id: plant.id,
      wateringSchedule: plant.watering_schedule,
      isWateredToday: Boolean(plant.is_watered_today),
      lastWatered: plant.last_watered || 'Just added',
      imageUrl: plant.image_url || DEFAULT_PLANT_IMAGE,
      isFromDatabase: true,
    }));

    return [...realPlants, ...mockPlants];
  });
}, [dbPlants]);
  const [cart, setCart] = useState([]);
  const [totalWateringsLogged, setTotalWateringsLogged] = useState(14);

  // Automatic 2-second Splash transition
  useEffect(() => {
    if (appState === 'Splash') {
      const timer = setTimeout(() => {
        setAppState('Auth');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // --- Plant Care Handlers ---
  
const handleAddPlant = async (newPlant) => {
  try {
    const imageUrl =
      newPlant.imageUrl.trim() || DEFAULT_PLANT_IMAGE;

    const response = await fetch(`${API_BASE_URL}/api/plants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: newPlant.name,
        species: newPlant.species,
        category: newPlant.category,
        health: newPlant.health,
        wateringSchedule: newPlant.wateringSchedule,
        imageUrl: imageUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      Alert.alert('Error', data.message || 'Unable to add plant.');
      return;
    }

    setDbPlants((prev) => [
      {
        id: data.plantId,
        name: newPlant.name,
        species: newPlant.species,
        category: newPlant.category,
        health: newPlant.health,
        watering_schedule: newPlant.wateringSchedule,
        is_watered_today: 0,
        last_watered: null,
        image_url: imageUrl,
      },
      ...prev,
    ]);

    setAppState('Main');
    setActiveTab('Jungle');

    Alert.alert('Success', 'Plant added successfully!');
  } catch (error) {
    console.log('Add Plant Error:', error.message);
    Alert.alert('Error', 'Could not connect to Plantify server.');
  }
};


  
const handleWaterPlant = async (id) => {
  const now = new Date();

  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const plant = plants.find((item) => item.id === id);

  if (!plant) return;

  // Update database only for plants saved in MySQL
  if (plant.isFromDatabase) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/plants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          health: 'Healthy',
          isWateredToday: true,
          lastWatered: now.toISOString().slice(0, 19).replace('T', ' '),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert('Error', data.message || 'Could not update plant.');
        return;
      }
    } catch (error) {
      console.log('Water Plant Error:', error.message);
      Alert.alert('Error', 'Could not connect to Plantify server.');
      return;
    }
  }

  setPlants((prev) =>
    prev.map((plant) => {
      if (plant.id !== id) return plant;

      return {
        ...plant,
        health: 'Healthy',
        isWateredToday: true,
        lastWatered: `Today, ${formattedTime}`,
      };
    })
  );

  setTotalWateringsLogged((count) => count + 1);
};


  
const handleDeletePlant = (id, name) => {
  Alert.alert(
    'Remove Plant',
    `Remove ${name} from your botanical collection?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const plant = plants.find((item) => item.id === id);

          if (!plant) return;

          // Delete from MySQL only if it is a database plant
          if (plant.isFromDatabase) {
            try {
              const response = await fetch(`${API_BASE_URL}/api/plants/${id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });

              const data = await response.json();

              if (!response.ok || !data.success) {
                Alert.alert('Error', data.message || 'Could not delete plant.');
                return;
              }

              setDbPlants((prev) =>
                prev.filter((item) => item.id !== id)
              );
            } catch (error) {
              console.log('Delete Plant Error:', error.message);
              Alert.alert('Error', 'Could not connect to Plantify server.');
              return;
            }
          }

          setPlants((prev) =>
            prev.filter((plant) => plant.id !== id)
          );
        },
      },
    ]
  );
};

  // --- Shop & Cart Handlers ---
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    Alert.alert('Added to Cart! 🌿', `${product.name} has been added to your basket.`);
  };

  const handleUpdateCartQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckoutSuccess = (orderReceipt) => {
    // Add purchased plants into My Jungle
    const purchasedPlants = cart.map((item, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: item.name,
      species: item.species,
      category: item.category,
      health: 'Healthy',
      wateringSchedule: item.wateringSchedule,
      isWateredToday: true,
      lastWatered: 'Just delivered',
      imageUrl: item.imageUrl,
    }));

    setPlants((prev) => [...purchasedPlants, ...prev]);
    setCart([]);
    setActiveTab('Jungle');
  };

  
const handleLogout = () => {
  setUserEmail('');
  setUserName('');
  setAuthToken(null);
  setDbPlants([]);
  setActiveTab('Jungle');
  setAppState('Auth');
};


  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ==========================================
  // RENDER: SPLASH SCREEN
  // ==========================================
  if (appState === 'Splash') {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#132A1C" />
        <View style={styles.splashBadgeCircle}>
          <Ionicons name="leaf" size={64} color="#A7F3D0" />
        </View>
        <Text style={styles.splashTitle}>Plantify</Text>
        <Text style={styles.splashSubtitle}>Your Smart Greenhouse & Store</Text>
        <View style={styles.splashLoaderBox}>
          <ActivityIndicator size="large" color="#A7F3D0" />
          <Text style={styles.splashLoadingText}>Loading your ecosystem...</Text>
        </View>
      </View>
    );
  }

  // ==========================================
  // RENDER: AUTH SCREEN
  // ==========================================
  
if (appState === 'Auth') {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9F7" />
    <AuthScreen
  onLoginSuccess={(name, email, token) => {
    setUserName(name);
    setUserEmail(email);
    setAuthToken(token);
    setAppState('Main');

  }}
/>
    </SafeAreaView>
  );
}


  // ==========================================
  // RENDER: ADD PLANT FORM SCREEN
  // ==========================================
  if (appState === 'AddPlant') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F6F9F7" />
        <AddPlantScreen
          onSave={handleAddPlant}
          onCancel={() => setAppState('Main')}
        />
      </SafeAreaView>
    );
  }

  // ==========================================
  // RENDER: MAIN TABS CONTAINER
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9F7" />

      <View style={styles.flexOne}>
        {activeTab === 'Jungle' && (
          <JungleDashboardScreen
            plants={plants}
            onNavigateAdd={() => setAppState('AddPlant')}
            onWaterPlant={handleWaterPlant}
            onDeletePlant={handleDeletePlant}
          />
        )}

        {activeTab === 'Shop' && (
          <ShopScreen
            catalog={SHOP_CATALOG}
            onAddToCart={handleAddToCart}
            cartCount={totalCartItems}
            onGoToCart={() => setActiveTab('Cart')}
          />
        )}

        {activeTab === 'Cart' && (
          <CartScreen
            cart={cart}
            userEmail={userEmail}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onCheckoutSuccess={handleCheckoutSuccess}
            onBrowseShop={() => setActiveTab('Shop')}
          />
        )}

        {activeTab === 'Profile' && (
          <ProfileScreen
            userName={userName}
            userEmail={userEmail}
            plants={plants}
            totalWaterings={totalWateringsLogged}
            onLogout={handleLogout}
          />
        )}
      </View>

      {/* Persistent Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TabButton
          label="My Jungle"
          iconName={activeTab === 'Jungle' ? 'leaf' : 'leaf-outline'}
          active={activeTab === 'Jungle'}
          onPress={() => setActiveTab('Jungle')}
        />
        <TabButton
          label="Shop"
          iconName={activeTab === 'Shop' ? 'storefront' : 'storefront-outline'}
          active={activeTab === 'Shop'}
          onPress={() => setActiveTab('Shop')}
        />
        <TabButton
          label="Cart"
          iconName={activeTab === 'Cart' ? 'bag-handle' : 'bag-handle-outline'}
          active={activeTab === 'Cart'}
          badgeCount={totalCartItems}
          onPress={() => setActiveTab('Cart')}
        />
        <TabButton
          label="Profile"
          iconName={activeTab === 'Profile' ? 'person' : 'person-outline'}
          active={activeTab === 'Profile'}
          onPress={() => setActiveTab('Profile')}
        />
      </View>
    </SafeAreaView>
  );
}

// Bottom Navigation Tab Item Component
function TabButton({ label, iconName, active, badgeCount = 0, onPress }) {
  return (
    <TouchableOpacity
      style={styles.tabItem}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={[styles.tabIconWrapper, active && styles.tabIconWrapperActive]}>
        <Ionicons
          name={iconName}
          size={22}
          color={active ? '#1B4332' : '#748E81'}
        />
        {badgeCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {badgeCount > 9 ? '9+' : badgeCount}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ==========================================
// 1. AUTH SCREEN WITH OTP VERIFICATION FLOW
// ==========================================

function AuthScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP Verification State
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  // LOGIN AND SIGNUP
  const handleSubmit = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = fullName.trim();

    // SIGNUP VALIDATION
    if (isSignUp) {
      if (!cleanName || !cleanEmail || !cleanPassword) {
        Alert.alert('Validation Error', 'Please fill in all required fields.');
        return;
      }

      const isValidEmail =
        cleanEmail.includes('@') && cleanEmail.includes('.');

      if (!isValidEmail) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }

      if (cleanPassword.length < 8) {
        Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
        return;
      }

      // SIMULATED OTP
      const simulatedOtp = '4829';
      setGeneratedOtp(simulatedOtp);

      Alert.alert(
        'Verification Code Sent',
        `Verification code ${simulatedOtp} sent to your email!`
      );

      setIsOtpModalVisible(true);
      return;
    }

    // LOGIN VALIDATION
    if (!cleanEmail || !cleanPassword) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    // LOGIN API
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Login Failed', data.message || 'Invalid email or password.');
        return;
      }

      Alert.alert('Success', 'Login successful!');
      onLoginSuccess(data.user.name, data.user.email, data.token);

    } catch (error) {
      console.log('Login Error:', error);
      Alert.alert('Connection Error', 'Unable to connect to Plantify server.');
    }
  };

  // VERIFY OTP AND REGISTER
  const handleVerifyOtp = async () => {
    if (enteredOtp.trim() !== generatedOtp) {
      Alert.alert('Invalid Code', 'The 4-digit verification code is incorrect.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Signup Failed', data.message || 'Unable to create your account.');
        return;
      }

      setIsOtpModalVisible(false);
      setEnteredOtp('');

      Alert.alert(
        'Account Created! 🎉',
        'Your account has been successfully created. Please sign in.',
        [
          {
            text: 'Sign In Now',
            onPress: () => {
              setIsSignUp(false);
              setPassword('');
            },
          },
        ]
      );

    } catch (error) {
      console.log('Signup Error:', error);
      Alert.alert('Connection Error', 'Unable to connect to Plantify server.');
    }
  };

  // SOCIAL LOGIN
  const handleSocialLogin = (provider) => {
    onLoginSuccess(
      `${provider} User`,
      `${provider.toLowerCase()}user@plantify.app`
    );
  };

  // ==========================================
  // AUTH SCREEN UI
  // ==========================================
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flexOne}
    >
      <ScrollView
        contentContainerStyle={styles.loginScroll}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: LOGIN_HERO_IMAGE }}
          style={styles.heroBanner}
          imageStyle={styles.heroBannerImage}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.logoPill}>
              <Ionicons name="leaf" size={14} color="#A7F3D0" />
              <Text style={styles.logoPillText}>PLANTIFY</Text>
            </View>

            <Text style={styles.heroTitle}>
              {isSignUp
                ? 'Join Our Botanical Community'
                : 'Cultivate Your Sanctuary'}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.loginCard}>
          <Text style={styles.welcomeHeading}>
            {isSignUp ? 'Create Account' : 'Welcome back'}
          </Text>

          <Text style={styles.welcomeSub}>
            {isSignUp
              ? 'Sign up with a valid email and 8+ character password.'
              : 'Sign in to check plant health and hydration routines.'}
          </Text>

          {isSignUp && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={19} color="#52796F" />
                <TextInput
                  style={styles.inputBoxText}
                  placeholder="Alex Green"
                  placeholderTextColor="#94A39B"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={19} color="#52796F" />
              <TextInput
                style={styles.inputBoxText}
                placeholder="gardener@plantify.app"
                placeholderTextColor="#94A39B"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={19} color="#52796F" />
              <TextInput
                style={styles.inputBoxText}
                placeholder="••••••••"
                placeholderTextColor="#94A39B"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryCta}
            activeOpacity={0.88}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryCtaText}>
              {isSignUp ? 'Continue to Verification' : 'Sign In'}
            </Text>
            <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialBtn}
              activeOpacity={0.8}
              onPress={() => handleSocialLogin('Google')}
            >
              <AntDesign name="google" size={18} color="#EA4335" />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              activeOpacity={0.8}
              onPress={() => handleSocialLogin('Facebook')}
            >
              <FontAwesome name="facebook" size={18} color="#1877F2" />
              <Text style={styles.socialBtnText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Sign In / Sign Up */}
          <TouchableOpacity
            style={styles.toggleAuthView}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.toggleAuthPrompt}>
              {isSignUp
                ? 'Already have an account? '
                : "Don't have an account? "}
              <Text style={styles.toggleAuthAction}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* OTP Verification Modal */}
      <Modal
        visible={isOtpModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsOtpModalVisible(false)}
      >
        <View style={styles.otpModalOverlay}>
          <View style={styles.otpModalCard}>
            <View style={styles.otpIconBadge}>
              <Ionicons
                name="shield-checkmark"
                size={32}
                color="#166534"
              />
            </View>

            <Text style={styles.otpModalTitle}>Verify Your Email</Text>

            <Text style={styles.otpModalSub}>
              Enter the 4-digit code sent to {email}. (Hint: {generatedOtp})
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="1234"
              placeholderTextColor="#94A39B"
              keyboardType="numeric"
              maxLength={4}
              value={enteredOtp}
              onChangeText={setEnteredOtp}
            />

            <TouchableOpacity
              style={[styles.primaryCta, { marginTop: 16 }]}
              onPress={handleVerifyOtp}
            >
              <Text style={styles.primaryCtaText}>
                Verify & Complete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.otpCancelBtn}
              onPress={() => setIsOtpModalVisible(false)}
            >
              <Text style={styles.otpCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

 



// ==========================================
// 2. TAB 1: MY JUNGLE & WATERING NOTIFICATION
// ==========================================
function JungleDashboardScreen({
  plants,
  onNavigateAdd,
  onWaterPlant,
  onDeletePlant,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesCategory =
        selectedCategory === 'All' || plant.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        plant.name.toLowerCase().includes(query) ||
        plant.species.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [plants, selectedCategory, searchQuery]);

  const healthyCount = plants.filter((p) => p.health === 'Healthy').length;
  const thirstyCount = plants.filter((p) => p.health !== 'Healthy').length;

  const getHealthBadgeStyle = (status) => {
    switch (status) {
      case 'Healthy':
        return { bg: '#E6F6EC', text: '#166534', dot: '#22C55E' };
      case 'Needs Water':
        return { bg: '#FEF5E7', text: '#9A3412', dot: '#F59E0B' };
      case 'Critical':
        return { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' };
      default:
        return { bg: '#F1F5F9', text: '#475569', dot: '#64748B' };
    }
  };

  const renderPlantCard = ({ item }) => {
    const healthStyle = getHealthBadgeStyle(item.health);

    return (
      <View style={styles.plantCard}>
        <View style={styles.cardTopSection}>
          <Image
  source={{ uri: item.imageUrl || DEFAULT_PLANT_IMAGE }}
  style={styles.plantThumbnail}
  resizeMode="cover"
  onLoad={() => console.log('PLANT IMAGE LOADED:', item.name)}
  onError={(error) => console.log('PLANT IMAGE ERROR:', error.nativeEvent)}
/>

          <View style={styles.plantDetails}>
            <View style={styles.plantTitleRow}>
              <Text style={styles.plantName} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() => onDeletePlant(item.id, item.name)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.subtleDeleteBtn}
              >
                <Ionicons name="trash-outline" size={17} color="#94A39B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.plantSpecies} numberOfLines={1}>
              {item.species}
            </Text>

            <View style={styles.pillContainer}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{item.category}</Text>
              </View>

              <View style={[styles.healthPill, { backgroundColor: healthStyle.bg }]}>
                <View
                  style={[styles.statusDot, { backgroundColor: healthStyle.dot }]}
                />
                <Text style={[styles.healthPillText, { color: healthStyle.text }]}>
                  {item.health}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardActionFooter}>
          <View style={styles.hydrationInfo}>
            <View style={styles.hydrationMetaRow}>
              <Ionicons
                name={item.isWateredToday ? 'checkmark-circle' : 'time-outline'}
                size={15}
                color={item.isWateredToday ? '#15803D' : '#52796F'}
              />
              <Text
                style={[
                  styles.lastWateredText,
                  item.isWateredToday && styles.lastWateredSuccess,
                ]}
              >
                {item.lastWatered}
              </Text>
            </View>
            <Text style={styles.scheduleSubtext}>
              Watering: {item.wateringSchedule}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.waterButton,
              item.isWateredToday && styles.waterButtonDone,
            ]}
            activeOpacity={0.8}
            onPress={() => onWaterPlant(item.id)}
          >
            <Ionicons
              name={item.isWateredToday ? 'checkmark' : 'water'}
              size={15}
              color={item.isWateredToday ? '#15803D' : '#FFFFFF'}
            />
            <Text
              style={[
                styles.waterButtonText,
                item.isWateredToday && styles.waterButtonTextDone,
              ]}
            >
              {item.isWateredToday ? 'Watered' : 'Water Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flexOne}>
      {/* Header */}
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.headerEyebrow}>SMART CARE TRACKER</Text>
          <Text style={styles.headerTitle}>My Jungle</Text>
        </View>
        <TouchableOpacity
          style={styles.addHeaderBtn}
          onPress={onNavigateAdd}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addHeaderBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Watering Notification Banner Simulation */}
      <View style={styles.notificationBanner}>
        <View style={styles.notificationBellBox}>
          <Ionicons name="notifications" size={18} color="#D97706" />
        </View>
        <View style={styles.notificationTextCol}>
          <Text style={styles.notificationTitle}>Watering Alert</Text>
          <Text style={styles.notificationSubtitle}>
            {thirstyCount > 0
              ? `Reminder: ${thirstyCount} plant${thirstyCount > 1 ? 's' : ''} need watering today.`
              : 'All plants are fully hydrated and thriving!'}
          </Text>
        </View>
      </View>

      {/* Stats Counters */}
      <View style={styles.statsCardRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{plants.length}</Text>
          <Text style={styles.statCaption}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#15803D' }]}>{healthyCount}</Text>
          <Text style={styles.statCaption}>Thriving</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#D97706' }]}>{thirstyCount}</Text>
          <Text style={styles.statCaption}>Needs Care</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#6B8E7B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search plants or species..."
            placeholderTextColor="#8FA89B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#8FA89B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.chipBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScrollContent}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Plants List */}
      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => `${item.isFromDatabase ? 'db' : 'mock'}-${item.id}`}
        renderItem={renderPlantCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="leaf-outline" size={32} color="#2D6A4F" />
            </View>
            <Text style={styles.emptyHeading}>No plants match</Text>
            <Text style={styles.emptySubtext}>
              Adjust your search filters or tap "+ Add" to expand your jungle.
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ==========================================
// 3. TAB 2: SHOP (MARKETPLACE)
// ==========================================
function ShopScreen({ catalog, onAddToCart, cartCount, onGoToCart }) {
  const getDifficultyColors = (level) => {
    switch (level) {
      case 'Beginner':
      case 'Easy':
        return { bg: '#E6F6EC', text: '#166534' };
      case 'Moderate':
        return { bg: '#FEF5E7', text: '#9A3412' };
      case 'Expert':
        return { bg: '#FEE2E2', text: '#991B1B' };
      default:
        return { bg: '#F1F5F9', text: '#334155' };
    }
  };

  const renderShopItem = ({ item }) => {
    const diffColors = getDifficultyColors(item.difficulty);

    return (
      <View style={styles.shopCard}>
        <View style={styles.shopImageContainer}>
         <Image
  source={{ uri: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=600' }}
  style={[styles.plantThumbnail, { width: 100, height: 100 }]}
  resizeMode="cover"
/>
          <View style={[styles.difficultyBadge, { backgroundColor: diffColors.bg }]}>
            <Text style={[styles.difficultyText, { color: diffColors.text }]}>
              {item.difficulty}
            </Text>
          </View>
        </View>

        <View style={styles.shopCardBody}>
          <Text style={styles.shopPlantName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.shopSpecies} numberOfLines={1}>
            {item.species}
          </Text>

          <View style={styles.shopFooterRow}>
            <Text style={styles.shopPrice}>${item.price}</Text>
            <TouchableOpacity
              style={styles.addToCartBtn}
              activeOpacity={0.85}
              onPress={() => onAddToCart(item)}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addToCartText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.flexOne}>
      {/* Header */}
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.headerEyebrow}>BOTANICAL BOUTIQUE</Text>
          <Text style={styles.headerTitle}>Plant Store</Text>
        </View>

        <TouchableOpacity
          style={styles.cartHeaderPill}
          onPress={onGoToCart}
          activeOpacity={0.8}
        >
          <Ionicons name="bag-handle-outline" size={19} color="#1B4332" />
          <Text style={styles.cartHeaderPillText}>{cartCount}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={catalog}
        keyExtractor={(item) => item.id}
        renderItem={renderShopItem}
        numColumns={2}
        columnWrapperStyle={styles.shopGridRow}
        contentContainerStyle={styles.shopListContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ==========================================
// 4. TAB 3: CART, SECURE CHECKOUT & RECEIPT MODAL
// ==========================================
function CartScreen({
  cart,
  userEmail,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess,
  onBrowseShop,
}) {
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  // Receipt Modal State
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 6 : 0;
  const total = subtotal + shipping;

  const handleConfirmPayment = () => {
    const cleanName = fullName.trim();
    const cleanAddress = address.trim();
    const cleanCard = cardNumber.replace(/\s+/g, '');
    const cleanExpiry = expiry.trim();

    if (!cleanName || !cleanAddress || !cleanCard || !cleanExpiry) {
      Alert.alert('Incomplete Details', 'Please fill in all shipping and payment fields.');
      return;
    }

    // Credit Card Validation Rule: exactly 16-digit numeric format
    const isValidCard = /^\d{16}$/.test(cleanCard);
    if (!isValidCard) {
      Alert.alert(
        'Invalid Card Number',
        'Please enter a valid 16-digit credit card number (numeric characters only).'
      );
      return;
    }

    const maskedCard = `**** **** **** ${cleanCard.slice(-4)}`;
    const orderId = `#PLT-${Math.floor(1000 + Math.random() * 9000)}`;

    setCompletedOrderData({
      orderId,
      totalAmount: total.toFixed(2),
      address: cleanAddress,
      maskedCard,
      fullName: cleanName,
    });

    setIsCheckoutModalVisible(false);
    setIsReceiptModalVisible(true);
  };

  const handleFinishReceipt = () => {
    setIsReceiptModalVisible(false);
    onCheckoutSuccess(completedOrderData);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemCard}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.cartItemImage}
        resizeMode="cover"
      />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cartItemSpecies} numberOfLines={1}>
          {item.species}
        </Text>
        <Text style={styles.cartItemPrice}>${item.price * item.quantity}</Text>
      </View>

      {/* Quantity Stepper & Delete */}
      <View style={styles.cartActionsCol}>
        <TouchableOpacity
          onPress={() => onRemoveItem(item.id)}
          style={styles.deleteItemBtn}
        >
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
        </TouchableOpacity>

        <View style={styles.qtyStepper}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQuantity(item.id, -1)}
          >
            <Ionicons name="remove" size={14} color="#132A1C" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQuantity(item.id, 1)}
          >
            <Ionicons name="add" size={14} color="#132A1C" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.flexOne}>
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.headerEyebrow}>YOUR BASKET</Text>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bag-handle-outline" size={32} color="#2D6A4F" />
          </View>
          <Text style={styles.emptyHeading}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>
            Explore our curated botanical store to bring fresh greenery home.
          </Text>
          <TouchableOpacity
            style={[styles.primaryCta, { marginTop: 20, paddingHorizontal: 24 }]}
            onPress={onBrowseShop}
          >
            <Text style={styles.primaryCtaText}>Browse Plant Store</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.cartListContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Checkout Summary Panel */}
          <View style={styles.checkoutSummaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Eco-Safe Delivery</Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryCta, { marginTop: 14 }]}
              activeOpacity={0.88}
              onPress={() => setIsCheckoutModalVisible(true)}
            >
              <Ionicons name="card-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryCtaText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Checkout Modal */}
      <Modal
        visible={isCheckoutModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsCheckoutModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Secure Checkout</Text>
            <TouchableOpacity onPress={() => setIsCheckoutModalVisible(false)}>
              <Ionicons name="close" size={24} color="#132A1C" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalSectionTitle}>Shipping Information</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.cleanInput}
                placeholder="Alex Green"
                placeholderTextColor="#94A39B"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Delivery Address</Text>
              <TextInput
                style={styles.cleanInput}
                placeholder="123 Botanical Way, Green City"
                placeholderTextColor="#94A39B"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <Text style={[styles.modalSectionTitle, { marginTop: 16 }]}>
              Payment Details
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Credit Card Number (16 Digits)</Text>
              <TextInput
                style={styles.cleanInput}
                placeholder="4000123456789010"
                placeholderTextColor="#94A39B"
                keyboardType="numeric"
                maxLength={16}
                value={cardNumber}
                onChangeText={setCardNumber}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Expiration Date (MM/YY)</Text>
              <TextInput
                style={styles.cleanInput}
                placeholder="12/28"
                placeholderTextColor="#94A39B"
                value={expiry}
                onChangeText={setExpiry}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryCta, { marginTop: 24 }]}
              activeOpacity={0.88}
              onPress={handleConfirmPayment}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryCtaText}>
                Confirm Payment (${total.toFixed(2)})
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Detailed Payment Confirmation Receipt Modal */}
      <Modal
        visible={isReceiptModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleFinishReceipt}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.receiptScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.receiptSuccessCircle}>
              <Ionicons name="checkmark" size={40} color="#166534" />
            </View>

            <Text style={styles.receiptHeading}>Payment Successful!</Text>
            <Text style={styles.receiptSubtext}>
              Your greenhouse plants are ready for dispatch.
            </Text>

            <View style={styles.receiptCard}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Order ID</Text>
                <Text style={styles.receiptValueBold}>
                  {completedOrderData?.orderId}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Total Amount Paid</Text>
                <Text style={styles.receiptValueGreen}>
                  ${completedOrderData?.totalAmount}
                </Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Recipient</Text>
                <Text style={styles.receiptValue}>
                  {completedOrderData?.fullName}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Delivery Address</Text>
                <Text style={styles.receiptValue} numberOfLines={2}>
                  {completedOrderData?.address}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Payment Method</Text>
                <Text style={styles.receiptValue}>
                  {completedOrderData?.maskedCard}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryCta, { marginTop: 24 }]}
              activeOpacity={0.88}
              onPress={handleFinishReceipt}
            >
              <Ionicons name="storefront-outline" size={19} color="#FFFFFF" />
              <Text style={styles.primaryCtaText}>Continue Shopping</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

// ==========================================
// 5. TAB 4: PROFILE SCREEN
// ==========================================
function ProfileScreen({ userName, userEmail, plants, totalWaterings, onLogout }) {
  const displayName = userName || (userEmail ? userEmail.split('@')[0] : 'Plant Enthusiast');

  const healthyRatio =
    plants.length > 0
      ? Math.round(
          (plants.filter((p) => p.health === 'Healthy').length / plants.length) *
            100
        )
      : 100;

  return (
    <ScrollView
      contentContainerStyle={styles.profileScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.headerEyebrow}>ACCOUNT</Text>
          <Text style={styles.headerTitle}>Gardener Profile</Text>
        </View>
      </View>

      {/* Avatar & Identity Card */}
      <View style={styles.profileHeroCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>
            {(displayName[0] || 'G').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{displayName}</Text>
        <Text style={styles.profileEmail}>{userEmail || 'gardener@plantify.app'}</Text>
        <View style={styles.memberBadge}>
          <Ionicons name="sparkles" size={13} color="#15803D" />
          <Text style={styles.memberBadgeText}>Greenhouse Pro Member</Text>
        </View>
      </View>

      {/* Care Summary Stats */}
      <Text style={styles.sectionHeading}>Care Summary</Text>
      <View style={styles.profileStatsGrid}>
        <View style={styles.profileStatCard}>
          <Ionicons name="leaf" size={22} color="#2D6A4F" />
          <Text style={styles.profileStatNum}>{plants.length}</Text>
          <Text style={styles.profileStatLabel}>Active Plants</Text>
        </View>

        <View style={styles.profileStatCard}>
          <Ionicons name="water" size={22} color="#0284C7" />
          <Text style={styles.profileStatNum}>{totalWaterings}</Text>
          <Text style={styles.profileStatLabel}>Waterings Logged</Text>
        </View>

        <View style={styles.profileStatCard}>
          <Ionicons name="heart" size={22} color="#16A34A" />
          <Text style={styles.profileStatNum}>{healthyRatio}%</Text>
          <Text style={styles.profileStatLabel}>Jungle Vitality</Text>
        </View>
      </View>

      {/* Sign Out Action */}
      <TouchableOpacity
        style={styles.signOutButton}
        activeOpacity={0.85}
        onPress={onLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ==========================================
// 6. ADD PLANT SCREEN
// ==========================================
function AddPlantScreen({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [category, setCategory] = useState('Indoor');
  const [health, setHealth] = useState('Healthy');
  const [wateringSchedule, setWateringSchedule] = useState('Every 7 days');
  const [imageUrl, setImageUrl] = useState('');

  const handleSave = () => {
    if (!name.trim() || !species.trim()) {
      Alert.alert(
        'Required Fields',
        'Please enter both a plant nickname and botanical species.'
      );
      return;
    }

    onSave({
      name: name.trim(),
      species: species.trim(),
      category,
      health,
      wateringSchedule,
      imageUrl: imageUrl.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flexOne}
    >
      <View style={styles.modalHeader}>
        <TouchableOpacity
          onPress={onCancel}
          style={styles.modalBackBtn}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#132A1C" />
        </TouchableOpacity>
        <Text style={styles.modalHeaderTitle}>Add New Plant</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.formScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imagePreviewCard}>
          <Image
            source={{ uri: imageUrl.trim() || DEFAULT_PLANT_IMAGE }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
          <View style={styles.previewCaptionPill}>
            <Ionicons name="camera-outline" size={14} color="#FFFFFF" />
            <Text style={styles.previewCaptionText}>Cover Photo Preview</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Plant Nickname *</Text>
            <TextInput
              style={styles.cleanInput}
              placeholder="e.g., Oliver"
              placeholderTextColor="#94A39B"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Botanical Species *</Text>
            <TextInput
              style={styles.cleanInput}
              placeholder="e.g., Calathea Orbifolia"
              placeholderTextColor="#94A39B"
              value={species}
              onChangeText={setSpecies}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Photo URL (Optional)</Text>
            <View style={styles.inputBox}>
              <Ionicons name="link-outline" size={18} color="#52796F" />
              <TextInput
                style={styles.inputBoxText}
                placeholder="https://images.unsplash.com/..."
                placeholderTextColor="#94A39B"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                value={imageUrl}
                onChangeText={setImageUrl}
              />
              {imageUrl.length > 0 && (
                <TouchableOpacity onPress={() => setImageUrl('')}>
                  <Ionicons name="close-circle" size={18} color="#94A39B" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.wrapPillGrid}>
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
                const active = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.selectPill, active && styles.selectPillActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.selectPillText,
                        active && styles.selectPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Health Status</Text>
            <View style={styles.equalRow}>
              {HEALTH_OPTIONS.map((option) => {
                const active = health === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.equalPill, active && styles.selectPillActive]}
                    onPress={() => setHealth(option)}
                  >
                    <Text
                      style={[
                        styles.selectPillText,
                        active && styles.selectPillTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Watering Frequency</Text>
            <View style={styles.wrapPillGrid}>
              {WATERING_PRESETS.map((preset) => {
                const active = wateringSchedule === preset;
                return (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.waterSelectPill,
                      active && styles.waterSelectPillActive,
                    ]}
                    onPress={() => setWateringSchedule(preset)}
                  >
                    <Ionicons
                      name="water-outline"
                      size={14}
                      color={active ? '#FFFFFF' : '#0369A1'}
                    />
                    <Text
                      style={[
                        styles.waterSelectText,
                        active && styles.waterSelectTextActive,
                      ]}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryCta}
          activeOpacity={0.88}
          onPress={handleSave}
        >
          <Ionicons name="leaf" size={18} color="#FFFFFF" />
          <Text style={styles.primaryCtaText}>Save to My Jungle</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==========================================
// STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9F7',
  },
  flexOne: {
    flex: 1,
  },

  // --- Splash Screen ---
  splashContainer: {
    flex: 1,
    backgroundColor: '#132A1C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  splashBadgeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(167, 243, 208, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(167, 243, 208, 0.3)',
  },
  splashTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    fontSize: 16,
    color: '#A7F3D0',
    marginTop: 8,
    fontWeight: '500',
  },
  splashLoaderBox: {
    position: 'absolute',
    bottom: 64,
    alignItems: 'center',
    gap: 12,
  },
  splashLoadingText: {
    color: '#D1FAE5',
    fontSize: 13,
    fontWeight: '600',
  },

  // --- Bottom Navigation Bar ---
  bottomNavBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E6EFEA',
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabIconWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
    position: 'relative',
  },
  tabIconWrapperActive: {
    backgroundColor: '#E3F1E9',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#748E81',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#1B4332',
    fontWeight: '800',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 6,
    backgroundColor: '#1B4332',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  // --- Shared Screen Headers ---
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#52796F',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#132A1C',
    letterSpacing: -0.4,
  },
  addHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B4332',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    gap: 4,
  },
  addHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // --- Auth Screen Styles ---
  loginScroll: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heroBanner: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: -24,
  },
  heroBannerImage: {
    borderRadius: 24,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(19, 42, 28, 0.56)',
    padding: 20,
    justifyContent: 'space-between',
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  logoPillText: {
    color: '#ECFDF5',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 10,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#132A1C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  welcomeHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#132A1C',
  },
  welcomeSub: {
    fontSize: 14,
    color: '#52796F',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2ECE6',
  },
  dividerText: {
    fontSize: 12,
    color: '#748E81',
    fontWeight: '600',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FBF9',
    borderWidth: 1,
    borderColor: '#DCE8E0',
    borderRadius: 14,
    height: 46,
    gap: 8,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#132A1C',
  },
  toggleAuthView: {
    alignItems: 'center',
    marginTop: 6,
  },
  toggleAuthPrompt: {
    fontSize: 13,
    color: '#647C70',
  },
  toggleAuthAction: {
    color: '#2D6A4F',
    fontWeight: '800',
  },

  // --- OTP Modal Styles ---
  otpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(19, 42, 28, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  otpModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  otpIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F6EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  otpModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#132A1C',
    marginBottom: 6,
  },
  otpModalSub: {
    fontSize: 13,
    color: '#52796F',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  otpInput: {
    backgroundColor: '#F8FBF9',
    borderWidth: 1,
    borderColor: '#DCE8E0',
    borderRadius: 14,
    width: '100%',
    height: 52,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#132A1C',
    letterSpacing: 6,
  },
  otpCancelBtn: {
    marginTop: 12,
    paddingVertical: 8,
  },
  otpCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },

  // --- Watering Notification Banner ---
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 12,
  },
  notificationBellBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF9C3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationTextCol: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  notificationSubtitle: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 1,
  },

  // --- Jungle Dashboard ---
  statsCardRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0EB',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#132A1C',
  },
  statCaption: {
    fontSize: 12,
    fontWeight: '600',
    color: '#647C70',
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#132A1C',
    height: '100%',
  },
  chipBarWrapper: {
    marginTop: 12,
    marginBottom: 6,
  },
  chipScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECE6',
  },
  filterChipActive: {
    backgroundColor: '#1B4332',
    borderColor: '#1B4332',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#52796F',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  plantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#132A1C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDF3EF',
  },
  cardTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  plantThumbnail: {
    width: 78,
    height: 78,
    borderRadius: 16,
    backgroundColor: '#E8F0EB',
  },
  plantDetails: {
    flex: 1,
  },
  plantTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#132A1C',
    flex: 1,
  },
  subtleDeleteBtn: {
    padding: 4,
  },
  plantSpecies: {
    fontSize: 13,
    color: '#647C70',
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 8,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryTag: {
    backgroundColor: '#F1F6F3',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3D5A4C',
  },
  healthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  healthPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F5F2',
    marginVertical: 11,
  },
  cardActionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hydrationInfo: {
    flex: 1,
  },
  hydrationMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lastWateredText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#132A1C',
  },
  lastWateredSuccess: {
    color: '#15803D',
  },
  scheduleSubtext: {
    fontSize: 12,
    color: '#748E81',
    marginTop: 2,
  },
  waterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 5,
  },
  waterButtonDone: {
    backgroundColor: '#E6F6EC',
  },
  waterButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  waterButtonTextDone: {
    color: '#15803D',
  },

  // --- Shop Marketplace ---
  cartHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F1E9',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  cartHeaderPillText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1B4332',
  },
  shopListContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
  },
  shopGridRow: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  shopCard: {
    width: '48.2%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8F0EB',
    shadowColor: '#132A1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  shopImageContainer: {
    height: 140,
    width: '100%',
    backgroundColor: '#E8F0EB',
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: '100%',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '800',
  },
  shopCardBody: {
    padding: 12,
  },
  shopPlantName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#132A1C',
  },
  shopSpecies: {
    fontSize: 12,
    color: '#647C70',
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 10,
  },
  shopFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1B4332',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 3,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // --- Shopping Cart ---
  cartListContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 20,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F0EB',
    gap: 12,
  },
  cartItemImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#E8F0EB',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#132A1C',
  },
  cartItemSpecies: {
    fontSize: 12,
    color: '#647C70',
    marginTop: 2,
  },
  cartItemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D6A4F',
    marginTop: 4,
  },
  cartActionsCol: {
    alignItems: 'flex-end',
    gap: 8,
  },
  deleteItemBtn: {
    padding: 4,
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F7F4',
    borderRadius: 12,
    padding: 4,
    gap: 8,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#132A1C',
    minWidth: 16,
    textAlign: 'center',
  },
  checkoutSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8F0EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#647C70',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    color: '#132A1C',
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#EDF3EF',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#132A1C',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B4332',
  },

  // --- Checkout Modal ---
  modalContainer: {
    flex: 1,
    backgroundColor: '#F6F9F7',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F0EB',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#132A1C',
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#132A1C',
    marginBottom: 12,
  },

  // --- Detailed Payment Receipt Modal Styles ---
  receiptScrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  receiptSuccessCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F6EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  receiptHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#132A1C',
    marginBottom: 6,
  },
  receiptSubtext: {
    fontSize: 14,
    color: '#52796F',
    textAlign: 'center',
    marginBottom: 24,
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8F0EB',
    shadowColor: '#132A1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  receiptLabel: {
    fontSize: 13,
    color: '#647C70',
    fontWeight: '600',
  },
  receiptValue: {
    fontSize: 14,
    color: '#132A1C',
    fontWeight: '700',
    textAlign: 'right',
    maxWidth: '60%',
  },
  receiptValueBold: {
    fontSize: 14,
    color: '#1B4332',
    fontWeight: '800',
  },
  receiptValueGreen: {
    fontSize: 16,
    color: '#166534',
    fontWeight: '800',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#EDF3EF',
    marginVertical: 6,
    marginBottom: 14,
  },

  // --- Profile Screen ---
  profileScroll: {
    paddingBottom: 32,
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 6,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0EB',
  },
  avatarLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#1B4332',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#A7F3D0',
  },
  profileName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#132A1C',
    textTransform: 'capitalize',
  },
  profileEmail: {
    fontSize: 14,
    color: '#647C70',
    marginTop: 2,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F6EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginTop: 12,
  },
  memberBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#132A1C',
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },
  profileStatsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  profileStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0EB',
  },
  profileStatNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#132A1C',
    marginTop: 8,
  },
  profileStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#647C70',
    marginTop: 2,
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: 20,
    marginTop: 28,
    height: 50,
    borderRadius: 16,
    gap: 8,
  },
  signOutText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '800',
  },

  // --- Empty State ---
  emptyContainer: {
    alignItems: 'center',
    marginTop: 54,
    paddingHorizontal: 28,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F2EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#132A1C',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#647C70',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },

  // --- Add Plant Form & Shared Controls ---
  modalBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2ECE6',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#132A1C',
  },
  formScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imagePreviewCard: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E2ECE6',
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  previewCaptionPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 42, 28, 0.78)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  previewCaptionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8F0EB',
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3D5A4C',
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cleanInput: {
    backgroundColor: '#F8FBF9',
    borderWidth: 1,
    borderColor: '#DCE8E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: '#132A1C',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FBF9',
    borderWidth: 1,
    borderColor: '#DCE8E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  inputBoxText: {
    flex: 1,
    fontSize: 15,
    color: '#132A1C',
    height: '100%',
  },
  wrapPillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F4F8F6',
    borderWidth: 1,
    borderColor: '#DCE8E0',
  },
  selectPillActive: {
    backgroundColor: '#1B4332',
    borderColor: '#1B4332',
  },
  selectPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#52796F',
  },
  selectPillTextActive: {
    color: '#FFFFFF',
  },
  equalRow: {
    flexDirection: 'row',
    gap: 8,
  },
  equalPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F4F8F6',
    borderWidth: 1,
    borderColor: '#DCE8E0',
    alignItems: 'center',
  },
  waterSelectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#EFF8FF',
    borderWidth: 1,
    borderColor: '#D1E9FF',
    gap: 5,
  },
  waterSelectPillActive: {
    backgroundColor: '#0369A1',
    borderColor: '#0369A1',
  },
  waterSelectText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  waterSelectTextActive: {
    color: '#FFFFFF',
  },
  primaryCta: {
    backgroundColor: '#1B4332',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});