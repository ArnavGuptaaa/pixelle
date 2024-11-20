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
import { Mail, ShieldAlert, User2, LoaderPinwheel } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Register = () => {
	const REGISTER_PAGE_ICON_SIZE = 15;

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { register, loading, error } = useAuth();

	const handleRegister = async () => {
		const userCredentials = {
			username,
			email,
			password,
		};

		console.log(userCredentials);

		await register(userCredentials);
	};

	return (
		<main className="h-screen  light:bg-muted grid place-items-center">
			<Card className="w-full grid h-screen md:w-1/3 md:h-auto">
				<CardHeader>
					<div className="flex justify-start items-center mb-5 mx-auto">
						<h2 className="ml-2 font-pacifico text-4xl">Pixelle</h2>
					</div>
					<CardTitle>Register</CardTitle>
					<CardDescription className="capitalize">
						Get Started with Your New Account!
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
							<User2 size={REGISTER_PAGE_ICON_SIZE} />
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
							<Mail size={REGISTER_PAGE_ICON_SIZE} />
							<Label htmlFor="email" className="ml-1">
								Email
							</Label>
						</div>
						<Input
							id="email"
							className="mb-6 mt-1"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div>
						<div className="flex items-center">
							<ShieldAlert size={REGISTER_PAGE_ICON_SIZE} />
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

					<Button className="w-full" onClick={handleRegister}>
						{loading && (
							<LoaderPinwheel
								className="animate-spin mr-2"
								size={REGISTER_PAGE_ICON_SIZE}
							/>
						)}
						Register
					</Button>
				</CardContent>
				<CardFooter>
					<div className="mx-auto">
						<CardDescription className="inline">
							Already have an account?
						</CardDescription>
						<Link
							className="ml-1 underline text-sm color-secondary"
							to={"/auth/login"}
						>
							Login
						</Link>
					</div>
				</CardFooter>
			</Card>
		</main>
	);
};

export default Register;
