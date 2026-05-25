import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { STORAGE_KEYS } from '@/lib/constants';

export interface AIInsight {
  id: string;
  user_id: string;
  insight_text: string;
  type: 'post_session' | 'weekly_report';
  read: boolean;
  created_at: string;
}

/**
 * Hook for managing Claude AI Coach insights.
 */
export function useAIInsights() {
  const queryClient = useQueryClient();

  const { data: insights, isLoading, refetch } = useQuery({
    queryKey: ['ai_insights'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as AIInsight[];
    },
  });

  const generateInsight = useMutation({
    mutationFn: async (type: 'post_session' | 'weekly_report') => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('generate-insight', {
        body: { user_id: user.id, insight_type: type },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_insights'] });
    },
  });

  return {
    insights,
    isLoading,
    generateInsight,
    refetch,
  };
}
