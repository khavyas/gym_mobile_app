import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────
// Type definitions (matches the DB document shape)
// ─────────────────────────────────────────────
interface WellnessQuestion {
  questionId: number;
  question: string;
  type: 'scale' | 'multiple-choice' | 'text';
  options?: string[];
  multiSelect?: boolean;
  placeholder?: string;
  order: number;
}

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

export default function UserQuestions() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  // ── New: questions come from the API now ──
  const [questions, setQuestions] = useState<WellnessQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch questions from backend on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_BASE_URL}/wellness/questions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setQuestions(data.questions);
        } else {
          setFetchError(data.message || 'Failed to load questions');
        }
      } catch (error) {
        console.error('Error fetching wellness questions:', error);
        setFetchError('Network error. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // ── Derived state (safe after loading) ──
  const currentQuestion = questions[currentQuestionIndex] || null;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // ── Submit responses to backend ──
  const submitAndNavigate = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');

      if (!userId || !role) {
        console.error('Missing userId or role');
        router.replace('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/wellness/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          userRole: role,
          answers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Wellness answers saved successfully:', data);
        await AsyncStorage.setItem('wellnessData', JSON.stringify(answers));

        // Navigate based on role
        if (role === 'user') router.replace('/dashboards/user');
        else if (role === 'consultant') router.replace('/dashboards/consultant');
        else if (role === 'admin') router.replace('/dashboards/admin');
        else if (role === 'superadmin') router.replace('/dashboards/super-admin');
        else router.replace('/login');
      } else {
        console.error('Failed to save wellness answers:', data);
        alert(`Warning: ${data.message || 'Failed to save answers'}`);
        router.replace('/dashboards/user');
      }
    } catch (error) {
      console.error('Error saving wellness data:', error);
      alert('Warning: Could not save wellness answers. Please try again later.');
      router.replace('/login');
    }
  };

  // ── Answer handlers (unchanged logic) ──
  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.questionId]: answer }));

    if (isLastQuestion) {
      // Need to pass updated answers directly since setState is async
      const updatedAnswers = { ...answers, [currentQuestion.questionId]: answer };
      submitWithAnswers(updatedAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Submit helper that takes answers as parameter (avoids stale closure issue)
  const submitWithAnswers = async (finalAnswers: Record<number, string | string[]>) => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');

      if (!userId || !role) {
        router.replace('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/wellness/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, userRole: role, answers: finalAnswers }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Wellness answers saved successfully:', data);
        await AsyncStorage.setItem('wellnessData', JSON.stringify(finalAnswers));

        if (role === 'user') router.replace('/dashboards/user');
        else if (role === 'consultant') router.replace('/dashboards/consultant');
        else if (role === 'admin') router.replace('/dashboards/admin');
        else if (role === 'superadmin') router.replace('/dashboards/super-admin');
        else router.replace('/login');
      } else {
        alert(`Warning: ${data.message || 'Failed to save answers'}`);
        router.replace('/dashboards/user');
      }
    } catch (error) {
      alert('Warning: Could not save wellness answers. Please try again later.');
      router.replace('/login');
    }
  };

  const handleMultiSelectToggle = (option: string) => {
    setAnswers(prev => {
      const currentAnswers = (prev[currentQuestion.questionId] as string[]) || [];
      const isSelected = currentAnswers.includes(option);

      if (isSelected) {
        return { ...prev, [currentQuestion.questionId]: currentAnswers.filter(a => a !== option) };
      } else {
        return { ...prev, [currentQuestion.questionId]: [...currentAnswers, option] };
      }
    });
  };

  const handleNext = () => {
    if (!hasValidAnswer()) return;

    if (isLastQuestion) {
      submitWithAnswers(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const hasValidAnswer = () => {
    if (!currentQuestion) return false;
    const currentAnswer = answers[currentQuestion.questionId];
    if (currentQuestion.multiSelect) {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return !!currentAnswer;
  };

  // ── Render helpers (UI unchanged) ──
  const renderScaleQuestion = () => {
    const scaleValues = Array.from({ length: 10 }, (_, i) => i + 1);
    const selectedValue = answers[currentQuestion.questionId];

    return (
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabelText}>Poor</Text>
          <Text style={styles.scaleLabelText}>Excellent</Text>
        </View>
        <View style={styles.scaleOptions}>
          {scaleValues.map((value) => {
            const isSelected = selectedValue === value.toString();
            return (
              <TouchableOpacity
                key={value}
                style={[styles.scaleButton, isSelected && styles.scaleButtonSelected]}
                onPress={() => handleAnswer(value.toString())}
                activeOpacity={0.7}
              >
                <Text style={[styles.scaleButtonText, isSelected && styles.scaleButtonTextSelected]}>
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderMultipleChoice = () => {
    const isMultiSelect = currentQuestion.multiSelect;
    const selectedAnswers = isMultiSelect
      ? (answers[currentQuestion.questionId] as string[] || [])
      : answers[currentQuestion.questionId];

    return (
      <View style={styles.optionsContainer}>
        {currentQuestion.options?.map((option, index) => {
          const isSelected = isMultiSelect
            ? (selectedAnswers as string[]).includes(option)
            : selectedAnswers === option;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, isSelected && styles.selectedOption]}
              onPress={() => isMultiSelect ? handleMultiSelectToggle(option) : handleAnswer(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                {isMultiSelect ? (
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                ) : (
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                )}
                <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderTextInput = () => (
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder={currentQuestion.placeholder || 'Enter your answer'}
        placeholderTextColor="#6B7280"
        onChangeText={(text) => setAnswers(prev => ({ ...prev, [currentQuestion.questionId]: text }))}
        value={answers[currentQuestion.questionId] as string || ''}
        multiline
        numberOfLines={4}
      />
    </View>
  );

  // ── Loading state ──
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  // ── Error state ──
  if (fetchError || questions.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{fetchError || 'No questions available.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => {
          setIsLoading(true);
          setFetchError(null);
          // Re-trigger fetch by reloading
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main render (identical UI structure) ──
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>💭</Text>
            </View>
            <Text style={styles.categoryText}>Health & Wellness</Text>
          </View>

          <Text style={styles.question}>{currentQuestion.question}</Text>

          {currentQuestion.type === 'scale' && renderScaleQuestion()}
          {currentQuestion.type === 'multiple-choice' && renderMultipleChoice()}
          {currentQuestion.type === 'text' && renderTextInput()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.navigationContainer}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentQuestionIndex(prev => prev - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[styles.nextButton, !hasValidAnswer() && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!hasValidAnswer()}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Complete' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 16,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  categoryText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 28,
    lineHeight: 32,
  },

  // Scale
  scaleContainer: { marginTop: 10 },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  scaleLabelText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  scaleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  scaleButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleButtonSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    transform: [{ scale: 1.05 }],
  },
  scaleButtonText: { color: '#CBD5E1', fontSize: 18, fontWeight: '700' },
  scaleButtonTextSelected: { color: '#FFFFFF', fontSize: 20 },

  // Multiple Choice
  optionsContainer: { gap: 12 },
  optionButton: {
    backgroundColor: '#0F172A',
    padding: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#334155',
  },
  selectedOption: { backgroundColor: '#10B98115', borderColor: '#10B981' },
  optionContent: { flexDirection: 'row', alignItems: 'center' },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#64748B',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: { borderColor: '#10B981' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#64748B',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  checkboxSelected: { borderColor: '#10B981', backgroundColor: '#10B981' },
  checkmark: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  optionText: { color: '#CBD5E1', fontSize: 16, flex: 1 },
  selectedOptionText: { color: '#F9FAFB', fontWeight: '600' },

  // Text Input
  textInputContainer: { marginTop: 8 },
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 16,
    color: '#F9FAFB',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { paddingVertical: 14, paddingHorizontal: 20 },
  backButtonText: { color: '#94A3B8', fontSize: 16, fontWeight: '600' },
  nextButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: { backgroundColor: '#334155', opacity: 0.5, shadowOpacity: 0 },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});