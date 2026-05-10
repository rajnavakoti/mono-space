import { render, screen, fireEvent } from "@testing-library/react";
import { YouTubeEmbed } from "./YouTubeEmbed";

describe("YouTubeEmbed", () => {
  const props = {
    videoId: "_QAVExf_1uw",
    title: "Demand-Driven Context Workshop",
  };

  it("renders a play button with the video title initially", () => {
    render(<YouTubeEmbed {...props} />);
    const button = screen.getByRole("button", {
      name: /play video: demand-driven context workshop/i,
    });
    expect(button).toBeInTheDocument();
    expect(screen.queryByTitle(props.title)).not.toBeInTheDocument();
  });

  it("uses the YouTube hqdefault thumbnail for the video id", () => {
    const { container } = render(<YouTubeEmbed {...props} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img!.getAttribute("src")).toContain(`/${props.videoId}/`);
  });

  it("loads the embed iframe only after the play button is clicked", () => {
    render(<YouTubeEmbed {...props} />);
    expect(document.querySelector("iframe")).toBeNull();

    fireEvent.click(
      screen.getByRole("button", {
        name: /play video: demand-driven context workshop/i,
      })
    );

    const iframe = document.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute("src")).toContain(`/embed/${props.videoId}`);
    expect(iframe!.getAttribute("title")).toBe(props.title);
    expect(iframe!.getAttribute("allowFullScreen")).not.toBeNull();
  });

  it("renders a caption when provided", () => {
    render(<YouTubeEmbed {...props} caption="AI.engineer Europe 2026" />);
    expect(screen.getByText("AI.engineer Europe 2026")).toBeInTheDocument();
  });
});
