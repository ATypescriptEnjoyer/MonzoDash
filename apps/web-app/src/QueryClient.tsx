import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@uidotdev/usehooks';
import { QueryClient as BaseQueryClient, QueryCache, MutationCache, QueryClientProvider } from '@tanstack/react-query';
import { isAxiosError, HttpStatusCode } from 'axios';
import { ReactNode } from 'react';

function QueryClient({ children }: { children: ReactNode }) {
  const [code] = useLocalStorage<string>('auth-code');
  const navigate = useNavigate();

  const onError = (error: Error) => {
    if (isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized) {
      window.localStorage.clear();
      navigate('/app-login');
    }
  };

  const queryClient = new BaseQueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        meta: {
          authorization: code,
        },
      },
    },
    queryCache: new QueryCache({
      onError,
    }),
    mutationCache: new MutationCache({
      onError,
    }),
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryClient;
