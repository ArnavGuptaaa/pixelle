/*
TODO:
1. SKELETONS
*/

// Mock Data
// import { posts } from "@/data/feedPosts";

// Components
import FeedCard from "@/components/FeedCard";
import { useEffect, useState } from "react";

// Icons
import { LoaderPinwheel } from "lucide-react";
import useFetch from "@/hooks/useFetch";

const HomeFeed = () => {
	const [data, error, isLoading] = useFetch("/app/feed");

	const [posts, setPosts] = useState();

	useEffect(() => {
		setPosts(data?.posts);
	}, [data]);

	return (
		<div className="w-full mx-auto md:w-5/6  max-w-screen-xl ">
			<div className="text-center md:text-left">
				<h1 className="text-3xl md:text-5xl font-bold">My Feed</h1>
				<p className="text-gray-500 capitalize mt-2">
					Discover content tailored just for you
				</p>
			</div>

			{/* flex flex-wrap justify-evenly items-start gap-y-5 */}
			{posts && (
				<div className="columns-2 md:columns-3 lg:columns-5 gap-3 mt-5">
					<div>
						{posts.map((post) => (
							<FeedCard post={post} key={post.id} />
						))}
					</div>
				</div>
			)}
			{isLoading && (
				<div className=" w-full">
					<LoaderPinwheel
						className="animate-spin mx-auto"
						size={20}
					/>
				</div>
			)}
		</div>
	);
};

export default HomeFeed;
