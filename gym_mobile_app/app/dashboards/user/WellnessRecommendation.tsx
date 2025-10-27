import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const wellnessData = {
  physical: [
    { range: [1, 4], level: 'Low', interpretation: 'Low activity or energy', recommendation: 'Start with a 10–15 min daily walk; stretch for 5 min every morning.' },
    { range: [5, 7], level: 'Moderate', interpretation: 'Fairly active', recommendation: 'Maintain your routine; add one strength or flexibility session weekly.' },
    { range: [8, 10], level: 'High', interpretation: 'Active & energetic', recommendation: 'Keep up consistency; try tracking steps or joining a group challenge.' }
  ],
  mental: [
    { range: [1, 4], level: 'Low', interpretation: 'High stress or low focus', recommendation: 'Practice 5-min mindful breathing daily; reduce screen time before bed.' },
    { range: [5, 7], level: 'Moderate', interpretation: 'Occasional stress', recommendation: 'Keep a short gratitude journal; set one relaxation goal each week.' },
    { range: [8, 10], level: 'High', interpretation: 'Good mental balance', recommendation: 'Maintain healthy routines; mentor or support a peer to reinforce positivity.' }
  ],
  emotional: [
    { range: [1, 4], level: 'Low', interpretation: 'Feeling emotionally drained', recommendation: 'Talk to a trusted friend; do one activity that brings you joy this week.' },
    { range: [5, 7], level: 'Moderate', interpretation: 'Some emotional ups & downs', recommendation: 'Check in with your feelings daily; take short breaks during work.' },
    { range: [8, 10], level: 'High', interpretation: 'Emotionally stable', recommendation: 'Keep nurturing relationships and continue emotional awareness habits.' }
  ],
  nutritional: [
    { range: [1, 4], level: 'Low', interpretation: 'Poor diet or irregular meals', recommendation: 'Add one fruit or veggie daily; reduce processed snacks gradually.' },
    { range: [5, 7], level: 'Moderate', interpretation: 'Decent nutrition habits', recommendation: 'Keep balanced meals; hydrate well; plan 1 healthy meal each day.' },
    { range: [8, 10], level: 'High', interpretation: 'Consistent healthy eating', recommendation: 'Maintain variety; try a new healthy recipe weekly.' }
  ],
  sleep: [
    { range: [1, 4], level: 'Low', interpretation: 'Irregular or poor sleep', recommendation: 'Fix bedtime; avoid screens 30 min before sleep.' },
    { range: [5, 7], level: 'Moderate', interpretation: 'Decent sleep hygiene', recommendation: 'Maintain sleep-wake times; stretch or relax before bed.' },
    { range: [8, 10], level: 'High', interpretation: 'Restful and regular sleep', recommendation: 'Continue routine; note what helps best on low-sleep days.' }
  ]
};

const areaLabels = {
  physical: 'Physical Wellness',
  mental: 'Mental Wellness',
  emotional: 'Emotional Wellness',
  nutritional: 'Nutritional Wellness',
  sleep: 'Sleep Wellness',
};

type WellnessArea = keyof typeof wellnessData;

function getRecommendation(area: WellnessArea, score: number) {
  return wellnessData[area].find(rec => score >= rec.range[0] && score <= rec.range[1]);
}

