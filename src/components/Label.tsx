import { LabelHTMLAttributes } from "react";

export default function Label({
	title,
	htmlFor,
	children,
	...args
}: LabelHTMLAttributes<HTMLLabelElement> & {
	title: string;
	htmlFor?: string;
}) {
	return (
		<label className='label' htmlFor={htmlFor} {...args}>
			{title}
			{children}
		</label>
	);
}

