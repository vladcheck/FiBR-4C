import clsx from "clsx";
import { HTMLAttributes } from "react";

export default function Button({
	children,
	className,
	type = "button",
	...args
}: HTMLAttributes<HTMLButtonElement> & {
	type?: "button" | "submit" | "reset";
}) {
	return (
		<button type={type} className={clsx("btn", className)} {...args}>
			{children}
		</button>
	);
}

