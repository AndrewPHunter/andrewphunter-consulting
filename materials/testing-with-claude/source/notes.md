# Testing with Claude: presenter notes

## Testing with Claude

Claude can produce a test for every function, then produce another set when we ask it to review what it wrote. That can look like progress while making the code harder to change. Each assertion becomes another thing the next implementation has to satisfy, whether or not anyone depends on it.

The testing strategy in my project instructions is deliberately selective. A test has to protect a named contract and catch a change that isn't already caught elsewhere. Tests for private structure, pass-throughs, and incidental configuration don't get added just because the agent can generate them.

That is what this presentation is about: deciding which tests not to write, recognizing the ones that have made the code brittle, and having Claude remove or narrow them. The source excerpts preserve the wording in my files, with [...] marking omissions. Code examples and prompts are labeled illustrations.

## Every generated test becomes maintenance work

A test can preserve a useful behavior, or it can preserve the way we happened to implement that behavior today. Both kinds can pass. The difference shows up later, when we need to change the code.

I've had agent work arrive with nearly as many test lines as implementation lines. Tests were organized around functions, repeated expensive setup, and checked details no caller read. Review kept adding more. Counting those tests as evidence of quality missed the work we were committing ourselves to maintain.

A test for a private helper creates pressure to keep that helper. A mock that dictates the call sequence constrains the algorithm. A fixture built again for every case makes every local change slower to check. Those costs accumulate even when the tests never catch another meaningful failure.

I want to examine what each test buys before accepting that obligation. Generating it quickly doesn't make maintaining it free.

## A test has to earn its place

Before a test is written or kept, I want to know which public contract it protects and what change this scenario alone would catch. Both questions matter. A test can refer to a real contract and still duplicate another scenario that already protects it.

The excerpt is the actual rule in my testing instructions. It counts the compiler and existing scenarios among the checks we already have. It also rejects manufacturing a test around behavior we can settle by reading a one-line forwarding body.

Without a named contract, the agent is likely testing the code's current arrangement. Without a distinct failure, it is adding another obligation for a property already covered. In either case, the proposed test has not earned its place.

A failed save should preserve what the user typed. A retried request should not create a second order. An API should return the errors its callers depend on. Those are contracts someone would notice breaking. A public contract can belong to a UI or service just as much as a library.

## Private structure is not the contract

These illustrative assertions describe an implementation: its internal data structure, the order it calls helpers, and the number of times it invokes one of them. A different implementation can preserve every caller-visible promise while failing all three.

Once those assertions are in the suite, a refactor becomes a negotiation with the old implementation. The agent starts changing the test to match the new arrangement. That is exactly the coupling we were supposed to avoid.

The excerpt uses the word header because it comes from a C++ project. In an application, the same distinction applies to an API contract or a component’s visible behavior. A user needs their draft to survive a failed save. They do not need the component to keep that draft in a particular internal object.

For the examples on this slide, remove the private assertions. Keep any public-contract observation that still protects distinct behavior. We do not need a replacement test for every assertion we delete.

## Do not reshape production code to satisfy a test

A generated test may fail because the helper it wants to call is private or is not exported from its module. The wrong response is to expose that helper, move it into a new module, or add an accessor whose only purpose is letting the test inspect internal state.

Now the test has changed the architecture. A previously private decision has a new interface and a new maintenance obligation. We added that surface to accommodate an assertion we should have questioned first.

Ask which public contract the proposed test is trying to protect. If the answer is only that the helper exists, remove it. If there is a real behavior to protect, observe it through the interface that owns that promise.

Separating business logic from a database or external API can be sound design. There is a reason to isolate those responsibilities. A test asking for access to a private helper does not supply that reason on its own.

## Pass-throughs do not earn tests

The wrapper forwards the ID to the customer API client. The proposed test mocks that client, calls the wrapper, and asserts that it forwarded the ID. It has restated the one line we can already read.

The same pattern turns up in library helpers, SDK facades, and internal API clients. A function name does not create another behavior to protect. The source excerpt names the kinds of calls in my C++ project; the reasoning applies just as well to this application code.

The mocked test does not tell us whether the real API accepts the request or returns the response we expect. An integration check can establish that connection. There is no reason to repeat every library or API behavior through a forwarding wrapper.

If our adapter adds retry policy, error translation, or data mapping, there is behavior of our own to examine. Name that contract and the failure worth catching. The wrapper shown here adds none of it.

## Existing checks count

The agent doesn't need to add another test for a failure a check already rejects. A signature mismatch caught by the compiler stays a compile-time check. A second example of the same error needs a different failure to expose, not just another input value.

This is why the test list asks what the scenario alone would catch. It makes the agent examine the checks already present instead of treating every proposed case as a new contribution.

Different inputs can exercise different paths, so the reason for keeping two cases is what differs about their failure. Changing the name of a test or adding another row with the same assertion does not create that distinction.

The same duplication happens across test levels. If the validation suite already covers each distinct refusal, replaying every invalid value through a browser adds startup, network, and UI work to the same checks. Use the browser test for the behavior that needs a browser, such as preserving the draft and displaying the returned error.

## Do not freeze incidental choices into the suite

A demo account has six orders because someone put six orders into the sample data. A test that captures that count now fails when someone adds a seventh to improve the demo. Nothing about loading or displaying orders has broken.

The excerpt is from my rendering project, but the same problem appears with seeded customer accounts, sample records, and demo configuration. If the test needs six orders, create those six as its fixture. The application’s sample account should be free to change without making us rewrite assertions about order handling.

