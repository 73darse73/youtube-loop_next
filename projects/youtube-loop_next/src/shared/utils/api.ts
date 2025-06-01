interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const fetchApi = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`APIリクエストに失敗しました: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}; 