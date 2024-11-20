import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import User from "@/pages/app/User";
import HomeFeed from "@/pages/app/HomeFeed";
import NotFound from "@/pages/NotFound";

// Layouts
import AppLayout from "@/Layouts/AppLayout";

// Pages
import UserSearch from "@/pages/app/UserSearch";
import CreatePost from "@/pages/app/CreatePost";
import Post from "@/pages/app/Post";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<AppLayout />}>
				<Route index element={<HomeFeed />} />

				<Route path="users">
					<Route index element={<UserSearch />} />
					<Route path=":userId" element={<User />} />
				</Route>

				<Route path="posts">
					<Route index element={<Navigate to={"/"} />} />
					<Route path=":postId" element={<Post />} />
					<Route path="create" element={<CreatePost />} />
				</Route>

				{/* Alias for /posts/create */}
				<Route path="create">
					<Route index element={<Navigate to={"/posts/create"} />} />
				</Route>

				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
