import { Skeleton } from "@/components/ui/skeleton";

const FeedSkeleton = ({ count }) => {
	const skeletonSize = Array(count).fill(0);

	return (
		<div className="w-full">
			<div className="columns-2 md:columns-3 lg:columns-5 gap-3 mt-5">
				<div>
					{skeletonSize.map((_, index) => {
						const h = Math.floor(Math.random() * (20 - 10) + 10);

						return (
							<Skeleton
								key={index}
								style={{
									height: `${h}rem`,
								}}
								className="rounded-xl overflow-hidden mb-3"
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default FeedSkeleton;
