// Components
import FeedCard from "@/components/FeedCard";
import FeedSkeleton from "@/components/skeletons/feedSkeleton";

// Hooks
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";

const HomeFeed = () => {
	const [data, error, isLoading] = useFetch(
		"/app/feed",
		{},
		[],
		"Failed to fetch posts"
	);

	const [posts, setPosts] = useState();

	useEffect(() => {
		setPosts(data?.posts);
	}, [data]);

	return (
		<div className="w-full mx-auto md:w-5/6  max-w-screen-xl ">
			<div className="text-center md:text-left">
				<h1 className="text-3xl md:text-5xl font-bold">Home</h1>
				<p className="text-gray-500 capitalize mt-2">
					See the world through the lens of those you follow.
				</p>
			</div>

			{!isLoading && (
				<div className="columns-2 md:columns-3 lg:columns-5 gap-3 mt-5">
					<div>
						{posts &&
							posts.map((post) => (
								<FeedCard post={post} key={post.id} />
							))}
					</div>
				</div>
			)}
			{!posts && <FeedSkeleton count={20} />}
		</div>
	);
};

export default HomeFeed;
