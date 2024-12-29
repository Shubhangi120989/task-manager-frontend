import client from './client';
import { getCurrentUser } from './user';
import { setLoading, setCurrentUser, setError } from '../redux/userSlice';

interface LoginRequest {
  username: string;
  password: string;
}

interface JwtResponse {
  token: string;
}

export async function login(credentials: LoginRequest, dispatch: any): Promise<JwtResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    // Make the login request
    const response = await client.post<JwtResponse>('/authenticate', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log(response.data);

    // Fetch the current user and set in state after login
    await fetchUser(dispatch);

    return response.data; // This contains the JWT token if returned in the body

  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
}

export async function googleLogin(): Promise<void> {
  try {
    // Redirect to Google OAuth2 login page
    // @ts-expect-error "location"
    window.location.href = `${import.meta.VITE_API_BASE_URL}/oauth2/authorization/google`;
    // await client.get('/oauth2/authorization/google');
    
  } catch (error: any) {
    
    console.error('Failed to initiate Google login', error);
  }
}

// Updated fetchUser function
const fetchUser = async (dispatch: any) => {
  dispatch(setLoading(true)); // Set loading state

  try {
    const currentUser = await getCurrentUser();
    console.log(currentUser);

    if (currentUser) {
      dispatch(setCurrentUser(currentUser)); // Update current user in Redux
    }
  } catch (error) {
    dispatch(setError('An error occurred while fetching the user'));
    console.log('Error occurred while fetching the user');
  }

  dispatch(setLoading(false)); // Reset loading state
};
