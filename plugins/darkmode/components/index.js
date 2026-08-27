import { cloneElement, h } from "preact"
import { Moon, Sun } from "lucide-preact"
import { Darkmode as QuartzDarkmode } from "@quartz-community/darkmode/components"
import { inheritComponentResources, lucideProps } from "../../_shared/lucide.js"

const iconCss = `
.darkmode > .lucide {
  fill: none;
  stroke: var(--darkgray);
}
`

export function Darkmode() {
  const BaseDarkmode = QuartzDarkmode()

  const Component = (props) => {
    const button = BaseDarkmode(props)
    return cloneElement(
      button,
      { "aria-keyshortcuts": "n" },
      h(Sun, lucideProps(20, "dayIcon")),
      h(Moon, lucideProps(20, "nightIcon")),
    )
  }

  Component.displayName = "Darkmode"
  return inheritComponentResources(Component, BaseDarkmode, iconCss)
}

export default Darkmode
