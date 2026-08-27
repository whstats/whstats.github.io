# Related Notes

`RelatedNotes` is a static Quartz 5 sidebar component that uses the link graph
already produced by `@quartz-community/crawl-links`. It lists published content
pages linking to the current note and published content pages linked from it.

The component excludes self-links, broken links, unlisted pages, and generated
pages without a Markdown source. Canonical slugs take precedence over aliases;
both forms resolve to one canonical list item. The component also deduplicates
simplified `index` slugs and sorts both lists by resolved page title.

```yaml
- source: ./plugins/related-notes
  enabled: true
  order: 65
  layout:
    position: right
    priority: 40
    display: all
```

Optional labels and empty-panel behavior can be configured with `options`:

```yaml
options:
  hideWhenEmpty: false
  title: Related Notes
  incomingLabel: Links to this note
  outgoingLabel: Links from this note
  emptyText: No related notes yet.
```
