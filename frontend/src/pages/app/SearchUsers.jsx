// ShadCN
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Hooks
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Icons
import { Search } from "lucide-react";

// Components
import SearchResultCard from "@/components/SearchResultCard";

// Services
import { getSearchResults } from "@/services/AppService";

const SearchUsers = () => {
	const [searchText, setSearchText] = useState("");
	const [results, setResults] = useState();

	const { toast } = useToast();

	const handleSearchSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await getSearchResults(searchText);

			setResults(response?.results);
		} catch (error) {
			toast({
				className: cn("hidden md:block"),
				variant: "destructive",
				title: "Something went wrong",
			});
		}
	};

	return (
		<div className="w-full p-2 md:p-0 h-screen max-w-screen-xl mx-auto md:w-5/6">
			<form onSubmit={handleSearchSubmit}>
				<Label htmlFor="search-input" className="ml-1">
					Username
				</Label>
				<div className="flex items-center justify-center">
					<Input
						id="search-input"
						className=""
						type="text"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<Button type="submit" className="ml-3">
						<Search />
					</Button>
				</div>
			</form>

			{/* Search Results */}
			{results && (
				<div>
					<h2 className="mt-5">Results</h2>
					<div className="mt-5">
						{results.map((res) => (
							<SearchResultCard user={res} key={res.id} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchUsers;
