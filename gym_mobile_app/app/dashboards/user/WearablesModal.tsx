import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WearableDevice {
  id: string;
  name: string;
  brand: string;
  battery: number;
  lastSync: string;
  connected: boolean;
  image?: any;
  metrics: Array<{
    icon: string;
    label: string;
    color: string;
  }>;
}

const connectedDevices: WearableDevice[] = [
  {
    id: '1',
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    battery: 78,
    lastSync: '2 minutes ago',
    connected: true,
    metrics: [
      { icon: 'heart', label: 'Heart Rate', color: '#ef4444' },
      { icon: 'footsteps', label: 'Steps', color: '#3b82f6' },
      { icon: 'moon', label: 'Sleep', color: '#8b5cf6' },
      { icon: 'pulse', label: 'Ecg', color: '#10b981' },
      { icon: 'water', label: 'Blood Oxygen', color: '#06b6d4' },
      { icon: 'thermometer', label: 'Temperature', color: '#f59e0b' },
    ],
  },
  {
    id: '2',
    name: 'Oura Ring Gen3',
    brand: 'Oura',
    battery: 92,
    lastSync: '5 minutes ago',
    connected: true,
    metrics: [
      { icon: 'heart', label: 'Heart Rate', color: '#ef4444' },
      { icon: 'moon', label: 'Sleep', color: '#8b5cf6' },
      { icon: 'thermometer', label: 'Temperature', color: '#f59e0b' },
      { icon: 'flash', label: 'Hrv', color: '#f97316' },
      { icon: 'fitness', label: 'Recovery', color: '#10b981' },
    ],
  },
  {
    id: '3',
    name: 'FreeStyle Libre 3',
    brand: 'Abbott',
    battery: 65,
    lastSync: '1 minute ago',
    connected: true,
    metrics: [
      { icon: 'water', label: 'Glucose', color: '#10b981' },
      { icon: 'trending-up', label: 'Trends', color: '#3b82f6' },
    ],
  },
];

const availableDevices = [
  {
    id: '4',
    name: 'Fitbit Sense 2',
    brand: 'Fitbit • smartwatch',
  },
  {
    id: '5',
    name: 'Garmin Venu 3',
    brand: 'Garmin • smartwatch',
  },
];

