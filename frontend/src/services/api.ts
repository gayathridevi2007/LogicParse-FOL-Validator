import {
  ValidationRequest,
  ValidationResponse,
  HistoryItem,
  ExampleItem,
  PracticeQuestion,
  PracticeCheckResponse,
  AboutInfo
} from '../types/fol';

// In production on Vercel, requests use relative paths (/api/...)
// In local development, Vite proxies /api requests to http://127.0.0.1:8000
const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.replace(/\/+$/, '');
  }
  return '';
};

export const API_BASE_URL = getBaseUrl();

const buildUrl = (path: string, params?: Record<string, string | number | boolean | undefined>): string => {
  let fullPath = `${API_BASE_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullPath += (fullPath.includes('?') ? '&' : '?') + queryString;
    }
  }
  return fullPath;
};

export async function checkBackendHealth(): Promise<{ status: string; healthy: boolean }> {
  try {
    const res = await fetch(buildUrl('/api/health'), {
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({ status: 'healthy' }));
      return { status: data.status || 'healthy', healthy: true };
    }
    return { status: 'unhealthy', healthy: false };
  } catch (err: any) {
    return { status: 'unavailable', healthy: false };
  }
}

export async function validateExpression(payload: ValidationRequest): Promise<ValidationResponse> {
  let res: Response;
  try {
    res = await fetch(buildUrl('/api/validate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (netErr: any) {
    throw new Error('NETWORK_CONNECTION_ERROR: Unable to connect to the LogicParse validation backend service. Please check your internet connection or verify the server status.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to validate expression' }));
    throw new Error(err.detail || `Server error (${res.status})`);
  }

  return res.json();
}

export async function getHistory(filterValid?: boolean): Promise<HistoryItem[]> {
  const url = buildUrl('/api/history', { filter_valid: filterValid });
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to load validation history');
  }
  return res.json();
}

export async function getHistoryDetail(id: number): Promise<HistoryItem> {
  const res = await fetch(buildUrl(`/api/history/${id}`));
  if (!res.ok) {
    throw new Error(`Failed to load history record ${id}`);
  }
  return res.json();
}

export async function deleteHistoryItem(id: number): Promise<{ status: string }> {
  const res = await fetch(buildUrl(`/api/history/${id}`), {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error(`Failed to delete history record ${id}`);
  }
  return res.json();
}

export async function clearAllHistory(): Promise<{ status: string }> {
  const res = await fetch(buildUrl('/api/history'), {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Failed to clear history');
  }
  return res.json();
}

export async function getExamples(): Promise<ExampleItem[]> {
  const res = await fetch(buildUrl('/api/examples'));
  if (!res.ok) {
    throw new Error('Failed to load example expressions');
  }
  return res.json();
}

export async function getPracticeQuestions(): Promise<PracticeQuestion[]> {
  const res = await fetch(buildUrl('/api/practice/questions'));
  if (!res.ok) {
    throw new Error('Failed to load practice questions');
  }
  return res.json();
}

export async function checkPracticeAnswer(
  questionId: number,
  selectedOptionIndex: number
): Promise<PracticeCheckResponse> {
  const res = await fetch(buildUrl('/api/practice/check'), {
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
  const res = await fetch(buildUrl('/api/about'));
  if (!res.ok) {
    throw new Error('Failed to load project details');
  }
  return res.json();
}
