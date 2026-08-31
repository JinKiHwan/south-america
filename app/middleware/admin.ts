export default defineNuxtRouteMiddleware(async () => {
  const { session, refresh } = useAdminSession();
  if (session.value) return;
  try {
    await refresh();
  } catch {
    session.value = null;
    return navigateTo('/admin/login');
  }
});
