// Pages
import User from "@/pages/app/User";
import Post from "@/pages/app/Post";
import NotFound from "@/pages/NotFound";
import HomeFeed from "@/pages/app/HomeFeed";
import CreatePost from "@/pages/app/CreatePost";
import WanderFeed from "@/pages/app/WanderFeed";
import SearchUsers from "@/pages/app/SearchUsers";

// Layouts
import AppLayout from "@/Layouts/AppLayout";

// Other Imports
import { Routes, Route, Navigate } from "react-router-dom";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<AppLayout />}>
				<Route index element={<HomeFeed />} />

				<Route path="users">
					<Route index element={<SearchUsers />} />
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

				<Route path="wander">
					<Route index element={<WanderFeed />} />
				</Route>

				<Route path="search">
					<Route index element={<SearchUsers />} />
				</Route>

				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
