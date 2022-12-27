# Testing Without Mocks, Simple Example

This is a simple example of the ideas in James Shore's [Testing Without Mocks](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks) pattern language.


## About the Program

The program is a ROT-13 command-line tool. To use, run `./run.sh "text to convert"` (Mac/Linux) or `run "text to convert"` (Windows). The ROT-13 output will be displayed on the command-line. For example:

```sh
$ ./run.sh "Hello World"
Uryyb Jbeyq
```

## About the Source Code

The code is organized according to [A-Frame Architecture](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#a-frame-arch), which means it has a top-level <em>Application/UI</em> layer which is responsible for the command-line interface. It delegates to an <em>Infrastructure</em> layer to handle command-line arguments and output, and to a <em>Logic</em> layer to handle ROT-13 encoding. The Infrastructure and Logic layers are unaware of each other.

The code is all in the `src/` tree. Other directories are part of the build system and can be ignored.

### Application layer code

* `run.js` - Application entry point; no meaningful code
* `app.js` - `App` class. Reads command-line arguments and writes output.
* `_app_test.js` - Tests for `App`.

### Infrastructure layer code

* `infrastructure/command_line.js` - `CommandLine` class. Infrastructure wrapper for reading command-line arguments and writing to `stdout`.
* `infrastructure/output_tracker.js` - `OutputTracker` class. Generic helper class used to track `CommandLine`'s output.
* `infrastructure/_command_line_test.js` - Tests for `CommandLine`.
* `infrastructure/_output_tracker_test.js` - Tests for `OutputTracker`.
* `infrastructure/_command_line_test_args_runner.js` - Runs in a separate process. Used to test `CommandLine`'s ability to read a process's command-line arguments.
* `infrastructure/_command_line_test_nulled_output_runner.js` - Runs in a separate process. Used to test `CommandLine`'s ability to turn off writes to `stdout`.
* `infrastructure/_command_line_test_output_runner.js` - Runs in a separate process. Used to test `CommandLine`'s ability to write to `stdout`.

### Logic layer code

* `logic/rot13.js` - ROT-13 encoding logic.
* `logic/_rot13_test.js` - Tests for ROT-13 logic.


## About the Patterns

The purpose of this repository is to demonstrate the [Testing Without Mocks patterns](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks). Here are each of the patterns in the article and how they're used in this code:


### Foundational Patterns

#### [Narrow Tests](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#narrow-tests)

All tests are “narrow tests,” which means they’re focused on a specific class, module, or concept. Specifically:

* `_app_test.js` tests the `App` class.
* `_command_line_test.js` tests the `CommandLine` class.
* `_rot13_test.js` tests the `rot13` module.

#### [State-Based Tests](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#state-based-tests)

All tests are “state-based tests,” which means they make assertions about the return values or state of the unit under test, rather than making assertions about which methods it calls. Specifically:

* `_app_test.js` makes assertions about how `App` changes the state of the `CommandLine`, given various command-line arguments.
* `_command_line_test.js` makes assertions about how `CommandLine` reads command-line arguments and writes to `stdout`.
* `_rot13_test.js` makes assertions about what the `transform()` function returns, given various inputs.

#### [Overlapping Sociable Tests](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#sociable-tests)

All tests are “sociable tests,” which means the code under test isn’t isolated from the rest of the application. Specifically:

* `_app_test.js` runs real code in `CommandLine` and `rot13`, which are `App`'s dependencies.

There are no broad integration tests (end-to-end tests), but `_app_test.js` and `_command_line_test.js` overlap to provide the same safety net that broad tests do. The one gap is `run.js`, which could be covered by a smoke test. (But it's so simple it's hard to imagine it breaking.) 

#### [Smoke Tests](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#smoke-tests)

In the interest of clarity, this code doesn't have any smoke tests.


#### [Zero-Impact Instantiation](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#zero-impact)

The program has two classes, `App` and `CommandLine`, and neither of them do any significant work in their constructor.

#### [Parameterless Instantiation](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#instantiation)

Every class can be instantiated without providing any parameters.

#### [Signature Shielding](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#sig-shielding)

The `_app_test.js` and `_command_line_tests.js` tests both have helper methods that set up the test parameters and return multiple results. 

(The `_rot13_test.js` tests don't use Signature Shielding because the function under test is so straightforward.)

#### [Collaborator-Based Isolation](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#isolation)

The first `_app_test.js` test checks `App`'s "happy path" execution, which involves running the ROT-13 encoding function. To prevent changes to the ROT-13 algorithm from breaking that test in the future, the test uses Collaborator-Based Isolation. Specifically, it sets up its expectation by calling `rot13.transform()`.


### Architectural Patterns

#### [A-Frame Architecture](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#a-frame-arch)

The code is arranged in a simple A-Frame architecture. `App` is in the Application/UI layer, `CommandLine` is in the Infrastructure layer, and `rot13` is in the Logic layer. 

#### [Logic Sandwich](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#logic-sandwich)

`App` is implemented with a simple Logic Sandwich that uses the Infrastructure layer to read the input from the command-line arguments, then calls the Logic layer to encode the input, then writes the encoded value to `stdout`.

#### [Traffic Cop](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#traffic-cop)

This program doesn’t receive any events from the outside world, so it doesn't need a Traffic Cop.

#### [Grow Evolutionary Seeds](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#grow-seeds)

The code was built evolutionarily. You can get a sense of how it evolved by looking at the commit history.


### Logic Patterns

#### [Easily-Visible Behavior](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#visible-behavior)

The `rot13` encoding function, `transform()`, is a pure function.

#### [Testable Libraries](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#testable-libraries)

This program doesn’t use any third-party logic libraries.


### Infrastructure Patterns

#### [Infrastructure Wrappers](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#infrastructure-wrappers)

The `CommandLine` class is a wrapper for `process.args` and `process.stdout`.

#### [Narrow Integration Tests](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#narrow-integration-tests)

The Infrastructure Layer tests in `_command_line_test.js` check that `command_line.js` can read real command-line arguments and write to the real `stdout`. They do this by spawning separate processes, which allows the test to control the processes' command-line arguments and observe their output.

#### [Paranoic Telemetry](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#paranoic-telemetry)

This program doesn't call any third-party systems, so it doesn't need Paranoic Telemetry.


### Nullability Patterns

#### [Nullables](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#nullables)

`CommandLine` is a Nullable infrastructure wrapper.

#### [Embedded Stub](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#embedded-stub)

`CommandLine` includes a stub for `process`.

#### [Thin Wrapper](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#thin-wrapper)

The code is written in JavaScript, so Thin Wrappers aren't needed.

#### [Configurable Responses](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#configurable-responses)

`CommandLine.createNull()` allows the command-line arguments to be configured.

#### [Output Tracking](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#output-tracking)

`CommandLine.trackOutput()` allows the command-line output to be tracked. The tracking is implemented by `OutputTracker`.

#### [Behavior Simulation](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#behavior-simulation)

This code doesn’t respond to events from external systems, so Behavior Simulation isn't needed.

#### [Fake It Once You Make It](https://www.jamesshore.com/v2/projects/testing-without-mocks/testing-without-mocks#fake-it)

This code is too simple to have long dependency chains, so Fake It Once You Make It isn't needed.


### Legacy Code Patterns

The code was a green-field project, so the legacy code patterns weren't needed.


### [Nullable Infrastructure](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#nullable-infrastructure)

Calling `CommandLine.createNull()` creates a Null version of CommandLine that operates just like the real thing, except it doesn't actually read or write to the command line. This is used by the Application Layer tests in `_app_test.js`.

### [Embedded Stub](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#embedded-stub)

CommandLine's `createNull()` is implemented with private stubs of `process` and `console`. (Those stubs can be found at the bottom of `command_line.js`.)

### [Configurable Responses](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#configurable-responses)

Calling `CommandLine.createNull("my_response")` will cause it to say that the program's command-line argument is "my_response". This is used by the Application Layer tests in `_app_test.js`.

### [Send State](http://www.jamesshore.com/Blog/Testing-Without-Mocks.html#send-state)

After sending output to the console, you can see what was sent by calling `commandLine.getLastOutput()`. This is used by the Application Layer tests in `_app_test.js`.

