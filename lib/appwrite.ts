import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Account, Avatars, Client, OAuthProvider } from 'react-native-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ??
  process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ??
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.NEXT_PUBLIC_APPWRITE_ENDPOINT ??
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.EXPO_PUBLIC_APPWRITE_ENDPOINT ??
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.APPWRITE_ENDPOINT;

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ??
  process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ??
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.NEXT_PUBLIC_APPWRITE_PROJECT_ID ??
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.EXPO_PUBLIC_APPWRITE_PROJECT_ID ??
  (Constants.expoConfig?.extra as Record<string, string> | undefined)?.APPWRITE_PROJECT_ID;

if (!endpoint || typeof endpoint !== 'string' || endpoint.trim().length === 0) {
  throw new Error(
    'Appwrite endpoint is missing or invalid. Set EXPO_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_ENDPOINT in your environment or expo config.'
  );
}

if (!projectId || typeof projectId !== 'string' || projectId.trim().length === 0) {
  throw new Error(
    'Appwrite project ID is missing or invalid. Set EXPO_PUBLIC_APPWRITE_PROJECT_ID or NEXT_PUBLIC_APPWRITE_PROJECT_ID in your environment or expo config.'
  );
}

export const config = {
  platform: 'com.talinosolutions.realestate',
  endpoint,
  projectId,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function login() {
    try {
        const redirectUri = Linking.createURL('/');

        const response = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri,
        );

        if (!response) throw new Error('Failed to login');

        const browserResult = await WebBrowser.openAuthSessionAsync(
            response.toString(),
            redirectUri
        );

        if (!browserResult || browserResult.type !== 'success' || !browserResult.url) {
            throw new Error('Failed to login');
        }

        const url = new URL(browserResult.url);
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();
        if (!secret || !userId) throw new Error('Failed to login');

        const session = await account.createSession(
            userId,
            secret
        );

        if (!session) throw new Error('Failed to create session');

        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function logout() {
    try {
        await account.deleteSessions();
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCurrentUser() {
    try {
        const response = await account.get();

        if (response.$id){
            const userAvatar = avatar.getInitials(response.name);
            return {
                ... response, 
                avatar: userAvatar.toString(), 
            }
        }
        
    } catch (error) {
        // Silently handle authentication errors (expected when user is not logged in)
        return null;
    }
}

