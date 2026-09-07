import { useNavigate as useNavigateRR } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigateRR();
  return navigate;
}
