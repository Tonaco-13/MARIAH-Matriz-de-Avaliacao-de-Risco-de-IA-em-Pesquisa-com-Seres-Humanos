'use client';

import { useReducer, useEffect, useCallback } from 'react';
import VersionSelector from '@/components/mara/VersionSelector';
import EntryFilter from '@/components/mara/EntryFilter';
import ContextForm from '@/components/mara/ContextForm';
import QualitativeAssessment from '@/components/mara/QualitativeAssessment';
import QuantitativeAssessment from '@/components/mara/QuantitativeAssessment';
import Results from '@/components/mara/Results';
import type { MarcaVersion } from '@/components/mara/data';

// ----- State Types -----

type Step = 'version' | 'filter' | 'context' | 'assessment' | 'results';

type AppState = {
  step: Step;
  version: MarcaVersion | null;
  useAAsTriagem: boolean;
  filterResult: 'sim' | 'nao' | null;
  /**
   * Indica se o protocolo utiliza banco de dados (filtro Passo 0, Res. CNS n.º 738/2024).
   * null = ainda não respondido; true = ativa Eixo 3.b / Bloco 6.b.
   */
  usesDatabase: boolean | null;
  contextAnswers: Record<string, string>;
  qualitativeAnswers: Record<string, 'sim' | 'nao' | 'na'>;
  quantitativeAnswers: Record<string, 'sim' | 'nao' | 'na'>;
};

// ----- Actions -----

type Action =
  | { type: 'SELECT_VERSION'; version: MarcaVersion; useAAsTriagem: boolean }
  | { type: 'SET_FILTER_RESULT'; result: 'sim' | 'nao'; usesDatabase?: boolean }
  | { type: 'SET_USES_DATABASE'; usesDatabase: boolean }
  | { type: 'SET_CONTEXT_ANSWER'; id: string; value: string }
  | { type: 'SET_QUALITATIVE_ANSWER'; id: string; value: 'sim' | 'nao' | 'na' }
  | { type: 'SET_QUANTITATIVE_ANSWER'; id: string; value: 'sim' | 'nao' | 'na' }
  | { type: 'CLEAR_FILTER' }
  | { type: 'CLEAR_CONTEXT' }
  | { type: 'CLEAR_QUALITATIVE_IDS'; ids: string[] }
  | { type: 'CLEAR_QUANTITATIVE_IDS'; ids: string[] }
  | { type: 'GO_TO_STEP'; step: Step }
  | { type: 'CONTINUE_TO_B' }
  | { type: 'RESTART' }
  | { type: 'RESTORE'; state: AppState };

// ----- Reducer -----

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SELECT_VERSION':
      return {
        ...state,
        version: action.version,
        useAAsTriagem: action.useAAsTriagem,
        step: 'filter',
      };
    case 'SET_FILTER_RESULT':
      return {
        ...state,
        filterResult: action.result,
        usesDatabase:
          action.result === 'sim' && action.usesDatabase !== undefined
            ? action.usesDatabase
            : state.usesDatabase,
        step: action.result === 'sim' ? 'context' : state.step,
      };
    case 'SET_USES_DATABASE':
      return {
        ...state,
        usesDatabase: action.usesDatabase,
      };
    case 'SET_CONTEXT_ANSWER':
      return {
        ...state,
        contextAnswers: { ...state.contextAnswers, [action.id]: action.value },
      };
    case 'SET_QUALITATIVE_ANSWER':
      return {
        ...state,
        qualitativeAnswers: { ...state.qualitativeAnswers, [action.id]: action.value },
      };
    case 'SET_QUANTITATIVE_ANSWER':
      return {
        ...state,
        quantitativeAnswers: { ...state.quantitativeAnswers, [action.id]: action.value },
      };
    case 'CLEAR_FILTER':
      // Limpa só as respostas do passo Filtro, preservando versão escolhida e respostas posteriores.
      return {
        ...state,
        filterResult: null,
        usesDatabase: null,
      };
    case 'CLEAR_CONTEXT':
      // Limpa todos os campos de identificação e caracterização do contexto.
      return {
        ...state,
        contextAnswers: {},
      };
    case 'CLEAR_QUALITATIVE_IDS': {
      // Limpa respostas do escopo dado (eixo atual). Demais respostas preservadas.
      const next = { ...state.qualitativeAnswers };
      for (const id of action.ids) delete next[id];
      return { ...state, qualitativeAnswers: next };
    }
    case 'CLEAR_QUANTITATIVE_IDS': {
      // Idem para o bloco atual da Versão B.
      const next = { ...state.quantitativeAnswers };
      for (const id of action.ids) delete next[id];
      return { ...state, quantitativeAnswers: next };
    }
    case 'GO_TO_STEP':
      return { ...state, step: action.step };
    case 'CONTINUE_TO_B':
      return {
        ...state,
        version: 'B',
        step: 'assessment',
      };
    case 'RESTART':
      return initialState;
    case 'RESTORE':
      return action.state;
    default:
      return state;
  }
}

const initialState: AppState = {
  step: 'version',
  version: null,
  useAAsTriagem: false,
  filterResult: null,
  usesDatabase: null,
  contextAnswers: {},
  qualitativeAnswers: {},
  quantitativeAnswers: {},
};

// ----- LocalStorage -----

const STORAGE_KEY = 'mara-assessment-state';

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

function loadState(): AppState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AppState;
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

