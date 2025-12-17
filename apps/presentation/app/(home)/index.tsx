import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Href, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacings } from 'react-native-ui-lib';
import UserProfile from '@/components/UserProfile';
import { useAuthStore, isAdmin, isMedicalStaff } from '@/stores/authStore';
import { AppColors } from '@/utils/styles/colors';

const theme = {
  borderRadius: 24,
  padding: Spacings.s5,
  imageSize: 180,
};

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

type menuItem = {
  id: string
  route: Href
  icon: IconName
  label: string
  type: string
}

const menuItems: menuItem[] = [
  {
    id: 'calculate',
    route: '/register',
    icon: 'calculate',
    label: 'Calcular dosis',
    type: 'primary',
  },
  {
    id: 'normalValues',
    label: 'Valores normales de HB',
    icon: 'bar-chart',
    route: '/normalValues',
    type: 'secondary',
  },
  {
    id: 'heightAdjust',
    label: 'Ajuste por altura',
    icon: 'flaky',
    route: '/heightAdjust',
    type: 'secondary',
  },
  {
    id: 'suplementsInfo',
    label: 'Tipo de suplementación',
    icon: 'medication',
    route: '/suplementsInfo',
    type: 'secondary',
  },
  {
    id: 'timeControlGuide',
    label: 'Cronograma de Control HB',
    icon: 'calendar-month',
    route: '/timeControlGuide',
    type: 'secondary',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Menú dinámico según rol
  const getRoleSpecificMenuItems = (): menuItem[] => {
    const items: menuItem[] = [];

    // Admin ve solo panel de administración
    if (isAdmin(user)) {
      items.push({
        id: 'admin',
        route: '/admin',
        icon: 'admin-panel-settings',
        label: 'Panel Administrador',
        type: 'primary',
      });
    }

    // Personal médico (Doctor/Enfermera) ve gestión de pacientes
    if (isMedicalStaff(user)) {
      items.push({
        id: 'patients',
        route: '/patients',
        icon: 'people',
        label: 'Gestión de Pacientes',
        type: 'primary',
      });
    }

    // Todos los usuarios pueden usar la calculadora e info
    items.push(...menuItems);

    return items;
  };

  const dynamicMenu = getRoleSpecificMenuItems();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
      >
        {/* User Profile */}
        <UserProfile />

        {/* HeadCar component */}
        <View style={styles.headerCard}>
          <Image
            style={styles.image}
            source={require('../../assets/icons/ImageIcon.png')}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={500}
          />
          <Text style={styles.title}>Dosis de Fe</Text>
          <Text style={styles.subtitle}>Tu asistente de cálculo de hierro</Text>
        </View>

        <View style={styles.actionsContainer}>
          {dynamicMenu.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route)}
              style={[
                styles.buttonBase,
                item.type === 'primary' ? styles.primaryButton : styles.secondaryButton,
                styles.buttonWithHover
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={Colors.white}
                  style={styles.buttonIcon}
                />
                <Text style={[
                  styles.buttonLabel,
                  item.type === 'primary' ? styles.primaryButtonLabel : styles.secondaryButtonLabel
                ]}>
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} DosisFe. Todos los derechos reservados.
          </Text>

          <TouchableOpacity onPress={() => router.push('/(home)/(aditionals)/legal')}>
            <Text style={styles.link}>
              Aviso Legal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(home)/(aditionals)/credits')}>
            <Text style={styles.link}>
              Ver créditos
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background.secondary,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.padding,
  },
  headerCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: theme.borderRadius,
    padding: theme.padding,
    marginBottom: Spacings.s8,
    shadowColor: AppColors.primary,

    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  image: {
    width: theme.imageSize,
    height: theme.imageSize,
    borderRadius: theme.borderRadius - 8,
    marginBottom: Spacings.s4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.primary,

    textAlign: 'center',
    fontFamily: 'System',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: AppColors.text.secondary,
    textAlign: 'center',
    fontFamily: 'System',

  },
  actionsContainer: {
    gap: Spacings.s4,
  },
  buttonBase: {
    borderRadius: 16,
    paddingHorizontal: Spacings.s5,
    height: 60,
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonWithHover: {
    transition: 'all 0.2s ease-in-out',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  primaryButton: {
    backgroundColor: AppColors.secondary,
    borderColor: AppColors.primary,
  },
  secondaryButton: {
    backgroundColor: AppColors.info,
    borderColor: AppColors.info,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    letterSpacing: 0.25,
  },
  primaryButtonLabel: {
    color: Colors.white,

  },
  secondaryButtonLabel: {
    color: Colors.white,
  },
  footer: {
    marginTop: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: AppColors.border.medium,
  },
  copyright: {
    fontSize: 14,
    color: AppColors.text.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  link: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

