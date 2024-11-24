import { Skeleton } from "@/components/ui/skeleton";

const UserSkelton = () => {
	return (
		<div className="h-1/4 w-full justify-center md:justify-start items-center flex">
			<div className="justify-center md:justify-start items-center">
				<Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-full" />
			</div>
			<div className="ml-5">
				<Skeleton className="w-40 h-10" />
				<Skeleton className="w-10 h-8 mt-2" />
			</div>
		</div>
	);
};

export default UserSkelton;