const WellnessRecommendation = () => {
  const [scores, setScores] = useState({
    physical: 5,
    mental: 5,
    emotional: 5,
    nutritional: 5,
    sleep: 5,
  });
  const [showResults, setShowResults] = useState(false);

  const sliders: WellnessArea[] = Object.keys(scores) as WellnessArea[];

  const avgScore = (Object.values(scores).reduce((a, b) => a + b, 0) / sliders.length).toFixed(1);
  const lowCount = Object.values(scores).filter(score => score <= 4).length;
  const highCount = Object.values(scores).filter(score => score >= 8).length;

  const recommendations = Object.fromEntries(
    sliders.map(area => [area, getRecommendation(area, scores[area])])
  );

  const handleGenerate = () => setShowResults(true);

  const getLevelBadgeStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return styles.levelBadgeLow;
      case 'moderate':
        return styles.levelBadgeModerate;
      case 'high':
        return styles.levelBadgeHigh;
      default:
        return {};
    }
  };

  const getLevelTextStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return styles.levelTextLow;
      case 'moderate':
        return styles.levelTextModerate;
      case 'high':
        return styles.levelTextHigh;
      default:
        return {};
    }
  };

  const renderSlider = (area: WellnessArea) => {
    const score = scores[area];
    const percentage = ((score - 1) / 9) * 100;
    const sliderRef = React.useRef<View>(null);

    const handleSliderPress = (event: any) => {
      if (sliderRef.current) {
        sliderRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
          const locationX = event.nativeEvent.pageX - px;
          
          if (locationX >= 0 && width > 0) {
            const newPercentage = Math.max(0, Math.min(100, (locationX / width) * 100));
            const newScore = Math.round((newPercentage / 100) * 9 + 1);
            setScores({ ...scores, [area]: Math.max(1, Math.min(10, newScore)) });
          }
        });
      }
    };

    return (
      <View style={styles.inputGroup} key={area}>
        <Text style={styles.label}>{areaLabels[area]}</Text>
        
        <TouchableOpacity 
          style={styles.sliderContainer}
          activeOpacity={1}
          onPress={handleSliderPress}
        >
          <View ref={sliderRef} style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${percentage}%` }]} />
            <View style={[styles.sliderThumb, { left: `${percentage}%` }]} />
          </View>
        </TouchableOpacity>

        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreLabel}>Low</Text>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>High</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Wellness Recommendation System</Text>
        <Text style={styles.headerSubtitle}>
          Rate your wellness across five key areas to receive personalized recommendations
        </Text>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.wellnessInputs}>
          {sliders.map(area => renderSlider(area))}
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleGenerate}>
          <Text style={styles.btnText}>Generate Recommendations</Text>
        </TouchableOpacity>
      </View>

      {showResults && (
        <View style={styles.resultsSection}>
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Wellness Overview</Text>
            <Text style={styles.summaryDescription}>
              Your personalized wellness assessment based on your scores
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average Score</Text>
                <Text style={styles.statValue}>{avgScore}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Areas Needing Focus</Text>
                <Text style={styles.statValue}>{lowCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Strengths</Text>
                <Text style={styles.statValue}>{highCount}</Text>
              </View>
            </View>
          </View>

          <View style={styles.recommendationsContainer}>
            {sliders.map(area => {
              const rec = recommendations[area];
              const score = scores[area];
              if (!rec) return null;

              return (
                <View style={styles.recommendationCard} key={area}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{areaLabels[area]}</Text>
                    <View style={[styles.levelBadge, getLevelBadgeStyle(rec.level)]}>
                      <Text style={[styles.levelBadgeText, getLevelTextStyle(rec.level)]}>
                        {rec.level}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.contentRow}>
                      <Text style={styles.contentLabel}>Your Score:</Text>
                      <Text style={styles.contentValue}>{score}/10</Text>
                    </View>
                    <View style={styles.contentRow}>
                      <Text style={styles.contentLabel}>Status:</Text>
                      <Text style={styles.contentValue}>{rec.interpretation}</Text>
                    </View>
                    <View style={styles.recommendationText}>
                      <Text style={styles.recommendationContent}>
                        <Text style={styles.recommendationLabel}>Recommendation: </Text>
                        {rec.recommendation}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  inputSection: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  wellnessInputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 12,
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  sliderContainer: {
    paddingVertical: 8,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    position: 'relative',
    overflow: 'visible',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#06b6d4',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#06b6d4',
    borderRadius: 10,
    top: -6,
    marginLeft: -10,
    borderWidth: 3,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#06b6d4',
  },
  btn: {
    backgroundColor: '#06b6d4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  resultsSection: {
    marginBottom: 32,
  },
  summarySection: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  summaryDescription: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: 100,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#06b6d4',
  },
  recommendationsContainer: {
    gap: 16,
  },
  recommendationCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  levelBadgeLow: {
    backgroundColor: 'rgba(255, 84, 89, 0.15)',
    borderColor: 'rgba(255, 84, 89, 0.25)',
  },
  levelBadgeModerate: {
    backgroundColor: 'rgba(230, 129, 97, 0.15)',
    borderColor: 'rgba(230, 129, 97, 0.25)',
  },
  levelBadgeHigh: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  levelTextLow: {
    color: '#FF5459',
  },
  levelTextModerate: {
    color: '#E68161',
  },
  levelTextHigh: {
    color: '#06b6d4',
  },
  cardContent: {
    gap: 12,
  },
  contentRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  contentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    minWidth: 100,
  },
  contentValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    fontWeight: '600',
  },
  recommendationText: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#06b6d4',
    marginTop: 8,
  },
  recommendationContent: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  recommendationLabel: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default WellnessRecommendation;