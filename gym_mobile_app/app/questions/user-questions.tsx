import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wellnessQuestions } from '@/constants/wellnessQuestions';

export default function ConsultantQuestions() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const currentQuestion = wellnessQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === wellnessQuestions.length - 1;

  const goToLandingPage = async () => {
    try {
      await AsyncStorage.setItem('wellnessData', JSON.stringify(answers));
      const role = await AsyncStorage.getItem("userRole");

      if (role === "user") {
        router.replace("/dashboards/user");
      } else if (role === "consultant") {
        router.replace("/dashboards/consultant");
      } else if (role === "admin") {
        router.replace("/dashboards/admin");
      } else if (role === "superadmin") {
        router.replace("/dashboards/super-admin");
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error saving wellness data:", error);
      router.replace("/login");
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    if (isLastQuestion) {
      console.log('Wellness answers:', answers);
      goToLandingPage();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (answers[currentQuestion.id]) {
      if (isLastQuestion) {
        console.log('Wellness answers:', answers);
        goToLandingPage();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  // Render Scale Type (Interactive number circles)
  const renderScaleQuestion = () => {
    const scaleValues = Array.from({ length: 10 }, (_, i) => i + 1);
    const selectedValue = answers[currentQuestion.id];

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
                style={[
                  styles.scaleButton,
                  isSelected && styles.scaleButtonSelected
                ]}
                onPress={() => handleAnswer(value.toString())}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.scaleButtonText,
                  isSelected && styles.scaleButtonTextSelected
                ]}>
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // Render Multiple Choice (with radio buttons)
  const renderMultipleChoice = () => {
    return (
      <View style={styles.optionsContainer}>
        {currentQuestion.options?.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              answers[currentQuestion.id] === option && styles.selectedOption
            ]}
            onPress={() => handleAnswer(option)}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.radioCircle,
                answers[currentQuestion.id] === option && styles.radioCircleSelected
              ]}>
                {answers[currentQuestion.id] === option && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={[
                styles.optionText,
                answers[currentQuestion.id] === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render Text Input
  const renderTextInput = () => {
    return (
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={currentQuestion.placeholder || "Enter your answer"}
          placeholderTextColor="#6B7280"
          onChangeText={(text) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: text }))}
          value={answers[currentQuestion.id] || ''}
          multiline
          numberOfLines={4}
        />
      </View>
    );
  };

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
            style={[
              styles.nextButton,
              !answers[currentQuestion.id] && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={!answers[currentQuestion.id]}
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
    backgroundColor: '#0F172A' 
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
  
  // Scale Question Styles
  scaleContainer: {
    marginTop: 10,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  scaleLabelText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
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
  scaleButtonText: {
    color: '#CBD5E1',
    fontSize: 18,
    fontWeight: '700',
  },
  scaleButtonTextSelected: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  
  // Multiple Choice Styles
  optionsContainer: { 
    gap: 12 
  },
  optionButton: {
    backgroundColor: '#0F172A',
    padding: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#334155',
  },
  selectedOption: { 
    backgroundColor: '#10B98115',
    borderColor: '#10B981',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  radioCircleSelected: {
    borderColor: '#10B981',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  optionText: { 
    color: '#CBD5E1', 
    fontSize: 16,
    flex: 1,
  },
  selectedOptionText: { 
    color: '#F9FAFB', 
    fontWeight: '600' 
  },
  
  // Text Input Styles
  textInputContainer: {
    marginTop: 8,
  },
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
  
  // Footer Navigation
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
  backButton: { 
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backButtonText: { 
    color: '#94A3B8', 
    fontSize: 16,
    fontWeight: '600',
  },
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
  nextButtonDisabled: { 
    backgroundColor: '#334155', 
    opacity: 0.5,
    shadowOpacity: 0,
  },
  nextButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700',
  },
});