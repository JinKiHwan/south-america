export default defineEventHandler(async event => {
  const account = await requireAdmin(event);
  return { username: account.username, role: account.role };
});
