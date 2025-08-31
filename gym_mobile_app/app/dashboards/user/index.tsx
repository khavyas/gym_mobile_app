import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

export default function UserDashboard() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#111827' },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen name="Home" component={HomeSummary} />
      <Tab.Screen name="Progress" component={ProgressOverview} />
      <Tab.Screen name="Plans" component={MyPlans} />
      <Tab.Screen name="Stats" component={StatsOverview} />
      <Tab.Screen name="Consultants" component={Consultants} />
      <Tab.Screen name="Appointments" component={Appointments} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Challenges" component={DailyChallenge} />
      <Tab.Screen name="Profile" component={ProfileSettings} />
    </Tab.Navigator>
  );
}
