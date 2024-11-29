import { useEffect, useState } from "react";
import axios from "axios";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const useFetch = (
	endpoint,
	requestOptions = {},
	dependencies = [],
	fallbackErrorMessage = "Get Request Failed"
) => {
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState();

	const { toast } = useToast();

	useEffect(() => {
		const source = axios.CancelToken.source();
		const url = `${BASE_URL}${endpoint}`;

		const fetchData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axios.get(url, {
					...requestOptions,
					cancelToken: source.token,
				});

				setData(response.data);
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log("Request cancelled");
				} else {
					setError(
						error.response?.data?.message ||
							error.message ||
							fallbackErrorMessage
					);

					toast({
						className: cn("hidden md:block"),
						variant: "destructive",
						title: fallbackErrorMessage,
					});
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();

		// Cleanup
		return () => {
			source.cancel();
		};
	}, [endpoint, ...dependencies]);

	return [data, error, isLoading];
};

export default useFetch;
