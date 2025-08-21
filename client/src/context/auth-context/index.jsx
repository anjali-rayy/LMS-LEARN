import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function handleRegisterUser(event) {
        event.preventDefault();
        
        try {
            console.log('Registering user with data:', signUpFormData);
            const data = await registerService(signUpFormData);
            
            if (data.success) {
                console.log('Registration successful:', data);
                
                // Auto-login after successful registration
                const loginData = {
                    userEmail: signUpFormData.userEmail,
                    password: signUpFormData.password
                };
                
                console.log('Auto-logging in with:', loginData);
                const loginResponse = await loginService(loginData);
                
                if (loginResponse.success) {
                    sessionStorage.setItem(
                        "accessToken",
                        JSON.stringify(loginResponse.data.accessToken)
                    );
                    
                    const userData = loginResponse.data.user;
                    console.log('Auto-login successful! User data:', userData);
                    
                    setAuth({
                        authenticate: true,
                        user: userData,
                    });
                    
                    // Reset form
                    setSignUpFormData(initialSignUpFormData);
                    
                    // Role-based redirect after auto-login
                    setTimeout(() => {
                        if (userData.role === "instructor") {
                            console.log("New instructor user, navigating to /instructor");
                            navigate("/instructor");
                        } else {
                            console.log("New student user, navigating to /");
                            navigate("/");
                        }
                    }, 100);
                    
                } else {
                    alert('Registration successful but auto-login failed. Please sign in manually.');
                }
                
            } else {
                console.error('Registration failed:', data.message);
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            console.error('Registration error:', errorMessage);
            alert(`Registration error: ${errorMessage}`);
        }
    }

    async function handleLoginUser(event) {
        event.preventDefault();
        
        console.log('Attempting login with:', signInFormData);
        
        try {
            const data = await loginService(signInFormData);
            console.log('Full login response:', data);

            if (data.success) {
                sessionStorage.setItem(
                    "accessToken",
                    JSON.stringify(data.data.accessToken)
                );
                
                const userData = data.data.user;
                console.log('User data from response:', userData);
                console.log('User role:', userData.role);
                
                setAuth({
                    authenticate: true,
                    user: userData,
                });
                
                console.log('Login successful! User data:', userData);
                
                // Role-based redirect after successful login
                setTimeout(() => {
                    if (userData.role === "instructor") {
                        console.log("User is instructor, navigating to /instructor");
                        navigate("/instructor");
                    } else {
                        console.log("User is student, navigating to /");
                        navigate("/");
                    }
                }, 100); // Small delay to ensure state is updated
                
            } else {
                console.error('Login failed with response:', data);
                setAuth({
                    authenticate: false,
                    user: null,
                });
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || error.message;
            console.error('Login error:', errorMessage);
            alert(`Login error: ${errorMessage}`);
            setAuth({
                authenticate: false,
                user: null,
            });
        }
    }

    // Check auth user
    async function checkAuthUser() {
        try {
            const data = await checkAuthService();
            if (data.success) {
                setAuth({
                    authenticate: true,
                    user: data.data.user,
                });
            } else {
                setAuth({
                    authenticate: false,
                    user: null,
                });
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setAuth({
                authenticate: false,
                user: null,
            });
        } finally {
            setLoading(false);
        }
    }

    function resetCredentials() {
        setAuth({
            authenticate: false,
            user: null,
        });
        // Clear session storage
        sessionStorage.removeItem("accessToken");
        // Redirect to auth page
        navigate("/auth");
    }

    useEffect(() => {
        checkAuthUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                signInFormData,
                setSignInFormData,
                signUpFormData,
                setSignUpFormData,
                handleRegisterUser,
                handleLoginUser,
                auth,
                resetCredentials,
            }}
        >
            {loading ? <Skeleton /> : children}
        </AuthContext.Provider>
    );
}