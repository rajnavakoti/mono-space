export { Notes } from "./Notes";
export { Split } from "./Split";
export { Video } from "./Video";
export { CodeBlock } from "./CodeBlock";
export { Animate } from "./Animate";
export { FullBleed } from "./FullBleed";
export { Callout } from "./Callout";

import { Notes } from "./Notes";
import { Split } from "./Split";
import { Video } from "./Video";
import { CodeBlock } from "./CodeBlock";
import { Animate } from "./Animate";
import { FullBleed } from "./FullBleed";
import { Callout } from "./Callout";

/**
 * Component map passed to compileMDX for MDX slide rendering.
 * Custom components are available as JSX tags in MDX content.
 */
export const mdxSlideComponents = {
  Notes,
  Split,
  Video,
  CodeBlock,
  Animate,
  FullBleed,
  Callout,
};
