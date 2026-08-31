export interface AdminSession {
  username: string;
  role: 'master';
}

export function useAdminSession() {
  const session = useState<AdminSession | null>('admin-session', () => null);
  const requestFetch = useRequestFetch();
  const refresh = async () => {
    session.value = await requestFetch<AdminSession>('/api/admin/session');
    return session.value;
  };
  return { session, refresh };
}