// ----- Main Page -----

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved && saved.step !== 'version') {
      dispatch({ type: 'RESTORE', state: saved });
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (state.step !== 'version') {
      saveState(state);
    }
  }, [state]);

  const handleSelectVersion = useCallback((version: MarcaVersion) => {
    dispatch({ type: 'SELECT_VERSION', version, useAAsTriagem: false });
  }, []);

  const handleSelectTriagem = useCallback(() => {
    dispatch({ type: 'SELECT_VERSION', version: 'A', useAAsTriagem: true });
  }, []);

  const handleFilterPass = useCallback((usesDatabase: boolean) => {
    dispatch({ type: 'SET_FILTER_RESULT', result: 'sim', usesDatabase });
  }, []);

  const handleFilterFail = useCallback(() => {
    dispatch({ type: 'SET_FILTER_RESULT', result: 'nao' });
  }, []);

  const handleUsesDatabaseChange = useCallback((usesDatabase: boolean) => {
    dispatch({ type: 'SET_USES_DATABASE', usesDatabase });
  }, []);

  const handleContextAnswer = useCallback((id: string, value: string) => {
    dispatch({ type: 'SET_CONTEXT_ANSWER', id, value });
  }, []);

  const handleQualitativeAnswer = useCallback((id: string, value: 'sim' | 'nao' | 'na') => {
    dispatch({ type: 'SET_QUALITATIVE_ANSWER', id, value });
  }, []);

  const handleQuantitativeAnswer = useCallback((id: string, value: 'sim' | 'nao' | 'na') => {
    dispatch({ type: 'SET_QUANTITATIVE_ANSWER', id, value });
  }, []);

  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    dispatch({ type: 'RESTART' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleContinueToB = useCallback(() => {
    dispatch({ type: 'CONTINUE_TO_B' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearFilter = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTER' });
  }, []);

  const handleClearContext = useCallback(() => {
    dispatch({ type: 'CLEAR_CONTEXT' });
  }, []);

  const handleClearQualitativeIds = useCallback((ids: string[]) => {
    dispatch({ type: 'CLEAR_QUALITATIVE_IDS', ids });
  }, []);

  const handleClearQuantitativeIds = useCallback((ids: string[]) => {
    dispatch({ type: 'CLEAR_QUANTITATIVE_IDS', ids });
  }, []);

  /**
   * Navegação direta por clique nos passos do StepIndicator. Só permite voltar a
   * passos anteriores (já completados ou o atual) — pular para passos futuros sem
   * preencher os obrigatórios quebraria a auditoria.
   */
  const handleStepClick = useCallback(
    (target: Step) => {
      const order: Step[] = ['version', 'filter', 'context', 'assessment', 'results'];
      const currentIdx = order.indexOf(state.step);
      const targetIdx = order.indexOf(target);
      if (targetIdx >= 0 && targetIdx <= currentIdx) {
        dispatch({ type: 'GO_TO_STEP', step: target });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [state.step]
  );

  switch (state.step) {
    case 'version':
      return (
        <VersionSelector
          onSelect={handleSelectVersion}
          onSelectTriagem={handleSelectTriagem}
        />
      );

    case 'filter':
      return (
        <EntryFilter
          onPass={handleFilterPass}
          onFail={handleFilterFail}
          onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'version' })}
          onRestart={handleRestart}
          onClearScope={handleClearFilter}
          onStepClick={handleStepClick}
          filterResult={state.filterResult}
          usesDatabase={state.usesDatabase}
          onUsesDatabaseChange={handleUsesDatabaseChange}
          version={state.version}
        />
      );

    case 'context':
      return (
        <ContextForm
          answers={state.contextAnswers}
          onAnswer={handleContextAnswer}
          onNext={() => dispatch({ type: 'GO_TO_STEP', step: 'assessment' })}
          onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'filter' })}
          onRestart={handleRestart}
          onClearScope={handleClearContext}
          onStepClick={handleStepClick}
          version={state.version}
        />
      );

    case 'assessment':
      if (state.version === 'A') {
        return (
          <QualitativeAssessment
            answers={state.qualitativeAnswers}
            onAnswer={handleQualitativeAnswer}
            usesDatabase={state.usesDatabase === true}
            onComplete={() => {
              dispatch({ type: 'GO_TO_STEP', step: 'results' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'context' })}
            onRestart={handleRestart}
            onClearScopeIds={handleClearQualitativeIds}
            onStepClick={handleStepClick}
          />
        );
      }
      return (
        <QuantitativeAssessment
          answers={state.quantitativeAnswers}
          onAnswer={handleQuantitativeAnswer}
          usesDatabase={state.usesDatabase === true}
          onComplete={() => {
            dispatch({ type: 'GO_TO_STEP', step: 'results' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'context' })}
          onRestart={handleRestart}
          onClearScopeIds={handleClearQuantitativeIds}
          onStepClick={handleStepClick}
        />
      );

    case 'results':
      return (
        <Results
          version={state.version!}
          useAAsTriagem={state.useAAsTriagem}
          usesDatabase={state.usesDatabase === true}
          contextAnswers={state.contextAnswers}
          qualitativeAnswers={state.qualitativeAnswers}
          quantitativeAnswers={state.quantitativeAnswers}
          onRestart={handleRestart}
          onContinueToB={handleContinueToB}
          onStepClick={handleStepClick}
        />
      );

    default:
      return null;
  }
}
