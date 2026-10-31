import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Seo from '../components/Seo';
import Text from "@/components/custom-ui/text";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector, setUser, addToast, UserRole } from "@/redux";
import { ShieldAlert, UserCheck } from "lucide-react";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
});

type Inputs = z.infer<typeof schema>;

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const handleQuickLogin = (role: 'ADMIN' | 'USER') => {
        const isMockAdmin = role === 'ADMIN';
        dispatch(setUser({
            user: {
                id: isMockAdmin ? 'admin_01' : 'user_01',
                name: isMockAdmin ? 'Super Admin' : 'Demo User',
                email: isMockAdmin ? 'admin@saasify.dev' : 'user@saasify.dev',
                role: isMockAdmin ? UserRole.ADMIN : UserRole.USER,
            },
            accessToken: `demo_token_${role.toLowerCase()}`,
            refreshToken: `demo_refresh_${role.toLowerCase()}`,
        }));

        dispatch(addToast({
            type: 'success',
            message: `Logged in as ${role}! Redirecting...`,
        }));

        navigate(isMockAdmin ? '/admin' : '/dashboard');
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const isAdmin = data.email.toLowerCase().includes('admin');
        dispatch(setUser({
            user: {
                id: isAdmin ? 'admin_01' : 'user_01',
                name: isAdmin ? 'Administrator' : data.email.split('@')[0],
                email: data.email,
                role: isAdmin ? UserRole.ADMIN : UserRole.USER,
            },
            accessToken: 'mock_jwt_token',
            refreshToken: 'mock_refresh_token',
        }));

        dispatch(addToast({
            type: 'success',
            message: `Successfully logged in as ${isAdmin ? 'Admin' : 'User'}!`,
        }));

        navigate(isAdmin ? '/admin' : '/dashboard');
    };

    return (
        <>
            <Seo title="Login | SaaSify" description="Login to your SaaSify account." />
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-full md:flex md:min-h-screen">
                    {/* Left side - Text content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden md:flex md:w-1/2 bg-primary/5 items-center justify-center p-8"
                    >
                        <div className="max-w-md text-center">
                            <Text label="SaaSify" className="text-4xl font-bold text-primary mb-6" />
                            <h2 className="text-3xl font-semibold text-foreground mb-4">
                                Welcome back to SaaSify
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Your all-in-one solution for managing your business. Sign in to access your dashboard and continue your journey.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right side - Login form */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8"
                    >
                        <div className="w-full max-w-md">
                            <div className="text-center mb-8 md:hidden">
                                <Link to="/">
                                    <Text label="SaaSify" className="text-3xl font-bold text-primary mb-2" />
                                </Link>
                                <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
                                <p className="text-muted-foreground mt-2">Sign in to your account</p>
                            </div>

                            <div className="bg-card rounded-lg shadow-lg p-8">
                                {/* ⚡ Instant Demo Access Buttons */}
                                <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                                    <div className="text-xs font-semibold text-primary uppercase tracking-wider text-center">
                                        ⚡ Quick Demo Access (1-Click Login)
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleQuickLogin('USER')}
                                            className="flex items-center justify-center gap-1.5 text-xs py-2 bg-background hover:bg-accent border-primary/30"
                                        >
                                            <UserCheck className="h-3.5 w-3.5 text-primary" /> User Dashboard
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleQuickLogin('ADMIN')}
                                            className="flex items-center justify-center gap-1.5 text-xs py-2 border-red-500/30 text-red-500 bg-background hover:bg-red-500/10"
                                        >
                                            <ShieldAlert className="h-3.5 w-3.5" /> Admin Dashboard
                                        </Button>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                                Email address
                                            </label>
                                            <div className="relative">
                                                <Input 
                                                    id="email"
                                                    className={cn(
                                                        "w-full transition-all duration-200",
                                                        errors.email 
                                                            ? "border-destructive focus-visible:ring-destructive pr-10" 
                                                            : "focus-visible:ring-primary"
                                                    )} 
                                                    placeholder="Enter your email (e.g. admin@test.com)" 
                                                    type="email" 
                                                    {...register('email')} 
                                                />
                                            </div>
                                            {errors.email && (
                                                <motion.p 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-destructive text-sm mt-1.5"
                                                >
                                                    Please enter a valid email address
                                                </motion.p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Input 
                                                    id="password"
                                                    className={cn(
                                                        "w-full transition-all duration-200",
                                                        errors.password 
                                                            ? "border-destructive focus-visible:ring-destructive pr-10" 
                                                            : "focus-visible:ring-primary"
                                                    )} 
                                                    placeholder="Enter your password" 
                                                    type="password" 
                                                    {...register("password")} 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing in...' : 'Sign in'}
                                    </Button>
                                </form>

                                <p className="mt-6 text-center text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
                                        Sign up now
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
