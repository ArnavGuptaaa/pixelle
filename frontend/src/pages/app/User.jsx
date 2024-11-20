import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";

// Mock Data
import { posts } from "@/data/feedPosts";

// Components
import FeedCard from "@/components/FeedCard";

// Icons
import { Users, UserPlus, UserMinus } from "lucide-react";

// ShadCN
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { followUser, unFollowUser } from "@/services/AppService";
import { useAuth } from "@/hooks/useAuth";

import useFetch from "@/hooks/useFetch";

const User = () => {
	const USER_PAGE_ICON_SIZE = 15;

	const { userId } = useParams();

	const [isFollowed, setIsFollowed] = useState(false);
	const [posts, setPosts] = useState();
	const [profileUser, setProfileUser] = useState();

	const { user } = useAuth();

	const [data, error, isLoading] = useFetch(
		`/app/users/${userId}`,
		{},
		[userId],
		"Failed to fetch profile"
	);

	useEffect(() => {
		setProfileUser(data?.user);
		setPosts(data?.posts);
		setIsFollowed(data?.isFollowed);
	}, [data]);

	const handleFollow = async (userFollowed) => {
		setIsFollowed(userFollowed);

		// Local optimistic updates
		setProfileUser((prevData) => {
			if (userFollowed)
				return { ...prevData, followCount: prevData.followCount + 1 };
			else return { ...prevData, followCount: prevData.followCount - 1 };
		});

		const payload = {
			followingId: userId,
		};

		try {
			if (userFollowed) {
				await followUser(payload);
			} else {
				await unFollowUser(payload);
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div className="w-full md:flex flex-col h-screen max-w-screen-xl mx-auto md:w-5/6">
			{/* User Info */}
			{profileUser && (
				<div className="h-1/4 w-full justify-center md:justify-start items-center flex">
					<Avatar className="w-24 h-24 md:w-28 md:h-28">
						<AvatarImage src={profileUser.avatarUrl} />
						<AvatarFallback>
							{profileUser.username[0]?.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className=" font-mono ml-5">
						<span className="font-bold text-3xl md:text-5xl">
							@{profileUser.username}
						</span>
						<div className="mt-2 flex items-center">
							<div className="flex items-center ">
								<Users
									className="mr-2 "
									size={USER_PAGE_ICON_SIZE}
								/>
								{profileUser.followCount}
							</div>
							{user && user.id != userId ? (
								isFollowed ? (
									<Button
										className="ml-3 flex items-center text-primary hover:bg-red-200 bg-muted"
										onClick={() => handleFollow(false)}
									>
										<UserMinus
											className="mr-2 "
											size={USER_PAGE_ICON_SIZE}
										/>
										Unfollow
									</Button>
								) : (
									<Button
										className="ml-3 flex items-center text-primary hover:bg-green-200 bg-muted"
										onClick={() => handleFollow(true)}
									>
										<UserPlus
											className="mr-2 "
											size={USER_PAGE_ICON_SIZE}
										/>
										Follow
									</Button>
								)
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
			)}

			<hr className="my-3" />
			{/* Images */}
			<div className="mt-5 mx-auto w-full">
				<h1 className="font-bold text-3xl text-center md:text-left">
					Posts
				</h1>

				<div className="mt-5 columns-2 md:columns-3 lg:columns-5 gap-3">
					{/* flex flex-wrap justify-evenly items-start gap-y-5 */}
					{posts && (
						<div>
							{posts.map((post) => (
								<FeedCard post={post} key={post.id} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default User;
