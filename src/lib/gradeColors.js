/**
 * School-style grade colors for report card display.
 */

export const GRADE_SCALE = [
  { letter: 'A', label: 'Excellent', color: 'A' },
  { letter: 'B', label: 'Strong', color: 'B' },
  { letter: 'C', label: 'Developing', color: 'C' },
  { letter: 'D', label: 'Limited', color: 'D' },
  { letter: 'F', label: 'Critical', color: 'F' },
];

export const GRADE_COLORS = {
  A: {
    bg: '#dcfce7',
    text: '#166534',
    border: '#86efac',
    label: 'Excellent',
  },
  B: {
    bg: '#dbeafe',
    text: '#1e40af',
    border: '#93c5fd',
    label: 'Strong',
  },
  C: {
    bg: '#fef9c3',
    text: '#854d0e',
    border: '#fde047',
    label: 'Developing',
  },
  D: {
    bg: '#ffedd5',
    text: '#9a3412',
    border: '#fdba74',
    label: 'Limited',
  },
  F: {
    bg: '#fee2e2',
    text: '#991b1b',
    border: '#fca5a5',
    label: 'Critical',
  },
};

export function getGradeLetter(grade) {
  if (!grade) return 'C';
  const letter = grade.charAt(0).toUpperCase();
  return GRADE_COLORS[letter] ? letter : 'C';
}

export function getGradeColors(grade) {
  return GRADE_COLORS[getGradeLetter(grade)] ?? GRADE_COLORS.C;
}

export function getGradeStatusLabel(grade) {
  return getGradeColors(grade).label;
}
