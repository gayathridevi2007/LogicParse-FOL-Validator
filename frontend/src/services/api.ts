import {
  ValidationRequest,
  ValidationResponse,
  HistoryItem,
  ExampleItem,
  PracticeQuestion,
  PracticeCheckResponse,
  AboutInfo
} from '../types/fol';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function validateExpression(payload: ValidationRequest): Promise<ValidationResponse> {
  const res = await fetch(`${API_BASE_URL}/api/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to validate expression' }));
    throw new Error(err.detail || 'Validation failed on server');
  }

  return res.json();
}

export async function getHistory(filterValid?: boolean): Promise<HistoryItem[]> {
  const url = new URL(`${API_BASE_URL}/api/history`);
  if (filterValid !== undefined) {
    url.searchParams.append('filter_valid', String(filterValid));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Failed to load validation history');
  }
  return res.json();
}

export async function getHistoryDetail(id: number): Promise<HistoryItem> {
  const res = await fetch(`${API_BASE_URL}/api/history/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load history record ${id}`);
  }
  return res.json();
}

export async function deleteHistoryItem(id: number): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error(`Failed to delete history record ${id}`);
  }
  return res.json();
}

export async function clearAllHistory(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE_URL}/api/history`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Failed to clear history');
  }
  return res.json();
}

export async function getExamples(): Promise<ExampleItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/examples`);
  if (!res.ok) {
    throw new Error('Failed to load example expressions');
  }
  return res.json();
}

export async function getPracticeQuestions(): Promise<PracticeQuestion[]> {
  const res = await fetch(`${API_BASE_URL}/api/practice/questions`);
  if (!res.ok) {
    throw new Error('Failed to load practice questions');
  }
  return res.json();
}

export async function checkPracticeAnswer(
  questionId: number,
  selectedOptionIndex: number
): Promise<PracticeCheckResponse> {
  const res = await fetch(`${API_BASE_URL}/api/practice/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question_id: questionId,
      selected_option_index: selectedOptionIndex
    })
  });

  if (!res.ok) {
    throw new Error('Failed to check practice answer');
  }
  return res.json();
}

export async function getAboutInfo(): Promise<AboutInfo> {
  const res = await fetch(`${API_BASE_URL}/api/about`);
  if (!res.ok) {
    throw new Error('Failed to load project details');
  }
  return res.json();
}
