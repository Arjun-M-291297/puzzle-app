export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  CaseIntro: { caseId: string };
  Intro: { caseId: string };
  Play: { caseId: string };
  EvidenceBoard: { caseId: string };
  Ending: { caseId: string; solvedCorrectly: boolean };
};
