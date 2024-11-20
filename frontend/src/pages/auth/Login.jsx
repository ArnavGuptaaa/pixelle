/*
    TODO:
    1. Add Toast when register is successful
*/
// Shadcn
import {
	Card,
	CardHeader,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Icons
import { LoaderPinwheel, ShieldAlert, User2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Login = () => {
	const LOGIN_PAGE_ICON_SIZE = 15;

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading, error } = useAuth();

	const handleLogin = async () => {
		const userCredentials = {
			username,
			password,
		};

		console.log(userCredentials);

		await login(userCredentials);
	};

	return (
		<main className="h-screen  light:bg-muted grid place-items-center">
			<Card className="w-full grid h-screen md:w-1/3 md:h-auto">
				<CardHeader>
					<div className="flex justify-start items-center mb-5 mx-auto">
						<h2 className="ml-2 font-pacifico text-4xl">Pixelle</h2>
					</div>
					<CardTitle>Login</CardTitle>
					<CardDescription className="capitalize">
						Welcome Back! Please Sign In
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="text-center">
							<h1 className="text-destructive">{error}</h1>
						</div>
					)}
					<div>
						<div className="flex items-center">
							<User2 size={LOGIN_PAGE_ICON_SIZE} />
							<Label htmlFor="username" className="ml-1">
								Username
							</Label>
						</div>
						<Input
							id="username"
							className="mb-6 mt-1"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<div className="flex items-center">
							<ShieldAlert size={LOGIN_PAGE_ICON_SIZE} />
							<Label htmlFor="password" className="ml-1">
								Password
							</Label>
						</div>
						<Input
							id="password"
							className="mb-6 mt-1"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<Button className="w-full" onClick={handleLogin}>
						{loading && (
							<LoaderPinwheel
								className="animate-spin mr-2"
								size={LOGIN_PAGE_ICON_SIZE}
							/>
						)}
						Login
					</Button>
				</CardContent>
				<CardFooter>
					<div className="mx-auto">
						<CardDescription className="inline">
							Don&apos;t have an account?
						</CardDescription>
						<Link
							className="ml-1 underline text-sm color-secondary"
							to={"/auth/register"}
						>
							Register
						</Link>
					</div>
				</CardFooter>
			</Card>
		</main>
	);
};

export default Login;
