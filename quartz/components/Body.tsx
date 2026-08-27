import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return (
    <>
      <a class="skip-link" href="#quartz-body">
        Skip to content
      </a>
      <main id="quartz-body" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}

export default (() => Body) satisfies QuartzComponentConstructor
