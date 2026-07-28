# @jasminejs/reporters

This package contains the console reporter used by the `jasmine` and 
`jasmine-browser-runner` packages. Other reporters may be added in the future.

## Usage

If you're using `jasmine` or `jasmine-browser-runner`, you don't need to do
anything. `ConsoleReporter` will automatically be set up. To use it without
either of those packages:

```javascript
import ConsoleReporter from '@jasminejs/reporters/console';

const reporter = new ConsoleReporter();
jasmine.getEnv().addReporter(reporter);
```

## Node version compatibility

20, 22, 24

Copyright (c) 2011-2019 Pivotal Labs<br>
Copyright (c) 2011-2025 The Jasmine developers<br>
This software is licensed under the MIT License.