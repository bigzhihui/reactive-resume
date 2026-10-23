import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
	it("preserves native submit types and omits button type from rendered anchors", () => {
		const { rerender } = render(<Button type="submit">Save</Button>);
		expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "submit");
		rerender(
			<Button nativeButton={false} render={<a href="/docs" />}>
				Docs
			</Button>,
		);
		const anchor = screen.getByText("Docs").closest("a");
		expect(anchor).toHaveAttribute("href", "/docs");
		expect(anchor).not.toHaveAttribute("type");
	});

	it("shows a spinner, sets aria-busy and ignores clicks while loading", async () => {
		const onClick = vi.fn();
		render(
			<Button loading onClick={onClick}>
				Preparing…
			</Button>,
		);
		const button = screen.getByRole("button", { name: "Preparing…" });
		expect(button).toHaveAttribute("aria-busy", "true");
		expect(button.querySelector('[data-slot="spinner"]')).toHaveAttribute("aria-hidden", "true");
		await userEvent.click(button);
		expect(onClick).not.toHaveBeenCalled();
	});
});
