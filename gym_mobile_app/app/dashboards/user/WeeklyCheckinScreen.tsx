// ─────────────────────────────────────────────────────────────
//  HiWox Weekly Check-In Screen
//  One domain at a time · progress ring · animated transitions
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CHECKIN_DOMAINS, ALL_FIELDS, CheckInDomain } from './data/checkinQuestions';
import { CheckInField } from '../config only/components/checkin/CheckInFormComponents';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────
type FormValues = Record<string, any>;

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────
const buildInitialState = (): FormValues =>
  ALL_FIELDS.reduce((acc, field) => ({ ...acc, [field]: null }), {});

const domainProgress = (domain: CheckInDomain, values: FormValues): number => {
  const required = domain.questions.filter((q) => !q.optional);
  if (required.length === 0) return 1;
  const answered = required.filter((q) => values[q.field] !== null && values[q.field] !== undefined);
  return answered.length / required.length;
};

const overallProgress = (values: FormValues): number => {
  const required = CHECKIN_DOMAINS.flatMap((d) => d.questions.filter((q) => !q.optional));
  const answered = required.filter((q) => values[q.field] !== null && values[q.field] !== undefined);
  return answered.length / required.length;
};

// ─────────────────────────────────────────────────────────────
//  Domain Stepper Header
// ─────────────────────────────────────────────────────────────
interface DomainStepperProps {
  domains: CheckInDomain[];
  activeDomainIndex: number;
  values: FormValues;
  onSelect: (index: number) => void;
}

const DomainStepper: React.FC<DomainStepperProps> = ({
  domains,
  activeDomainIndex,
  values,
  onSelect,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={stepperStyles.container}
  >
    {domains.map((domain, i) => {
      const isActive = i === activeDomainIndex;
      const progress = domainProgress(domain, values);
      const isDone = progress === 1;

      return (
        <TouchableOpacity
          key={domain.id}
          onPress={() => onSelect(i)}
          activeOpacity={0.75}
          style={[
            stepperStyles.pill,
            isActive && { borderColor: domain.color, backgroundColor: domain.color + '18' },
            isDone && !isActive && { borderColor: domain.color + '55' },
          ]}
        >
          {/* Done ring */}
          {isDone && (
            <View style={[stepperStyles.doneRing, { borderColor: domain.color }]}>
              <Text style={{ fontSize: 9, color: domain.color }}>✓</Text>
            </View>
          )}
          <Text style={stepperStyles.pillIcon}>{domain.icon}</Text>
          <Text
            style={[
              stepperStyles.pillLabel,
              isActive && { color: domain.color },
              isDone && !isActive && { color: domain.color + 'AA' },
            ]}
          >
            {domain.label}
          </Text>
          {/* Progress bar under active pill */}
          {isActive && (
            <View style={stepperStyles.pillProgressTrack}>
              <View
                style={[
                  stepperStyles.pillProgressFill,
                  { width: `${progress * 100}%`, backgroundColor: domain.color },
                ]}
              />
            </View>
          )}
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const stepperStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    gap: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  doneRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillIcon: {
    fontSize: 15,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  pillProgressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pillProgressFill: {
    height: '100%',
    borderRadius: 1,
  },
});

// ─────────────────────────────────────────────────────────────
//  Overall Progress Bar
// ─────────────────────────────────────────────────────────────
const OverallProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const pct = Math.round(progress * 100);
  return (
    <View style={progressStyles.wrapper}>
      <View style={progressStyles.track}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[progressStyles.fill, { width: `${pct}%` }]}
        />
      </View>
      <Text style={progressStyles.label}>{pct}% complete</Text>
    </View>
  );
};

const progressStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  track: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    minWidth: 6,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    width: 80,
    textAlign: 'right',
  },
});

