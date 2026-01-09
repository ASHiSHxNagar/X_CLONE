import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
	const queryClient = useQueryClient();

	const { mutate: follow, isPending } = useMutation({
		mutationFn: async (userId) => {
			try {
				const res = await fetch(`/api/users/follow/${userId}`, {
					method: "POST",
				});

				let data;
				const contentType = res.headers.get("content-type") || "";
				if (contentType.includes("application/json")) {
					data = await res.json();
				} else {
					const text = await res.text();
					throw new Error("Unexpected response format: " + text.slice(0, 60) + "...");
				}
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, isPending };
};

export default useFollow;
