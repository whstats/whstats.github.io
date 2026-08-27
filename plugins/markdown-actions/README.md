# Markdown Actions

This local Quartz 5 plugin adds a compact menu with **Copy Markdown** and
**Download .md** actions. It emits byte-for-byte copies of source files only
from Quartz's already-filtered published content set. Drafts, ignored paths,
virtual pages, and symlinks escaping the content directory are not emitted.

Add the plugin to `quartz.config.yaml`:

```yaml
- source: ./plugins/markdown-actions
  enabled: true
  order: 90
  layout:
    position: beforeBody
    priority: 25
    display: all
```

Published source assets are written under `static/markdown/`. Relative URLs
keep the actions compatible with root deployments, subpath deployments, SPA
navigation, and ordinary static file hosts.
