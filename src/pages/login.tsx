import {Card, CardHeader, CardBody, CardFooter, Divider, Link,
    //  Image
    } from "@nextui-org/react";
import { useState,useEffect } from "react";
import {Form, Input, Button} from "@nextui-org/react";
import { login } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {Spinner} from "@nextui-org/react";
import google from "../assets/google.png";
import { googleLogin } from "../apis/auth";
// import GoogleOneTapLogin from 'react-google-one-tap-login';

// import { set } from "lodash";
const LoginPage: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        setUsername("");
        setPassword("");
    }, []);

    const navigate = useNavigate();


    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    // const [error, setError] = useState<string | null>(null);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(()=>true);
        try {
        //   setError(null); // Clear any previous errors
          const response = await login({ username, password },dispatch);
          console.log('Login successful:', response.token);
          // Handle successful login (e.g., redirect, store token in state/context)
          navigate('/projects');
            toast.success("Login successful");
        } catch (err: any) {
        //   setError(err.message);
          toast.error("Login failed: Incorrect username or password");
        }
        setLoading(()=>false);
      };
      

  // Handle Google login redirect
  const handleGoogleLogin = async () => {
    setLoading(true);
    await googleLogin();
    // window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // Handle the URL parameters after Google OAuth redirect to `/success`
  // useEffect(() => {
  //   // Check if we're on the success page (i.e., the URL contains a token or error)
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const token = urlParams.get('token');
  //   const error = urlParams.get('error');
    
  //   if (error) {
  //     // If there's an error in the URL params, show an error toast
  //     toast.error("Login failed: " + error);
  //   }

  //   if (token) {
  //     // If we have a token, successful login, redirect to the /projects page
  //     toast.success("Login successful!");
  //     navigate('/projects'); // Navigate to /projects if login is successful
  //   }

  //   setLoading(false); // End the loading state
  // }, [navigate]);


    return (
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <h1 className="text-2xl font-bold">Login</h1>
            </CardHeader>
<Divider/>




            <button
            onClick={handleGoogleLogin}
     
      className="bg-[#2f3138] text-white font-bold flex items-center justify-center hover:bg-[#48494b] px-4 py-2 rounded-lg m-4"
    >
      <img
        src={google}
        alt="Google"
        className="h-5 mr-2"
      />
      Continue with Google
    </button>
    <p className="text-center mb-2">or</p>


       
            <Divider />
            <CardBody>
                <Form
                    className="w-full flex flex-col gap-4"
                    validationBehavior="native"
                   
                    onSubmit={(e) => {
                        e.preventDefault();
                        
                        
                        handleLogin(e);
                    }}
                >
                    <Input
                        isRequired
                        errorMessage="Please enter a valid username"
                        label="Username"
                        labelPlacement="outside"
                        name="username"
                        placeholder="Enter your username"
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        isRequired
                        errorMessage="Please enter a valid password"
                        label="Password"
                        labelPlacement="outside"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex gap-2">
                       {loading?<Spinner className="pl-6"/>: <Button color="primary" type="submit">
                            Submit
                        </Button>}
                        
                    </div>
                    {/* {action && (
                        <div className="text-small text-default-500">
                            Action: <code>{action}</code>
                        </div>
                    )} */}
                </Form>
            </CardBody>
            <Divider />
            <CardFooter>
                <p className="text-center">
                    Don't have an account? <Link href="/register">Register</Link>
                </p>
            </CardFooter>
        </Card>
    );
};

export default LoginPage;
