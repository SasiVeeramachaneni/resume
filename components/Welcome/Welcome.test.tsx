import { render, screen } from "@/test-utils";
import { Welcome } from "./Welcome";

describe("Welcome component", () => {
  it("links to the Mantine + Vite (React Router) guide", () => {
    render(<Welcome />);
    expect(screen.getByText("this guide")).toHaveAttribute(
      "href",
      "https://mantine.dev/guides/vite/",
    );
  });

  it("mentions React Router routing and the app/router.tsx entrypoint", () => {
    const { container } = render(<Welcome />);
    const text = container.textContent || "";
    expect(text).toMatch(/React Router/);
    expect(text).toMatch(/app\/router\.tsx/);
  });
});
