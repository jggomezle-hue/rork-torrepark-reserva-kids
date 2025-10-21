import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import type { WebView as WebViewType } from 'react-native-webview';

let WebView: any = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, Users, User, Mail, Phone, FileText, CheckCircle2 } from 'lucide-react-native';
import { useBooking } from '@/app/contexts/BookingContext';
import Colors from '@/constants/colors';

let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

export default function BookingScreen() {
  const router = useRouter();
  const { createBooking, isSubmitting } = useBooking();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    numberOfKids: '',
    parentName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [tempDateValue, setTempDateValue] = useState<string>('');
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const webViewRef = useRef<WebViewType | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const checkWebView = setInterval(() => {
        const emailWebView = (global as any).__emailWebView;
        if (emailWebView?.html && !showWebView) {
          console.log('📱 WebView de email detectado en Android/iOS');
          setShowWebView(true);
        } else if (!emailWebView?.html && showWebView) {
          console.log('🗑️ WebView de email removido');
          setShowWebView(false);
        }
      }, 100);

      return () => clearInterval(checkWebView);
    }
  }, [showWebView]);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      setFormData({ ...formData, date: `${day}/${month}/${year}` });
    }
  };

  const handleWebDateChange = (dateString: string) => {
    if (dateString) {
      const date = new Date(dateString);
      setSelectedDate(date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      setFormData({ ...formData, date: `${day}/${month}/${year}` });
      setTempDateValue(dateString);
    }
  };

  const handleSubmit = async () => {
    if (!formData.date || !formData.time || !formData.numberOfKids || !formData.parentName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Por favor introduce un email válido');
      return;
    }

    const numberOfKids = parseInt(formData.numberOfKids);
    if (isNaN(numberOfKids) || numberOfKids < 1) {
      Alert.alert('Error', 'El número de niños debe ser mayor a 0');
      return;
    }

    const success = await createBooking({
      date: formData.date,
      time: formData.time,
      numberOfKids,
      parentName: formData.parentName,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
    });

    if (success) {
      Alert.alert(
        '¡Reserva Confirmada! 🎉',
        'Tu reserva ha sido enviada correctamente. Recibirás un email de confirmación pronto.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                date: '',
                time: '',
                numberOfKids: '',
                parentName: '',
                email: '',
                phone: '',
                notes: '',
              });
              router.back();
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', 'No se pudo procesar tu reserva. Por favor intenta de nuevo.');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Nueva Reserva',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: '700' as const,
          },
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.bannerTitle}>Reserva tu Visita</Text>
          <Text style={styles.bannerSubtitle}>Completa el formulario y te confirmaremos por email</Text>
        </LinearGradient>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Fecha y Hora</Text>

            {Platform.OS === 'web' ? (
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Calendar size={20} color={Colors.primary} />
                </View>
                <TextInput
                  style={[styles.input, styles.webDateInput]}
                  placeholder="Selecciona una fecha"
                  value={formData.date}
                  editable={false}
                  placeholderTextColor={Colors.textLight}
                />
                <input
                  type="date"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  value={tempDateValue}
                  onChange={(e: any) => handleWebDateChange(e.target.value)}
                />
              </View>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.inputIcon}>
                    <Calendar size={20} color={Colors.primary} />
                  </View>
                  <Text style={[styles.input, !formData.date && styles.placeholder]}>
                    {formData.date || 'Selecciona una fecha'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && DateTimePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    locale="es-ES"
                  />
                )}

                {Platform.OS === 'ios' && showDatePicker && (
                  <TouchableOpacity
                    style={styles.closePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.closePickerText}>Cerrar</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Clock size={20} color={Colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Hora (ej: 16:00)"
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Users size={20} color={Colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Número de niños"
                value={formData.numberOfKids}
                onChangeText={(text) => setFormData({ ...formData, numberOfKids: text })}
                keyboardType="number-pad"
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Datos de Contacto</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User size={20} color={Colors.secondary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={formData.parentName}
                onChangeText={(text) => setFormData({ ...formData, parentName: text })}
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Mail size={20} color={Colors.secondary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Phone size={20} color={Colors.secondary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Información Adicional</Text>

            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <View style={[styles.inputIcon, styles.textAreaIcon]}>
                <FileText size={20} color={Colors.purple} />
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notas o peticiones especiales (opcional)"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={4}
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.orange]}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <CheckCircle2 size={24} color="white" />
                  <Text style={styles.submitText}>Confirmar Reserva</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {Platform.OS !== 'web' && showWebView && (global as any).__emailWebView?.html && (
          <WebView
            ref={webViewRef}
            source={{ html: (global as any).__emailWebView.html }}
            style={{ width: 0, height: 0, opacity: 0 }}
            onMessage={(event: any) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                console.log('📧 Mensaje recibido de WebView:', data);
                if ((global as any).__emailWebView?.onMessage) {
                  (global as any).__emailWebView.onMessage(data.success);
                  delete (global as any).__emailWebView;
                }
              } catch (error) {
                console.error('Error procesando mensaje de WebView:', error);
              }
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={['*']}
          />
        )}
      </ScrollView>
    </>
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
  banner: {
    padding: 24,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: 'white',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.95,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  textAreaIcon: {
    marginTop: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: 'white',
    marginLeft: 12,
  },
  placeholder: {
    color: Colors.textLight,
  },
  closePickerButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  closePickerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  webDateInput: {
    pointerEvents: 'none',
  },
});
