import { UserForm } from "@/app/(admin)/admin/_components/user-form";

export default function Page() {
	return (
		<UserForm
			defaultValues={{
				mode: "signIn",
				email: "",
				password: "",
			}}
		/>
	);
}
