import { PageFrame, PageFrameProps } from "./types";
import { QuartzComponent } from "../types";
import HeaderConstructor from "../Header";

const Header = HeaderConstructor();

// Components that belong in a side rail rather than the top bar. The site
// navigation layer tags these instances with a stable displayName because the
// compiled plugin function names are minified.
const RAIL_COMPONENTS = new Set([
  "Explorer",
  "TableOfContents",
  "Graph",
  "Backlinks",
]);

function isRail(component: QuartzComponent): boolean {
  return RAIL_COMPONENTS.has(component.displayName ?? "");
}

/**
 * Top-bar frame: site title, search and toggles run across the top; the
 * `left` slot's rail components (explorer, optionally the table of contents)
 * sit in a left rail; `right` is a right rail. Empty rails collapse through
 * the `empty` class so themes can widen the reading column.
 */
export const TopbarFrame: PageFrame = {
  name: "topbar",
  render({
    componentData,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer: Footer,
  }: PageFrameProps) {
    const bar = left.filter((component) => !isRail(component));
    const leftRail = left.filter(isRail);
    const rightClass =
      right.length === 0 ? "right sidebar empty" : "right sidebar";
    const leftClass =
      leftRail.length === 0 ? "left sidebar empty" : "left sidebar";
    return (
      <>
        <div class="site-topbar">
          <div class="site-topbar-inner">
            {bar.map((BarComponent) => (
              <BarComponent {...componentData} />
            ))}
          </div>
        </div>
        <div class={leftClass}>
          {leftRail.map((BodyComponent) => (
            <BodyComponent {...componentData} />
          ))}
        </div>
        <div class="center">
          <div class="page-header">
            <Header {...componentData}>
              {header.map((HeaderComponent) => (
                <HeaderComponent {...componentData} />
              ))}
            </Header>
            <div class="popover-hint">
              {beforeBody.map((BodyComponent) => (
                <BodyComponent {...componentData} />
              ))}
            </div>
          </div>
          <Content {...componentData} />
          <hr />
          <div class="page-footer">
            {afterBody.map((BodyComponent) => (
              <BodyComponent {...componentData} />
            ))}
          </div>
        </div>
        <div class={rightClass}>
          {right.map((BodyComponent) => (
            <BodyComponent {...componentData} />
          ))}
        </div>
        <Footer {...componentData} />
      </>
    );
  },
};
