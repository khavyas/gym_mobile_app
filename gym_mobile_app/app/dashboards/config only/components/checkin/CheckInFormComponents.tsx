// ─────────────────────────────────────────────────────────────
//  HiWox Weekly Check-In — Reusable Field Components
//  ScaleField · NumberField · YesNoField · DropdownField
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { CheckInQuestion } from '../../../user/data/checkinQuestions';

// ─── Shared props every field gets ───────────────────────────
interface BaseFieldProps {
  question: CheckInQuestion;
  value: any;
  onChange: (field: string, value: any) => void;
  accentColor: string;
}

// ─────────────────────────────────────────────────────────────
//  ScaleField — horizontal 1–10 tap bar
// ─────────────────────────────────────────────────────────────
export const ScaleField: React.FC<BaseFieldProps> = ({
  question,
  value,
  onChange,
  accentColor,
}) => {
  const min = question.min ?? 1;
  const max = question.max ?? 10;
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <View style={fieldStyles.wrapper}>
      <QuestionLabel question={question} />

      {/* Scale row */}
      <View style={fieldStyles.scaleRow}>
        {ticks.map((tick) => {
          const selected = value === tick;
          return (
            <TouchableOpacity
              key={tick}
              onPress={() => onChange(question.field, tick)}
              activeOpacity={0.7}
              style={[
                fieldStyles.scaleTick,
                selected && { backgroundColor: accentColor, borderColor: accentColor },
              ]}
            >
              <Text
                style={[
                  fieldStyles.scaleTickText,
                  selected && fieldStyles.scaleTickTextSelected,
                ]}
              >
                {tick}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Low / High labels */}
      {(question.lowLabel || question.highLabel) && (
        <View style={fieldStyles.scaleLabelRow}>
          <Text style={fieldStyles.scaleLabelText}>{question.lowLabel}</Text>
          <Text style={fieldStyles.scaleLabelText}>{question.highLabel}</Text>
        </View>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
//  NumberField — numeric text input with unit badge
// ─────────────────────────────────────────────────────────────
export const NumberField: React.FC<BaseFieldProps> = ({
  question,
  value,
  onChange,
  accentColor,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={fieldStyles.wrapper}>
      <QuestionLabel question={question} />
      <View
        style={[
          fieldStyles.numberInputRow,
          focused && { borderColor: accentColor },
        ]}
      >
        <TextInput
          style={fieldStyles.numberInput}
          keyboardType="numeric"
          placeholder="—"
          placeholderTextColor="#4B5563"
          value={value !== undefined && value !== null ? String(value) : ''}
          onChangeText={(txt) => {
            const parsed = parseFloat(txt);
            onChange(question.field, isNaN(parsed) ? null : parsed);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={8}
        />
        {question.unit && (
          <View style={[fieldStyles.unitBadge, { backgroundColor: accentColor + '22' }]}>
            <Text style={[fieldStyles.unitText, { color: accentColor }]}>
              {question.unit}
            </Text>
          </View>
        )}
      </View>
      {question.min !== undefined && question.max !== undefined && (
        <Text style={fieldStyles.rangeHint}>
          Range: {question.min} – {question.max}
        </Text>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
//  YesNoField — two large toggle buttons
// ─────────────────────────────────────────────────────────────
export const YesNoField: React.FC<BaseFieldProps> = ({
  question,
  value,
  onChange,
  accentColor,
}) => {
  return (
    <View style={fieldStyles.wrapper}>
      <QuestionLabel question={question} />
      <View style={fieldStyles.yesnoRow}>
        {(['Yes', 'No'] as const).map((opt) => {
          const boolVal = opt === 'Yes';
          const selected = value === boolVal;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(question.field, boolVal)}
              activeOpacity={0.7}
              style={[
                fieldStyles.yesnoBtn,
                selected && {
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                },
              ]}
            >
              <Text
                style={[
                  fieldStyles.yesnoBtnText,
                  selected && fieldStyles.yesnoBtnTextSelected,
                ]}
              >
                {opt === 'Yes' ? '✓  Yes' : '✕  No'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
//  DropdownField — scrollable pill options (native-friendly)
// ─────────────────────────────────────────────────────────────
export const DropdownField: React.FC<BaseFieldProps> = ({
  question,
  value,
  onChange,
  accentColor,
}) => {
  return (
    <View style={fieldStyles.wrapper}>
      <QuestionLabel question={question} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={fieldStyles.dropdownRow}
      >
        {(question.options ?? []).map((opt) => {
          const selected = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(question.field, opt)}
              activeOpacity={0.7}
              style={[
                fieldStyles.dropdownPill,
                selected && {
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                },
              ]}
            >
              <Text
                style={[
                  fieldStyles.dropdownPillText,
                  selected && fieldStyles.dropdownPillTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
//  QuestionLabel — shared label + optional badge
// ─────────────────────────────────────────────────────────────
const QuestionLabel: React.FC<{ question: CheckInQuestion }> = ({ question }) => (
  <View style={fieldStyles.labelRow}>
    <Text style={fieldStyles.labelText}>{question.label}</Text>
    {question.optional && (
      <View style={fieldStyles.optionalBadge}>
        <Text style={fieldStyles.optionalText}>Optional</Text>
      </View>
    )}
  </View>
);

// ─────────────────────────────────────────────────────────────
//  CheckInField — master dispatcher (use this in the screen)
// ─────────────────────────────────────────────────────────────
export const CheckInField: React.FC<BaseFieldProps> = (props) => {
  switch (props.question.type) {
    case 'scale':
      return <ScaleField {...props} />;
    case 'number':
      return <NumberField {...props} />;
    case 'yesno':
      return <YesNoField {...props} />;
    case 'dropdown':
      return <DropdownField {...props} />;
    default:
      return null;
  }
};

// ─────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────
const fieldStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 28,
  },

  // ── Label ──
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  labelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
    flex: 1,
    lineHeight: 21,
  },
  optionalBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  optionalText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },

  // ── Scale ──
  scaleRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  scaleTick: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleTickText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  scaleTickTextSelected: {
    color: '#FFFFFF',
  },
  scaleLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  scaleLabelText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },

  // ── Number ──
  numberInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
  },
numberInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  unitBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rangeHint: {
    marginTop: 6,
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },

  // ── YesNo ──
  yesnoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  yesnoBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesnoBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  yesnoBtnTextSelected: {
    color: '#FFFFFF',
  },

  // ── Dropdown ──
  dropdownRow: {
    gap: 10,
    paddingBottom: 4,
  },
  dropdownPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  dropdownPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dropdownPillTextSelected: {
    color: '#FFFFFF',
  },
});