export default function WearablesModal() {
  const [autoSync, setAutoSync] = useState(true);
  const [activeTab, setActiveTab] = useState('Devices');

  const renderDevicesTab = () => (
    <>
      {/* Connected Devices Section */}
      <Text style={styles.sectionTitle}>Connected Devices</Text>

      {/* Device Cards */}
      {connectedDevices.map((device) => (
        <View key={device.id} style={styles.deviceCard}>
          <View style={styles.deviceHeader}>
            <View style={styles.deviceInfo}>
              <View style={styles.deviceImagePlaceholder}>
                <Ionicons name="watch" size={32} color="#64748b" />
              </View>
              <View style={styles.deviceDetails}>
                <View style={styles.deviceNameRow}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <View style={styles.connectedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                    <Text style={styles.connectedText}>connected</Text>
                  </View>
                </View>
                <Text style={styles.deviceBrand}>{device.brand}</Text>
                <View style={styles.deviceStats}>
                  <View style={styles.deviceStat}>
                    <Ionicons name="battery-half" size={14} color="#10b981" />
                    <Text style={styles.deviceStatText}>{device.battery}%</Text>
                  </View>
                  <View style={styles.deviceStat}>
                    <Ionicons name="sync" size={14} color="#64748b" />
                    <Text style={styles.deviceStatText}>{device.lastSync}</Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Metrics */}
          <View style={styles.metricsContainer}>
            {device.metrics.map((metric, index) => (
              <View key={index} style={styles.metric}>
                <Ionicons name={metric.icon as any} size={16} color={metric.color} />
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Add New Device Section */}
      <View style={styles.addDeviceSection}>
        <TouchableOpacity style={styles.addDeviceButton}>
          <Ionicons name="add-circle-outline" size={20} color="#0ea5e9" />
          <Text style={styles.addDeviceText}>Add New Device</Text>
        </TouchableOpacity>

        {availableDevices.map((device) => (
          <View key={device.id} style={styles.availableDevice}>
            <View>
              <Text style={styles.availableDeviceName}>{device.name}</Text>
              <Text style={styles.availableDeviceBrand}>{device.brand}</Text>
            </View>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </>
  );

  const renderRealTimeTab = () => (
    <>
      {/* Real-time Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="heart" size={32} color="#ef4444" />
          <Text style={styles.metricValue}>72</Text>
          <Text style={styles.metricLabel}>BPM</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="flash" size={32} color="#f59e0b" />
          <Text style={styles.metricValue}>45</Text>
          <Text style={styles.metricLabel}>HRV ms</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="water" size={32} color="#3b82f6" />
          <Text style={styles.metricValue}>98%</Text>
          <Text style={styles.metricLabel}>SpO2</Text>
        </View>
        <View style={styles.metricCard}>
          <Ionicons name="thermometer" size={32} color="#f97316" />
          <Text style={styles.metricValue}>97.2°F</Text>
          <Text style={styles.metricLabel}>Skin Temp</Text>
        </View>
      </View>

      {/* Continuous Glucose Monitoring */}
      <View style={styles.glucoseCard}>
        <View style={styles.glucoseHeader}>
          <View style={styles.glucoseTitle}>
            <Ionicons name="water" size={20} color="#10b981" />
            <Text style={styles.glucoseText}>Continuous Glucose Monitoring</Text>
          </View>
        </View>
        <View style={styles.glucoseValueContainer}>
          <Text style={styles.glucoseValue}>95</Text>
          <Text style={styles.glucoseUnit}>mg/dL</Text>
          <View style={styles.glucoseStatus}>
            <Text style={styles.glucoseStatusText}>In Range</Text>
          </View>
        </View>
        <View style={styles.glucoseChart}>
          <View style={styles.chartLine} />
          <View style={styles.timeLabels}>
            <Text style={styles.timeLabel}>10:00</Text>
            <Text style={styles.timeLabel}>12:00</Text>
            <Text style={styles.timeLabel}>14:00</Text>
            <Text style={styles.timeLabel}>16:00</Text>
          </View>
        </View>
      </View>

      {/* Stress and Recovery */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, styles.wideCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="fitness" size={20} color="#8b5cf6" />
            <Text style={styles.cardTitle}>Stress Level</Text>
          </View>
          <Text style={styles.stressLabel}>Current</Text>
          <Text style={styles.stressValue}>28%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '28%', backgroundColor: '#10b981' }]} />
          </View>
          <Text style={styles.stressStatus}>Low stress detected</Text>
        </View>
        <View style={[styles.metricCard, styles.wideCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up" size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Recovery Score</Text>
          </View>
          <Text style={styles.stressLabel}>Today</Text>
          <Text style={styles.stressValue}>85%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%', backgroundColor: '#10b981' }]} />
          </View>
          <Text style={styles.stressStatus}>Excellent recovery</Text>
        </View>
      </View>
    </>
  );

  const renderFastingTab = () => (
    <>
      {/* Current Fast Card */}
      <View style={styles.fastCard}>
        <View style={styles.fastHeader}>
          <Ionicons name="time" size={20} color="#10b981" />
          <Text style={styles.fastTitle}>Current Fast</Text>
        </View>
        <Text style={styles.fastTime}>14h 30m</Text>
        <Text style={styles.fastTarget}>of 16h 00m target</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '91%', backgroundColor: '#10b981' }]} />
        </View>
        <View style={styles.fastDetails}>
          <Text style={styles.fastDetailText}>Started: 8:00 PM</Text>
          <Text style={styles.fastDetailText}>91% complete</Text>
        </View>
        <View style={styles.fastStatus}>
          <Text style={styles.fastStatusText}>Fat Burning</Text>
        </View>
      </View>

      {/* Metabolic Indicators */}
      <View style={styles.metabolicCard}>
        <Text style={styles.sectionTitle}>Metabolic Indicators</Text>
        <View style={styles.metabolicGrid}>
          <View style={styles.metabolicItem}>
            <Text style={styles.metabolicValue}>0.8</Text>
            <Text style={styles.metabolicLabel}>Ketones (mmol/L)</Text>
          </View>
          <View style={styles.metabolicItem}>
            <Text style={styles.metabolicValue}>95</Text>
            <Text style={styles.metabolicLabel}>Glucose (mg/dL)</Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={18} color="#0ea5e9" />
          <Text style={styles.infoText}>
            You're in the optimal fat-burning zone. Consider extending your fast for enhanced metabolic benefits.
          </Text>
        </View>
      </View>

      {/* Weekly Fasting Pattern */}
      <View style={styles.weeklyCard}>
        <Text style={styles.sectionTitle}>Weekly Fasting Pattern</Text>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <View key={day} style={styles.dayRow}>
            <Text style={styles.dayLabel}>{day}</Text>
            <View style={styles.dayBar}>
              <View style={[styles.fastingBar, { width: index === 3 ? '83%' : index === 5 ? '58%' : '67%' }]} />
              <View style={[styles.eatingBar, { width: index === 3 ? '17%' : index === 5 ? '42%' : '33%' }]} />
            </View>
            <Text style={styles.hourLabel}>{index === 3 ? '20h' : index === 5 ? '14h' : '16h'}</Text>
          </View>
        ))}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#7c2d12' }]} />
            <Text style={styles.legendText}>Fasting</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Eating Window</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderCircadianTab = () => (
    <>
      {/* Circadian Rhythm Chart */}
      <View style={styles.circadianCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="moon" size={20} color="#8b5cf6" />
          <Text style={styles.cardTitle}>Circadian Rhythm Analysis</Text>
        </View>
        <View style={styles.circadianChart}>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartLabel}>Rhythm visualization</Text>
          </View>
          <View style={styles.timeLabels}>
            <Text style={styles.timeLabel}>06:00</Text>
            <Text style={styles.timeLabel}>12:00</Text>
            <Text style={styles.timeLabel}>18:00</Text>
            <Text style={styles.timeLabel}>22:00</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#8b5cf6' }]} />
            <Text style={styles.legendText}>Melatonin</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Cortisol</Text>
          </View>
        </View>
      </View>

      {/* Sleep Analysis */}
      <View style={styles.sleepCard}>
        <Text style={styles.sectionTitle}>Sleep Analysis</Text>
        <View style={styles.sleepStats}>
          <View style={styles.sleepStat}>
            <Text style={styles.sleepValue}>7h 23m</Text>
            <Text style={styles.sleepLabel}>Duration</Text>
          </View>
          <View style={styles.sleepStat}>
            <Text style={styles.sleepValue}>89%</Text>
            <Text style={styles.sleepLabel}>Efficiency</Text>
          </View>
        </View>
        <View style={styles.sleepBreakdown}>
          <View style={styles.sleepRow}>
            <Text style={styles.sleepPhase}>Deep Sleep</Text>
            <Text style={styles.sleepDuration}>1h 45m</Text>
          </View>
          <View style={styles.sleepRow}>
            <Text style={styles.sleepPhase}>REM Sleep</Text>
            <Text style={styles.sleepDuration}>1h 30m</Text>
          </View>
          <View style={styles.sleepRow}>
            <Text style={styles.sleepPhase}>Light Sleep</Text>
            <Text style={styles.sleepDuration}>4h 08m</Text>
          </View>
          <View style={styles.sleepRow}>
            <Text style={styles.sleepPhase}>Awake</Text>
            <Text style={styles.sleepDuration}>23m</Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <Ionicons name="checkmark-circle" size={18} color="#10b981" />
          <Text style={styles.infoText}>
            Your sleep quality is good. Your circadian rhythm is well-aligned.
          </Text>
        </View>
      </View>

      {/* Circadian Optimization */}
      <View style={styles.optimizationCard}>
        <Text style={styles.sectionTitle}>Circadian Optimization</Text>
        <View style={styles.optimizationItem}>
          <Text style={styles.optimizationTitle}>Light Exposure</Text>
          <Text style={styles.optimizationDesc}>Get 10-15 minutes of morning sunlight within 1 hour of waking</Text>
        </View>
        <View style={styles.optimizationItem}>
          <Text style={styles.optimizationTitle}>Blue Light</Text>
          <Text style={styles.optimizationDesc}>Reduce blue light exposure 2 hours before bedtime</Text>
        </View>
        <View style={[styles.optimizationItem, styles.optimizationItemLast]}>
          <Text style={styles.optimizationTitle}>Meal Timing</Text>
          <Text style={styles.optimizationDesc}>Align eating window with your circadian rhythm (10 AM - 6 PM)</Text>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Wearables Hub</Text>
          <Text style={styles.pageSubtitle}>
            Connected devices and real-time health monitoring
          </Text>
        </View>

        {/* Auto-Sync Card */}
        <View style={styles.syncCard}>
          <View style={styles.syncLeft}>
            <Ionicons name="sync" size={24} color="#10b981" />
            <View style={styles.syncText}>
              <Text style={styles.syncTitle}>Auto-Sync Enabled</Text>
              <Text style={styles.syncSubtitle}>Real-time data from 3 devices</Text>
            </View>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: '#334155', true: '#10b981' }}
            thumbColor="#fff"
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['Devices', 'Real-time', 'Fasting', 'Circadian'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Render content based on active tab */}
        {activeTab === 'Devices' && renderDevicesTab()}
        {activeTab === 'Real-time' && renderRealTimeTab()}
        {activeTab === 'Fasting' && renderFastingTab()}
        {activeTab === 'Circadian' && renderCircadianTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  syncCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  syncText: {
    gap: 4,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  syncSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#334155',
  },
  tabText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  deviceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  deviceInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  deviceImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceDetails: {
    flex: 1,
    gap: 4,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  connectedText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '500',
  },
  deviceBrand: {
    fontSize: 13,
    color: '#94a3b8',
  },
  deviceStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  deviceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deviceStatText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  settingsButton: {
    padding: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  metricLabel: {
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  addDeviceSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  addDeviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  addDeviceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  availableDevice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  availableDeviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  availableDeviceBrand: {
    fontSize: 13,
    color: '#94a3b8',
  },
  connectButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  wideCard: {
    minWidth: '100%',
    alignItems: 'flex-start',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  glucoseCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  glucoseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  glucoseTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  glucoseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  glucoseValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  glucoseValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  glucoseUnit: {
    fontSize: 16,
    color: '#94a3b8',
  },
  glucoseStatus: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  glucoseStatusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  glucoseChart: {
    height: 120,
    marginTop: 16,
  },
  chartLine: {
    height: 80,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    marginBottom: 8,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  stressLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 4,
  },
  stressValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  stressStatus: {
    fontSize: 13,
    color: '#94a3b8',
  },
  fastCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  fastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  fastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  fastTime: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  fastTarget: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
  },
  fastDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  fastDetailText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  fastStatus: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  fastStatusText: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '600',
  },
  metabolicCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metabolicGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metabolicItem: {
    flex: 1,
    alignItems: 'center',
  },
  metabolicValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  metabolicLabel: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  weeklyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayLabel: {
    width: 40,
    fontSize: 13,
    color: '#94a3b8',
  },
  dayBar: {
    flex: 1,
    height: 24,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  fastingBar: {
    backgroundColor: '#7c2d12',
    height: '100%',
  },
  eatingBar: {
    backgroundColor: '#10b981',
    height: '100%',
  },
  hourLabel: {
    width: 40,
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'right',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  circadianCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  circadianChart: {
    marginTop: 16,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
  },
  sleepCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sleepStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  sleepStat: {
    flex: 1,
    alignItems: 'center',
  },
  sleepValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  sleepLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  sleepBreakdown: {
    marginBottom: 16,
  },
  sleepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sleepPhase: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  sleepDuration: {
    fontSize: 14,
    color: '#94a3b8',
  },
  optimizationCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optimizationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  optimizationItemLast: {
    borderBottomWidth: 0,
  },
  optimizationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  optimizationDesc: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
});