# Track click script

The gem includes a script that allows tracking to be added to clicked elements with relative ease. It depends upon the main analytics code to function.

## Basic use

```html
<a href="/link"
  data-module="gem-track-click"
  data-track-category="category"
  data-track-action="action"
  data-track-label="Foo">
  Link
</a>
```

**NOTE:**  According to [Google Analytics Help](https://support.google.com/analytics/answer/1033068), event label is optional, but recommended.

## Advanced use

Adds a custom dimension of `dimension29` with a value of `dimension-value`, and a `value` of `9`.

```html
<a href="/link"
  data-module="gem-track-click"
  data-track-category="category"
  data-track-action="action"
  data-track-label="label"
  data-track-dimension="dimension-value"
  data-track-dimension-index="29"
  data-track-value="9">
  Link
</a>
```

## Track with arbitrary JSON

```html
<a href='/link'
  data-module='gem-track-click'
  data-track-category='category'
  data-track-action='1'
  data-track-label='/'
  data-track-options='{"dimension28": "foo", "dimension29": "bar"}'>
  Link
</a>
```

## Track more than one element

Specific tracking can be applied to multiple elements within a container, by applying the data module once to the parent element.

```html
<div data-module="gem-track-click">
  <p>This element has no tracking.</p>
  <a href="/link1"
    data-track-category="cat1"
    data-track-action="action1"
    data-track-label="label1">
    This link has tracking
  </a>
  <div>
    <a href="/link2"
      data-track-category="cat2"
      data-track-action="action2"
      data-track-label="label2">
      This link also has tracking
    </a>
  </div>
</div>
```

## Track links within content

Where tracking attributes cannot be applied to elements, links can be tracked with the link href as the tracking label (and other attributes set on the parent). The `data-track-links-only` attribute ensures that only link clicks are tracked (without it, any click inside the element is tracked). This is helpful where page content is not editable, e.g. content comes from the content item or a publishing tool.

```html
<div data-module="gem-track-click"
  data-track-category="category"
  data-track-action="action"
  data-track-links-only>
  <a class="first" href="/link1">Link 1</a>
  <a class="second" href="/link2">Link 2</a>
</div>
```

## Track links within content within a specific element

To apply tracking to links within a specific element within part of a page, use the `data-limit-to-element-class` attribute. This is helpful where page content is not editable, e.g. content comes from the content item or a publishing tool.

```html
<div data-module="gem-track-click"
  data-track-category="category"
  data-track-action="action"
  data-track-links-only
  data-limit-to-element-class="demoBox">
  <a class="first" href="/link1">This link will not be tracked</a>
  <div class="demoBox">
    <a class="second" href="/link2">This link will be tracked</a>
  </div>
</div>
```
