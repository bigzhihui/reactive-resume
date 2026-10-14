import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
// @vitest-environment happy-dom
import { i18n } from "@lingui/core";
import { Turnstile } from "./turnstile";

const renderWidget = vi.fn().mockReturnValue("test-widget");
const removeWidget = vi.fn();
const onToken = vi.fn();

beforeEach(() => {
	vi.clearAllMocks();
	i18n.load("en", {});
	i18n.activate("en");
	window.turnstile = { ready: (callback) => callback(), render: renderWidget, remove: removeWidget };
});
afterEach(() => {
	delete window.turnstile;
});

const options = () => renderWidget.mock.calls.at(-1)?.[1] as Parameters<NonNullable<Window["turnstile"]>["render"]>[1];

it("passes verified tokens to the form and clears them on expiry", async () => {
	render(<Turnstile siteKey="test-site-key" onToken={onToken} resetKey={0} />);
	await waitFor(() => expect(renderWidget).toHaveBeenCalledOnce());
	act(() => options().callback("verified-token"));
	expect(onToken).toHaveBeenLastCalledWith("verified-token");
	act(() => options()["expired-callback"]());
	expect(onToken).toHaveBeenLastCalledWith(null);
});

it("replaces the consumed challenge and ignores callbacks from the old widget", async () => {
	const view = render(<Turnstile siteKey="test-site-key" onToken={onToken} resetKey={0} />);
	await waitFor(() => expect(renderWidget).toHaveBeenCalledOnce());
	const oldOptions = options();
	view.rerender(<Turnstile siteKey="test-site-key" onToken={onToken} resetKey={1} />);
	await waitFor(() => expect(renderWidget).toHaveBeenCalledTimes(2));
	expect(removeWidget).toHaveBeenCalledWith("test-widget");
	onToken.mockClear();
	act(() => oldOptions.callback("stale-token"));
	expect(onToken).not.toHaveBeenCalled();
});

it.each(["error-callback", "timeout-callback"] as const)(
	"clears tokens and allows retry after %s",
	async (callback) => {
		render(<Turnstile siteKey="test-site-key" onToken={onToken} resetKey={0} />);
		await waitFor(() => expect(renderWidget).toHaveBeenCalledOnce());
		act(() => options()[callback]());
		expect(onToken).toHaveBeenLastCalledWith(null);
		expect(screen.getByRole("alert")).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "Retry security check" }));
		await waitFor(() => expect(renderWidget).toHaveBeenCalledTimes(2));
	},
);

it("removes the widget on unmount", async () => {
	const view = render(<Turnstile siteKey="test-site-key" onToken={onToken} resetKey={0} />);
	await waitFor(() => expect(renderWidget).toHaveBeenCalledOnce());
	view.unmount();
	expect(removeWidget).toHaveBeenCalledWith("test-widget");
});
