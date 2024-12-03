import { useNotifications } from "@/hooks/useNotifications";
import Notification from "./Notification";

const NotificationFeed = () => {
	const { notifications } = useNotifications();

	return (
		<div>
			{notifications.length > 0 ? (
				<div>
					{notifications.map((notif, index) => (
						<Notification notification={notif} key={index} />
					))}
				</div>
			) : (
				<div className="flex items-center p-2 mb-2">
					<h1>Nothing to see here</h1>
				</div>
			)}
		</div>
	);
};

export default NotificationFeed;
