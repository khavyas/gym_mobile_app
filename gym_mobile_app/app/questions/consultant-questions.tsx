import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { consultantQuestions } from '@/constants/consultantQuestions';

export default function ConsultantQuestions() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const currentQuestion = consultantQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === consultantQuestions.length - 1;

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    if (isLastQuestion) {
      // Submit all answers and navigate to dashboard
      console.log('Consultant answers:', answers);
      router.replace('/(tabs)');
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (answers[currentQuestion.id]) {
      if (isLastQuestion) {
        // Submit all answers and navigate to dashboard
        console.log('Consultant answers:', answers);
        router.replace('/(tabs)');
      } else {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestionIndex + 1) / consultantQuestions.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} of {consultantQuestions.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        
        {currentQuestion.type === 'multiple-choice' ? (
            <View style={styles.optionsContainer}>
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, index) => (
        <TouchableOpacity
            key={index}
            style={[
            styles.optionButton,
            answers[currentQuestion.id] === option && styles.selectedOption
            ]}
            onPress={() => handleAnswer(option)}
        >
            <Text style={[
            styles.optionText,
            answers[currentQuestion.id] === option && styles.selectedOptionText
            ]}>
            {option}
            </Text>
        </TouchableOpacity>
        ))}

          </View>
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder={currentQuestion.placeholder || "Enter your answer"}
            placeholderTextColor="#9CA3AF"
            onChangeText={(text) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: text }))}
            value={answers[currentQuestion.id] || ''}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentQuestionIndex(prev => prev - 1)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            !answers[currentQuestion.id] && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'Complete' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  progressContainer: {
    padding: 20,
    paddingTop: 60,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 14,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  selectedOption: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  optionText: {
    color: '#F9FAFB',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: '#F9FAFB',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});