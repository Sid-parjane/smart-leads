import { useState, useEffect } from 'react';
import api from '../services/api';

interface Stats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: Stats }>('/stats')
      .then(({ data }) => setStats(data.data ?? null))
      .catch(() => setStats(null))
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading };
}
