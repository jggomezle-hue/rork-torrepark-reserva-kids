import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Clock, MapPin, Star, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/7xm4r2z7vynji7knoe1wo' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>TORREPARK</Text>
          <Text style={styles.headerSubtitle}>Parque de Bolas Infantil</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="white" />
            <Text style={styles.location}>Torre del Mar</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>¡Diversión sin límites! 🎉</Text>
          <Text style={styles.welcomeText}>
            El mejor parque de bolas para que tus peques disfruten, salten y jueguen en un ambiente seguro y divertido.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.accent }]}>
              <Clock size={32} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Horario Flexible</Text>
            <Text style={styles.featureText}>Abierto todos los días</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.pink }]}>
              <Star size={32} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Instalaciones</Text>
            <Text style={styles.featureText}>Seguras y limpias</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.green }]}>
              <Users size={32} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Grupos</Text>
            <Text style={styles.featureText}>Fiestas y eventos</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => router.push('/(tabs)/booking')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.orange]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Reservar Ahora</Text>
            <Sparkles size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>¿Por qué elegirnos?</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>🎈</Text>
            <Text style={styles.infoText}>Zona de juegos amplia y variada</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>🛡️</Text>
            <Text style={styles.infoText}>Personal cualificado y atento</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>🎂</Text>
            <Text style={styles.infoText}>Celebraciones de cumpleaños</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>☕</Text>
            <Text style={styles.infoText}>Zona de cafetería para padres</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: 'white',
    marginTop: 12,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 8,
    opacity: 0.95,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  location: {
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
    fontWeight: '600' as const,
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  bookingButton: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: 'white',
    marginRight: 12,
  },
  infoCard: {
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.secondary,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoBullet: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
});
