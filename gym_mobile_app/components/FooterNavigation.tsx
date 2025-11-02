import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { 
  HomeIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  ChartPieIcon,
  ChatBubbleLeftRightIcon
} from 'react-native-heroicons/outline';
import { 
  HomeIcon as HomeIconSolid, 
  UserGroupIcon as UserGroupIconSolid, 
  ShoppingBagIcon as ShoppingBagIconSolid, 
  ChartPieIcon as ChartPieIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid
} from 'react-native-heroicons/solid';

// Import your screens
import HomeSummary from '../app/dashboards/user/HomeSummary';
import ProgressOverview from '../app/dashboards/user/ProgressOverview';
import StatsOverview from '../app/dashboards/user/StatsOverview';
import MyPlans from '../app/dashboards/user/MyPlans';
import Consultants from '../app/dashboards/user/Consultants';
import Shop from '../app/dashboards/user/Shop';
import Messages from '../app/dashboards/user/Messages';

const Tab = createBottomTabNavigator();

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
      {label && <Text style={[styles.tabLabel, { color: focused ? "#10B981" : "#9CA3AF" }]}>{label}</Text>}
    </View>
  );
};

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

export default function FooterNavigation() {
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
        name="Sessions" 
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
        name="Messages" 
        component={Messages}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              icon={ChatBubbleLeftRightIcon} 
              solidIcon={ChatBubbleLeftRightIconSolid} 
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