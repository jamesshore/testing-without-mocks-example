# Testing Without Mocks Example

This project demonstrates the ideas in James Shore's [Testing Without Mocks](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html) pattern language.


## About the Program

The program is a simple ROT-13 command-line tool. To use, run `node src/run.js "text to convert"`. The ROT-13 output will be displayed on the command-line. For example:

```sh
$ node src/run.js "Hello World"
Uryyb Jbeyq
```

The program consists of three files, all in the `src` directory:

* `run.js` - application entry point; no meaningful code
* `app.js` - Application Layer code that coordinates between command-line infrastructure and ROT-13 logic.
* `command_line.js` Infrastructure Layer code that wraps command-line variables (`process.argv`)and output (`console.log`).


## About the Patterns

The purpose of this program is to demonstrate the [Testing Without Mocks](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html) ideas. The following patterns are present:

### [Overlapping Sociable Tests](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#sociable-tests)

The code is tested entirely with narrow tests that each test a subset of the application.

* `_app_test.js` tests the Application Layer code and the way it uses the command-line infrastructure, but it doesn't test the command-line infrastructure itself (`process` and `console`). It uses Nullable Infrastructure, Configurable Responses, and Send State to do this (see below).
* `_command_line_test.js` tests the Infrastructure Layer code and the way it uses `process` and `console`. It uses Focused Integration Tests to do this (see below). 

There are no broad integration tests (end-to-end tests), but `_app_test.js` and `_command_line_test.js` overlap to provide the same safety net that broad tests do. The one gap is `run.js`, which could be covered by a smoke test. (But it's so simple it's hard to imagine it breaking.) 

### [A-Frame Architecture](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#a-frame-arch)

The code is too simple to have a proper A-Frame architecture, but it's simulated by putting the rot13 logic in a separate function.

### [Logic Sandwich](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#logic-sandwich)

The Application Layer code (`app.js`) coordinates logic and infrastructure by reading from infrastructure, passing the data to the logic function, and then writing to infrastructure.

### [Grow Evolutionary Seeds](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#grow-seeds)

The application was built using evolutionary design, starting with a single file. (See the commit history.)

### [Zero-Impact Instantiation](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#zero-impact)

Object constructors don't do any significant work.

### [Infrastructure Wrappers](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#infrastructure-wrappers)

Command-line infrastructure is wrapped by `command_line.js`.

### [Focused Integration Tests](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#focused-integration-tests)

The Infrastructure Layer tests in `_command_line_test.js` check that `command_line.js` actually integrates properly with `process` and `console`.

### [Nullable Infrastructure](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#nullable-infrastructure)

Calling `CommandLine.createNull()` creates a Null version of CommandLine that operates just like the real thing, except it doesn't actually read or write to the command line. This is used by the Application Layer tests in `_app_test.js`.

### [Embedded Stub](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#embedded-stub)

CommandLine's `createNull()` is implemented with private stubs of `process` and `console`. (Those stubs can be found at the bottom of `command_line.js`.)

### [Configurable Responses](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#configurable-responses)

Calling `CommandLine.createNull("my_response")` will cause it to say that the program's command-line argument is "my_response". This is used by the Application Layer tests in `_app_test.js`.

### [Send State](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#send-state)

After sending output to the console, you can see what was sent by calling `commandLine.getLastOutput()`. This is used by the Application Layer tests in `_app_test.js`.