Error tables deserve the same care. My strategy uses one row per error, with each row breaking one rule. If several rules are broken at once, there is no reason to lock in which error wins unless a caller actually depends on a promised ordering.

Before preserving one of these assertions, name who needs the choice to remain fixed. If nobody does, the assertion is maintenance work we can remove.

## Refactoring must leave contract tests intact

The purpose of a regression suite is to let us change the implementation while continuing to tell us whether we broke the behavior. If a behavior-preserving refactor requires rewriting its assertions, the suite was describing the old implementation.

This is the actual instruction in my project file: narrow that test to the contract or delete it. The default response is not to update its mocks, call counts, and private-state expectations until it accepts the new arrangement.

A test failure during a refactor may still expose an accidental behavior change. Trace the failed assertion to the contract before deciding which it is. If the public behavior changed, fix that regression. If the only difference is the private structure the test captured, the test is the problem.

A deliberate contract change is a different decision. Its assertions change because the promise changed. Keeping that distinction intact is what lets the suite remain useful while we replace the code beneath it.

## What chasing 100% coverage can cost

When the acceptance condition is 100% coverage, uncovered private helpers become work the agent has to produce tests for. That gives the remaining lines an importance they may not have to the system's behavior.

The tests start preserving those helpers and their call paths. Then a refactor changes the internals, the suite fails, and the agent rewrites the tests alongside the implementation until everything is green again.

We have now changed the assertions that were supposed to catch regressions in this change. A behavior can disappear while the new tests agree perfectly with the new implementation. The coverage report can still look excellent.

That is how the drive for more coverage destroys the usefulness of the regression harness. Coverage can point us toward an area worth investigating. It cannot give a test a reason to exist. The named contract and the distinct failure still decide whether we write it.

## Stop making a test project for every function

The shape of the suite creates obligations too. An agent can give every helper its own test file and setup code, then add another test job to run it. We end up maintaining a second structure that mirrors the implementation and repeats the same setup.

My instructions say one table-driven scenario per invariant and no executable per function. The excerpt refers to public headers because that project is C++. For an application team, look at the module or component that owns the behavior. Cases for an extracted helper usually belong in that existing suite. A new service or public interface can justify a new suite; another internal function does not automatically justify one.

Expensive immutable input should be prepared once where it can be shared. Mutable state still needs isolation between cases. Rebuilding the same costly fixture is not additional verification.

I inspect test volume and runtime before accepting agent work. My project has a specific comparison against its existing test-to-code ratio; the transferable point is to investigate growth and make the remaining scenarios justify their cost. A large diff full of tests does not get a free pass.

## Do not replay unit tests through the whole system

Suppose the validation suite already checks each distinct way an order can be refused. Replaying all those inputs through a browser makes the same rules more expensive to check without necessarily finding a new failure.

The browser test has something else to establish. When the API refuses a save, does the form show the error and preserve what the user entered? A validation test cannot tell us that. Keep the integration case for that behavior, and let the smaller suite exercise the individual rules.

The excerpt comes from my GPU project, where repeating local checks through a full engine run carries the same cost. For application teams, that cost often comes from starting services, creating database fixtures, and driving a browser for cases that need none of them.

Imported tests need the same examination. A test comes across from another project only if it protects a contract this system actually uses. It does not earn a place because someone already wrote it, or because the agent can port it cheaply.

## Tell Claude what not to write

The prohibition needs to be part of the assignment. Asking for comprehensive tests invites the agent to enumerate functions and branches. I want it to propose only scenarios that protect a named contract and add a failure the current checks do not already catch.

The illustrative prompt names the recurring sources of low-value tests: private helpers, internal data structures, call sequences, library and API pass-throughs, duplicated checks, and incidental settings. It asks the agent to explain omissions as well as additions, so deciding not to write a test is an explicit result.

The excerpt is from my implementer file. The agreed test list is closed. If the agent finds another meaningful failure, it brings back that reason instead of expanding the suite while it codes.

Keep the recurring correction in the project instructions and the detailed procedure with the role or skill. The point is to carry the testing judgment into the next session, not to give every agent another handbook.

## Removing tests is a valid review result

Review cannot mean asking a second model to think of more tests. That is how the suite keeps expanding after we've already decided what the change requires.

The quoted reviewer instruction treats an implementation-coupled or duplicate test as a finding. Missing useful coverage is only one possible result. A test can also assert private structure, repeat a scenario, add a second row for one error, or rebuild input that already exists in a fixture.

Give Opus a separate review context with the plan, contracts, change, and evidence. Ask which tests should be removed or narrowed as well as which distinct failure is still unprotected. The agreed test list gives it something to compare against when the implementation has quietly added more.

The reviewer should identify the assertion and the reason. It does not need to preserve the amount of test code we started with. Removing an obligation that protects nothing is an improvement to the codebase.

## Review the tests already in the change

Use this on a real diff rather than asking Claude to generate another suite. For each changed or proposed test, identify the public contract and the distinct failure. Then decide whether to keep it, narrow it, or remove it.

Pay particular attention to tests that changed alongside a behavior-preserving refactor. Follow those assertions into the old and new implementation. Were they protecting a caller, or were they following the code's private arrangement?

Look for test files and executables added for individual functions, fixtures built repeatedly, and integration checks that reproduce the unit suite. Test volume and runtime help locate the maintenance burden, but the contract decides which checks remain.

The result should be a smaller set of obligations we can explain and continue to rely on. Keep the useful tests. Stop asking the codebase to satisfy the ones that should never have been written.
