
import client from './client';  // Adjust the import path based on your file structure
// import avatarPath from '../assets/avatar.jpg';  // Import the default avatar image
export const getCurrentUser = async () => {
  try {
    const response = await client.post('/user/currentUser');
    return response.data;  // Assuming the response contains the user data
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;  // Propagate error to handle in the calling component
  }
};



export const logoutUser=async()=>{
    try {
        const response = await client.post('/user/logout');
        return response.data;  // Assuming the response contains the user data
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;  // Propagate error to handle in the calling component
    }
}


export const registerUser = async (
    name: string,
    username: string,
    password: string,
    bio: string
): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("bio", bio);

        // Add a default avatar file
        // const defaultAvatarResponse = await fetch(avatarPath);
        // const defaultAvatarBlob = await defaultAvatarResponse.blob();
        // const defaultAvatar = new File([defaultAvatarBlob], "avatar.jpg", { type: "image/jpg" });
        formData.append("avatar","https://res.cloudinary.com/dqk0joznz/image/upload/v1734958263/lor08rvja59sywswn8pz.jpg");

        // Call the API
        const response = await client.post("/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error: any) {
        console.error("Error registering user:", error.response?.data || error.message);
        throw new Error(error.response?.data || "Failed to register user");
    }
};
