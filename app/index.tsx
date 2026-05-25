import { Redirect } from 'expo-router';

/**
 * Root index route. 
 * For a mobile-first flow, we bypass the "Get Started" landing page 
 * and redirect directly to the authentication flow.
 * 
 * Note: The auth guard in app/_layout.tsx handles redirecting 
 * authenticated users to (tabs) automatically.
 */
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
