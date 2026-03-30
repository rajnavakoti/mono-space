export { Notes } from "./Notes";
export { Split } from "./Split";
export { Video } from "./Video";
export { CodeBlock } from "./CodeBlock";
export { Animate } from "./Animate";
export { FullBleed } from "./FullBleed";
export { Callout } from "./Callout";
export { TitleCard } from "./TitleCard";
export { EvolutionTimeline } from "./diagrams";
export { PieChart } from "./diagrams";
export { FlowBox, FlowArrow, FlowRow, FlowColumn } from "./diagrams";
export { LifecycleDiagram } from "./diagrams";

import { Notes } from "./Notes";
import { Split } from "./Split";
import { Video } from "./Video";
import { CodeBlock } from "./CodeBlock";
import { Animate } from "./Animate";
import { FullBleed } from "./FullBleed";
import { Callout } from "./Callout";
import { TitleCard } from "./TitleCard";
import { EvolutionTimeline } from "./diagrams";
import { PieChart } from "./diagrams";
import { FlowBox, FlowArrow, FlowRow, FlowColumn } from "./diagrams";
import { LifecycleDiagram } from "./diagrams";

/**
 * Component map passed to compileMDX for MDX slide rendering.
 */
export const mdxSlideComponents = {
  Notes,
  Split,
  Video,
  CodeBlock,
  Animate,
  FullBleed,
  Callout,
  TitleCard,
  EvolutionTimeline,
  PieChart,
  FlowBox,
  FlowArrow,
  FlowRow,
  FlowColumn,
  LifecycleDiagram,
};
