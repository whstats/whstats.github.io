import { cloneElement, h } from "preact"
import { Focus } from "lucide-preact"
import { ReaderMode as QuartzReaderMode } from "@quartz-community/reader-mode/components"
import { inheritComponentResources, lucideProps } from "../../_shared/lucide.js"

const iconCss = `
.readermode > .readerIcon {
  fill: none;
  stroke: var(--darkgray);
}
`

export function ReaderMode() {
  const BaseReaderMode = QuartzReaderMode()

  const Component = (props) => {
    const button = BaseReaderMode(props)
    return cloneElement(
      button,
      { "aria-keyshortcuts": "h" },
      h(Focus, lucideProps(20, "readerIcon")),
    )
  }

  Component.displayName = "ReaderMode"
  return inheritComponentResources(Component, BaseReaderMode, iconCss)
}

export default ReaderMode
