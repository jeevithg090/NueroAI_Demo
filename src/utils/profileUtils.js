export function generateProfile(answers) {
  const attentionScore = answers.attention || 2; 
  const modalityPref = answers.modality || 'visual';
  const sensoryScore = answers.sensory || 2;
  const layoutPref = answers.layout || 'structured';
  const motivationType = answers.feedback || 'predictable';

  let mode = 'asd'; 
  if (attentionScore <= 2 && motivationType === 'gamified') mode = 'adhd';
  if (modalityPref === 'audio' || layoutPref === 'minimal') mode = 'dyslexia';
  if (layoutPref === 'minimal' && sensoryScore === 1) mode = 'asd';

  return {
    name: 'New Student',
    attentionSpan: attentionScore,
    modalityPref,
    sensoryScore,
    layoutPref,
    motivationType,
    recommendedMode: mode,
    vector: [attentionScore / 4, sensoryScore / 4, modalityPref === 'audio' ? 1 : 0.3]
  };
}

export function saveProfile(profile) {
  localStorage.setItem('neurolearn_profile', JSON.stringify(profile));
}

export function loadProfile() {
  const raw = localStorage.getItem('neurolearn_profile');
  return raw ? JSON.parse(raw) : null;
}
