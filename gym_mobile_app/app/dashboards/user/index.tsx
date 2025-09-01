import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { 
  HomeIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  CalendarDaysIcon, 
  ShoppingBagIcon, 
  TrophyIcon, 
  Cog6ToothIcon,
  HeartIcon,
  ChartPieIcon
} from 'react-native-heroicons/outline';
import { 
  HomeIcon as HomeIconSolid, 
  ChartBarIcon as ChartBarIconSolid, 
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid, 
  UserGroupIcon as UserGroupIconSolid, 
  CalendarDaysIcon as CalendarDaysIconSolid, 
  ShoppingBagIcon as ShoppingBagIconSolid, 
  TrophyIcon as TrophyIconSolid, 
  Cog6ToothIcon as Cog6ToothIconSolid,
  HeartIcon as HeartIconSolid,
  ChartPieIcon as ChartPieIconSolid
} from 'react-native-heroicons/solid';

// Import your screens
import HomeSummary from './HomeSummary';
import ProgressOverview from './ProgressOverview';
import MyPlans from './MyPlans';
import StatsOverview from './StatsOverview';
import Consultants from './Consultants';
import Appointments from './Appointments';
import Shop from './Shop';
import DailyChallenge from './DailyChallenge';
import ProfileSettings from './ProfileSettings';

const Tab = createBottomTabNavigator();

// Props type for your custom tab icon
type TabBarIconProps = {
  focused: boolean;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  solidIcon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({ focused, icon: Icon, solidIcon: SolidIcon, label }) => {
  return (
    <View style={styles.tabIconContainer}>
      {focused ? <SolidIcon size={24} color="#10B981" /> : <Icon size={24} color="#9CA3AF" />}
      <Text style={[styles.tabLabel, { color: focused ? "#10B981" : "#9CA3AF" }]}>{label}</Text>
    </View>
  );
};

// Group related tabs into a single tab with nested navigation
function FitnessTabGroup() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}
    >
      <Tab.Screen name="Progress" component={ProgressOverview} />
      <Tab.Screen name="Stats" component={StatsOverview} />
      <Tab.Screen name="Plans" component={MyPlans} />
    </Tab.Navigator>
  );
}

export default function UserDashboard() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#111827',
          borderTopWidth: 0,
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeSummary}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={HomeIcon} 
              solidIcon={HomeIconSolid} 
              label="" 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Fitness" 
        component={FitnessTabGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={ChartPieIcon} 
              solidIcon={ChartPieIconSolid} 
              label="" 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Consultants" 
        component={Consultants}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={UserGroupIcon} 
              solidIcon={UserGroupIconSolid} 
              label="" 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={Appointments}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={CalendarDaysIcon} 
              solidIcon={CalendarDaysIconSolid} 
              label="" 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Shop" 
        component={Shop}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={ShoppingBagIcon} 
              solidIcon={ShoppingBagIconSolid} 
              label="" 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Challenges" 
        component={DailyChallenge}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={TrophyIcon} 
              solidIcon={TrophyIconSolid} 
              label="" 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Health" 
        component={StatsOverview}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={HeartIcon} 
              solidIcon={HeartIconSolid} 
              label="" 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileSettings}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={Cog6ToothIcon} 
              solidIcon={Cog6ToothIconSolid} 
              label="" 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});