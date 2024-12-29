
import {Card, CardHeader, CardBody, CardFooter, Divider, Link,
    //  Image
    } from "@nextui-org/react";
import {Form, Input, Button} from "@nextui-org/react";
import { useState } from "react";
import { registerUser } from "../apis/user";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/react";
import google from "../assets/google.png";
import { googleLogin } from "../apis/auth";
// import { set } from "lodash";

const RegisterPage:React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);


    const handleRegister = async () => {
        setLoading(()=>true);
        try {
            const result = await registerUser(name, username, password, bio);
            console.log(result);
            // alert("Registration successful! Please login to continue.");
            toast.success("Registration successful! Please login to continue.");
            navigate('/login');
            
        } catch (error) {
            // alert("Registration failed! Please try again.");
            toast.error("Registration failed: " + (error as any).message);
        }
        setLoading(()=>false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        await googleLogin();
        // window.location.href = "http://localhost:8080/oauth2/authorization/google";
      };



    return(
        <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
            <h1 className="text-2xl font-bold">Register</h1>
        </CardHeader>
        <Divider />


        <button
        onClick={handleGoogleLogin}
     
      className="bg-[#2f3138] text-white font-bold flex items-center justify-center hover:bg-[#48494b] px-4 py-2 rounded-lg m-2"
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
                    
                    
                    handleRegister();
                                    }}
                                >
                                    <Input
                                        isRequired
                                        errorMessage="Please enter your name"
                                        label="Name"
                                        labelPlacement="outside"
                                        name="name"
                                        placeholder="Enter your name"
                                        type="text"
                                        onChange={(e) => setName(e.target.value)}
                                    />
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
                                    <Input
                                        label="Bio"
                                        labelPlacement="outside"
                                        name="bio"
                                        placeholder="Tell us about yourself"
                                        type="text"
                                        onChange={(e) => setBio(e.target.value)}
                                    />  <div className="flex gap-2">
                   
                    {loading?<Spinner className="pl-6"/>:<Button color="primary" type="submit">
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
                Already have an account? <Link href="/login">Sign in</Link>
            </p>
        </CardFooter>
    </Card>
    )
}

export default RegisterPage;