import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// Type definitions
interface WellnessRange {
  range: [number, number];
  level: string;
  interpretation: string;
  recommendation: string;
}

interface WellnessDataType {
  physical: WellnessRange[];
  mental: WellnessRange[];
  emotional: WellnessRange[];
  nutritional: WellnessRange[];
  sleep: WellnessRange[];
}

interface Scores {
  physical: number;
  mental: number;
  emotional: number;
  nutritional: number;
  sleep: number;
}

type WellnessArea = keyof Scores;

interface PatternAnalysis {
  avgScore: string;
  lowCount: number;
  highCount: number;
  focusArea: WellnessArea;
  keyFocusSuggestion: string;
}

// Data
const wellnessData: WellnessDataType = {
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

const areaLabels: Record<WellnessArea, string> = {
  physical: 'Physical Wellness',
  mental: 'Mental Wellness',
  emotional: 'Emotional Wellness',
  nutritional: 'Nutritional Wellness',
  sleep: 'Sleep Wellness',
};

// Helper functions
function getRecommendation(area: WellnessArea, score: number): WellnessRange | undefined {
  return wellnessData[area].find(rec => score >= rec.range[0] && score <= rec.range[1]);
}

function analyzePattern(scores: Scores): PatternAnalysis {
  const values = Object.values(scores);
  const avgScore = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const lowCount = values.filter(v => v <= 4).length;
  const highCount = values.filter(v => v >= 8).length;
  const focusArea = (Object.keys(scores) as WellnessArea[]).reduce((a, b) => 
    (scores[a] < scores[b] ? a : b)
  );

  const suggestions: Record<WellnessArea, string> = {
    physical: 'Add moderate physical activity daily — like brisk walking.',
    mental: 'Try brief mindfulness breaks and limit screen exposure.',
    emotional: 'Do one joyful or creative thing daily to lift your mood.',
    nutritional: 'Hydrate more and keep veggies in at least two meals.',
    sleep: 'Standardize your bedtime; practice good sleep hygiene.'
  };

  const keyFocusSuggestion = suggestions[focusArea];

  return { avgScore, lowCount, highCount, focusArea, keyFocusSuggestion };
}

// Simple Radar Chart Component
const RadarChart: React.FC<{ scores: Scores }> = ({ scores }) => {
  const areas = Object.keys(scores) as WellnessArea[];
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const levels = 5;

  // Calculate points for pentagon
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / areas.length - Math.PI / 2;
    const r = (value / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Create path for score polygon
  const scorePoints = areas.map((area, i) => getPoint(i, scores[area]));
  const scorePath = scorePoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  // Create grid lines
  const gridPaths = Array.from({ length: levels }, (_, i) => {
    const levelRadius = radius * ((i + 1) / levels);
    const points = areas.map((_, idx) => {
      const angle = (Math.PI * 2 * idx) / areas.length - Math.PI / 2;
      return {
        x: center + levelRadius * Math.cos(angle),
        y: center + levelRadius * Math.sin(angle)
      };
    });
    return points.map((p, idx) => 
      `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ') + ' Z';
  });

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Wellness Radar</Text>
      <View style={styles.svgContainer}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Grid */}
          {gridPaths.map((path, i) => (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
            />
          ))}
          
          {/* Axis lines */}
          {areas.map((_, i) => {
            const angle = (Math.PI * 2 * i) / areas.length - Math.PI / 2;
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(angle)}
                y2={center + radius * Math.sin(angle)}
                stroke="#334155"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Score polygon */}
          <path
            d={scorePath}
            fill="rgba(6, 182, 212, 0.3)"
            stroke="#06b6d4"
            strokeWidth="2"
          />
          
          {/* Score points */}
          {scorePoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#06b6d4"
            />
          ))}
        </svg>
      </View>
      <View style={styles.chartLabels}>
        {areas.map(area => (
          <Text key={area} style={styles.chartLabel}>
            {areaLabels[area].replace(' Wellness', '')}
          </Text>
        ))}
      </View>
    </View>
  );
};

// Simple Bar Chart Component
const BarChart: React.FC<{ scores: Scores }> = ({ scores }) => {
  const areas = Object.keys(scores) as WellnessArea[];
  const maxHeight = 150;
  const benchmark = 7.5;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Score Comparison</Text>
      <View style={styles.barChartContainer}>
        {areas.map(area => {
          const score = scores[area];
          const scoreHeight = (score / 10) * maxHeight;
          const benchmarkHeight = (benchmark / 10) * maxHeight;

          return (
            <View key={area} style={styles.barGroup}>
              <View style={styles.barStack}>
                <View style={[styles.benchmarkBar, { height: benchmarkHeight }]} />
                <View style={[styles.scoreBar, { height: scoreHeight }]} />
              </View>
              <Text style={styles.barLabel}>
                {areaLabels[area].replace(' Wellness', '')}
              </Text>
              <Text style={styles.barValue}>{score}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#06b6d4' }]} />
          <Text style={styles.legendText}>Your Score</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#64748B' }]} />
          <Text style={styles.legendText}>Benchmark (7.5)</Text>
        </View>
      </View>
    </View>
  );
};

// Main Component
const WellnessRecommendation: React.FC = () => {
  const [scores, setScores] = useState<Scores>({
    physical: 5,
    mental: 5,
    emotional: 5,
    nutritional: 5,
    sleep: 5,
  });
  const [showResults, setShowResults] = useState(false);

  const sliders: WellnessArea[] = Object.keys(scores) as WellnessArea[];
  const { avgScore, lowCount, highCount, focusArea, keyFocusSuggestion } = analyzePattern(scores);

  const recommendations = Object.fromEntries(
    sliders.map(area => [area, getRecommendation(area, scores[area])])
  ) as Record<WellnessArea, WellnessRange | undefined>;

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
        <Text style={styles.headerTitle}>Wellness Recommendation & Pattern Analysis</Text>
        <Text style={styles.headerSubtitle}>
          Rate your wellness across five key areas to receive visual insights and domain-specific recommendations
        </Text>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.wellnessInputs}>
          {sliders.map(area => renderSlider(area))}
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleGenerate}>
          <Text style={styles.btnText}>Show My Wellness Results</Text>
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
                <Text style={styles.statLabel}>High Wellness Areas</Text>
                <Text style={styles.statValue}>{highCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Primary Focus Area</Text>
                <Text style={styles.statValue}>{areaLabels[focusArea].replace(' Wellness', '')}</Text>
              </View>
            </View>
            <View style={styles.focusAdvice}>
              <Text style={styles.focusAdviceLabel}>Expert Tip: </Text>
              <Text style={styles.focusAdviceText}>{keyFocusSuggestion}</Text>
            </View>
          </View>

          {/* Charts */}
          <View style={styles.chartsContainer}>
            <RadarChart scores={scores} />
            <BarChart scores={scores} />
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
    backgroundColor: '#0F172A',
  },
  headerSection: {
    marginBottom: 24,
    marginTop: 16,
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
    marginBottom: 16,
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
  focusAdvice: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#06b6d4',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  focusAdviceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  focusAdviceText: {
    fontSize: 14,
    color: '#94A3B8',
    flex: 1,
  },
  chartsContainer: {
    gap: 16,
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  chartLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  chartLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    paddingBottom: 30,
  },
  barGroup: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  barStack: {
    position: 'relative',
    width: 40,
    alignItems: 'center',
  },
  scoreBar: {
    width: 30,
    backgroundColor: '#06b6d4',
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
  },
  benchmarkBar: {
    width: 40,
    backgroundColor: '#64748B',
    opacity: 0.3,
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
  },
  barLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#06b6d4',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#94A3B8',
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