// ─────────────────────────────────────────────────────────────
//  Domain Panel — questions for one domain
// ─────────────────────────────────────────────────────────────
interface DomainPanelProps {
  domain: CheckInDomain;
  values: FormValues;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const DomainPanel: React.FC<DomainPanelProps> = ({
  domain,
  values,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
}) => {
  const progress = domainProgress(domain, values);
  const canProceed = progress > 0 || domain.questions.every((q) => q.optional);

  return (
    <View style={panelStyles.container}>
      {/* Domain header card */}
      <LinearGradient
        colors={[domain.gradientColors[0] + '22', domain.gradientColors[1] + '11']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={panelStyles.domainHeader}
      >
        <View style={[panelStyles.domainIconCircle, { borderColor: domain.color + '55' }]}>
          <Text style={panelStyles.domainIcon}>{domain.icon}</Text>
        </View>
        <View style={panelStyles.domainHeaderText}>
          <Text style={[panelStyles.domainTitle, { color: domain.color }]}>
            {domain.label} Wellness
          </Text>
          <Text style={panelStyles.domainSubtitle}>
            {domain.questions.filter((q) => !q.optional).length} questions
            {domain.questions.some((q) => q.optional) ? ' + optional' : ''}
          </Text>
        </View>
        {/* Mini progress pill */}
        <View style={[panelStyles.progressPill, { borderColor: domain.color + '44' }]}>
          <Text style={[panelStyles.progressPillText, { color: domain.color }]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
      </LinearGradient>

      {/* Questions */}
      {domain.questions.map((question) => (
        <CheckInField
          key={question.field}
          question={question}
          value={values[question.field]}
          onChange={onChange}
          accentColor={domain.color}
        />
      ))}

      {/* Navigation buttons */}
      <View style={panelStyles.navRow}>
        {!isFirst && (
          <TouchableOpacity
            onPress={onPrev}
            activeOpacity={0.7}
            style={panelStyles.navBtnOutline}
          >
            <Text style={panelStyles.navBtnOutlineText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.7}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={
              canProceed
                ? [domain.gradientColors[0], domain.gradientColors[1]]
                : ['#1F2937', '#1F2937']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={panelStyles.navBtnFilled}
          >
            <Text style={[panelStyles.navBtnFilledText, !canProceed && { color: '#4B5563' }]}>
              {isLast ? '✓  Submit Check-In' : `Next: ${CHECKIN_DOMAINS[CHECKIN_DOMAINS.indexOf(domain) + 1]?.label ?? ''} →`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const panelStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  domainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 28,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  domainIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainIcon: {
    fontSize: 24,
  },
  domainHeaderText: {
    flex: 1,
  },
  domainTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 3,
  },
  domainSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  progressPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  navBtnOutline: {
    flex: 0.45,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnOutlineText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  navBtnFilled: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtnFilledText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

// ─────────────────────────────────────────────────────────────
//  Completion Screen
// ─────────────────────────────────────────────────────────────
const CompletionScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <View style={completionStyles.container}>
    <LinearGradient
      colors={['#1A1A2E', '#16213E']}
      style={StyleSheet.absoluteFill}
    />
    <View style={completionStyles.card}>
      <Text style={completionStyles.emoji}>🎉</Text>
      <Text style={completionStyles.title}>Check-In Complete!</Text>
      <Text style={completionStyles.subtitle}>
        Your wellness data has been submitted.{'\n'}
        Your coordinator will review it and your{'\n'}
        weekly report arrives on Friday.
      </Text>
      <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={completionStyles.btn}
        >
          <Text style={completionStyles.btnText}>Back to Dashboard</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
);

const completionStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    alignItems: 'center',
    gap: 16,
    padding: 32,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    width: '100%',
    maxWidth: 380,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  btn: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

// ─────────────────────────────────────────────────────────────
//  WeeklyCheckInScreen — root export
// ─────────────────────────────────────────────────────────────
export default function WeeklyCheckInScreen() {
  const [values, setValues] = useState<FormValues>(() => buildInitialState()); 
  const [activeDomainIndex, setActiveDomainIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [showPreview, setShowPreview] = useState(false);
  const activeDomain = CHECKIN_DOMAINS[activeDomainIndex];
  const totalDomains = CHECKIN_DOMAINS.length;
  const progress = overallProgress(values);

  const handleChange = useCallback((field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleNext = () => {
    if (activeDomainIndex < totalDomains - 1) {
      setActiveDomainIndex((i) => i + 1);
      scrollToTop();
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (activeDomainIndex > 0) {
      setActiveDomainIndex((i) => i - 1);
      scrollToTop();
    }
  };

  const handleSelectDomain = (index: number) => {
    setActiveDomainIndex(index);
    scrollToTop();
  };

  const handleSubmit = () => {

    const unanswered = CHECKIN_DOMAINS.filter((d) => {
      const required = d.questions.filter((q) => !q.optional);
      return required.every(
        (q) => values[q.field] === null || values[q.field] === undefined
      );
    });

    if (unanswered.length > 0) {
      Alert.alert(
        'Incomplete Check-In',
        `Please answer at least one question in: ${unanswered.map((d) => d.label).join(', ')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    // OPEN PREVIEW MODAL
    setShowPreview(true);
  };

  if (submitted) {
    return <CompletionScreen onClose={() => setSubmitted(false)} />;
  }

  return (
    <View style={screenStyles.container}>
      <StatusBar barStyle="light-content" />

  

      {/* ── Scrollable Questions ── */}
      <ScrollView
        ref={scrollRef}
        style={screenStyles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 60 }}
      >

            {/* ── Fixed Header ── */}
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={screenStyles.header}
      >
        <View style={screenStyles.headerTop}>
          <View>
            <Text style={screenStyles.headerTitle}>Weekly Check-In</Text>
            <Text style={screenStyles.headerSubtitle}>
              Domain {activeDomainIndex + 1} of {totalDomains}
            </Text>
          </View>
          {/* Week label */}
          <View style={screenStyles.weekBadge}>
            <Text style={screenStyles.weekBadgeText}>
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </Text>
          </View>
        </View>

        {/* Overall progress bar */}
        <OverallProgressBar progress={progress} />
      </LinearGradient>

      {/* ── Domain Stepper ── */}
      <View style={screenStyles.stepperWrapper}>
        <DomainStepper
          domains={CHECKIN_DOMAINS}
          activeDomainIndex={activeDomainIndex}
          values={values}
          onSelect={handleSelectDomain}
        />
      </View>
      
        <DomainPanel
          domain={activeDomain}
          values={values}
          onChange={handleChange}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={activeDomainIndex === 0}
          isLast={activeDomainIndex === totalDomains - 1}
        />
      </ScrollView>

      <Modal
        visible={showPreview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPreview(false)}
      >
  <View style={previewStyles.overlay}>
    <View style={previewStyles.container}>

      <Text style={previewStyles.title}>Review Your Check-In</Text>

      <ScrollView style={{ maxHeight: 400 }}>

        {CHECKIN_DOMAINS.map((domain) => (
          <View key={domain.id} style={previewStyles.domainBlock}>

            <Text style={[previewStyles.domainTitle,{color:domain.color}]}>
              {domain.icon} {domain.label}
            </Text>

            {domain.questions.map((q) => (
              <View key={q.field} style={previewStyles.answerRow}>
                <Text style={previewStyles.question}>
                  {q.label}
                </Text>

                <Text style={previewStyles.answer}>
                  {values[q.field] !== null && values[q.field] !== undefined
                    ? values[q.field].toString()
                    : "Not answered"}
                </Text>
              </View>
            ))}

          </View>
        ))}

      </ScrollView>

      {/* Buttons */}
      <View style={previewStyles.buttonRow}>

        <TouchableOpacity
          style={previewStyles.editBtn}
          onPress={() => setShowPreview(false)}
        >
          <Text style={previewStyles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={previewStyles.submitBtn}
          onPress={() => {
            console.log("Final Submit:", values);

            setShowPreview(false);

            // small delay ensures modal closes first
            setTimeout(() => {
              setSubmitted(true);
              setValues(buildInitialState());
              setActiveDomainIndex(0);
            }, 200);
          }}
        >
          <Text style={previewStyles.submitText}>Confirm Submit</Text>
        </TouchableOpacity>

      </View>

    </View>
  </View>
</Modal>

    </View>    
  );
};

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  weekBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.4)',
  },
  weekBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#667eea',
  },
  stepperWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0D0D16',
  },
  scroll: {
    flex: 1,
  },
});


const previewStyles = StyleSheet.create({

  overlay:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.6)',
    justifyContent:'center',
    alignItems:'center',
    padding:20
  },

  container:{
    width:'100%',
    maxHeight:'85%',
    backgroundColor:'#0D0D16',
    borderRadius:20,
    padding:20
  },

  title:{
    fontSize:20,
    fontWeight:'700',
    color:'#FFF',
    marginBottom:20,
    textAlign:'center'
  },

  domainBlock:{
    marginBottom:20
  },

  domainTitle:{
    fontSize:16,
    fontWeight:'700',
    marginBottom:10
  },

  answerRow:{
    marginBottom:8
  },

  question:{
    fontSize:13,
    color:'#9CA3AF'
  },

  answer:{
    fontSize:14,
    color:'#FFFFFF',
    fontWeight:'600'
  },

  buttonRow:{
    flexDirection:'row',
    marginTop:20,
    gap:10
  },

  editBtn:{
    flex:1,
    padding:14,
    borderRadius:12,
    borderWidth:1,
    borderColor:'#444',
    alignItems:'center'
  },

  editText:{
    color:'#AAA',
    fontWeight:'600'
  },

  submitBtn:{
    flex:1,
    padding:14,
    borderRadius:12,
    backgroundColor:'#667eea',
    alignItems:'center'
  },

  submitText:{
    color:'#FFF',
    fontWeight:'700'
  }

});