// ShadCN
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Icons
import { Captions, ImagePlus, LoaderPinwheel } from "lucide-react";

// Hooks
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Services
import { createPostService } from "@/services/AppService";

// Other Imports
import { cn } from "@/lib/utils";

const CreatePost = () => {
	const [preview, setPreview] = useState();
	const [uploadedImage, setUploadedImage] = useState();
	const [caption, setCaption] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const { toast } = useToast();

	const navigate = useNavigate();

	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (!file) {
			setPreview(null);
			return;
		}

		setUploadedImage(file);

		// Create preview for uploaded file
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async () => {
		setError(null);
		setLoading(true);

		const formDataPayload = new FormData();
		formDataPayload.append("image", uploadedImage);
		formDataPayload.append("caption", caption);

		try {
			await createPostService(formDataPayload);

			toast({
				className: cn("hidden md:block"),
				variant: "success",
				title: "Post Successfully Created",
			});

			navigate("/");
		} catch (error) {
			console.log(error);

			setError(error.message);
		} finally {
			setLoading(false);

			setPreview();
			setUploadedImage();
			setCaption("");
		}
	};

	return (
		<div className="md:w-5/6 mx-auto">
			<div className="text-center md:text-left">
				<h1 className="text-3xl md:text-5xl font-bold">Create Post</h1>
				<p className="capitalize text-gray-500 mt-2">
					What&apos;s on your mind? Share your moments with friends.
				</p>
			</div>

			<div className="flex flex-col-reverse md:flex-row justify-between items-center w-full mt-10">
				<div className="left flex-1 mr-5">
					{error && (
						<div className="text-center">
							<h1 className="text-destructive">{error}</h1>
						</div>
					)}
					<div>
						<div className="flex items-center">
							<ImagePlus size={15} />
							<Label htmlFor="image" className="ml-1">
								Image
							</Label>
						</div>
						<Input
							id="image"
							className="mb-6 mt-1"
							type="file"
							onChange={handleFileChange}
							accept="image/*"
						/>
					</div>

					<div>
						<div className="flex items-center">
							<Captions size={15} />
							<Label htmlFor="caption" className="ml-1">
								Caption
							</Label>
						</div>
						<Input
							id="caption"
							className="mb-6 mt-1"
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							type="text"
							autoComplete="off"
						/>
						<Button className="w-full" onClick={handleSubmit}>
							{loading && (
								<LoaderPinwheel
									className="animate-spin mr-2"
									size={15}
								/>
							)}
							Post!
						</Button>
					</div>
				</div>
				<hr className="my-5 md:hidden" />
				<div className="right w-1/2">
					{preview && (
						<img
							className="w-full max-h-60 object-contain"
							src={preview}
							alt="preview"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default CreatePost;
