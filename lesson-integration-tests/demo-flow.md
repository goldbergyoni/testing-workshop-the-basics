#Legend of emojis:‍
WIFM = 🤑, ✅ = Best practice, 🚀 = Advanced, ‍👯‍ = Analogy, 🖼‍ = Cool visual, 📓 = Literature, 😂 = Joke, 💡 = Insight, Term = 📌

Tasks - simplistic API, Jest warning about cleanup, list of what's next

# API testing

## Goals

- Confidence
- Like unit but covers more
- Setup is challenging

## Context

- Past - In this lesson, we're about to learn about writing tests against backend API, a super-powerful technique that is called Intergation or component test
- Component map - If we look at this diagram that outlines a typical backend, we will find 3 main layers: API, Logic that calc and change data, and data access including DB. The tests we wrote by now covers a single object or module but not the API, the DB and the real requests flow 🖼‍
- Cover more surface - What if want to test the overall, all the code that will get shipped to production including the API and the DB? This is called integration test or component test 📌. This technique is the primary technique for many teams, mostly because it tests the same scenario like production hence it yields more confidence than any other
- The main idea - The idea behind these test is that we approach the backend like clients through the API, by doing HTTP request, and ensuring that the response or the new state are satisfactory
- Tech agnostic - I'm going to use Express for my backend here, however one of the pros of this technique is that since we approach through the API it's framework agnostic, it works the same for any backend framework whether your n/s/s 
- Teaser for future - This lesson is an intro to this fascinating technique, to master it we need more than one short lesson. My backend course covers this with greater details
- Let's test backend through API

## SUT

- Product service - Before testing, let's understand the code that we will about to test. It's the same app that we tested previously but now I've wrapped with API & pseudo DB
- Two methods definition - API contains two routes, let's see them in POSTMAN tool, the first is adding product, this is a POST request, the URL and this is the body payload. This is they get products by category...
- Two methods code - Let's see the backend implementation, this is a typical Express application, again the tests will look the same whether you use other. If you're not familiar with Express or backend development then... Line by line... We call the products service, the one from before, it validates the products and call the DB layer...In real world tests you should use here real DB with your preferred framework whether it's mongoose/s/t/knex, for **the** sake of this first demo this code stores thing in-memory and setTimeout
- Test it

## Setup

- Create file - Create add product test, make it look like POSTMAN 🖼‍, but Hei where do I start the API, make it listen to network requests
- About the setup phase - Integration tests are very similar to unit test, except the setup phase which requires more work and planning. We will use the beforeAll hook to start the API, let's import it first, note that the api file exports the express application, so we can now store it as a file-level variable. Thus far we've done two things: Started the API so it listens to network requests, and also grab a local reference to it. Why do we need the second? Will see in 1min
- Improve soon - That's enough setup for a quick test, we will soon add more logic to the beforeAll

## Basics

- Back to the test
- First test - add new product, happy path, arrange payload,
- Describe - arrange per route 🖼‍
- Network client - choose your preferred network client, example with supertest and axios, what I like about supertest - this is why we stored a local reference, show the response payload, test status and body
- The same process idea - Note that the webserver and the test lives within the same process, some tend to instantiate a different Node process for the backend and one other for the test, since they communicate anyway through the network? This is an anti-pattern becuase then the test won't be able to modify some of the code behaviour like changing env var, config files, and other technique which is called test doubles
- Unified object - Is it successful, let's check, status, body. If we end up with checking too many properties, we can compare objects, let's do it
- Inline snapshot - Small tip, sometimes you don't remember the payload, inline snapshots can generate the response for you, let's first destruct 🖼‍🚀
- Make it fail - As always, let's ensure that the tests fail, I'm going to plant a bug and ensure that the test catches it, where should I put the bug? We'll the cool part of component test is that I can put it anywhere, no matter where, data-access. Let's do this in the API layer and forget to return a body, yeah it fails
- A bug that is not caught - Now I want to show you a special bug that this test won't catch although it should. Comment DAL.save. Will the test pass? hmm, what's wrong with this test? 💡
- Test 3 things - Look at this test, it tests only the response but not if the product was actually saved, in many cases we need to test for 3 things, 🖼‍🚀 show diagram of exits, credit to Roy, we need to test the new state, since it's closely related to what we test here we may include this here, I'll prefer to put it in a dedicated test, let's change the name of this test, le's create a new one...
- Test for state - Create test, we will see a twist soon, let's approach but we don't care about the response, now for he assertion, how do we check that the product was saved? Some check that the DB layer was called - will explore this techniques later, some may approach the DB directly, but whenever possible the best approach is through the public API - this way our test is not coupled to the internals. Let's make it fail, now it pass!

## Teardown

- Error open handles - Our test pass, but there is an error message here, this means that we don't close resources like web server or DB and with time it will choke us. Why? I'll explain in 1min, I want to surface one other problem here
- Error port - Currently our web server is setting a port, this works when you have one file but will fail as you write your second test file. Let's see, copy-paste, see failure, why this happens? why will the resource leakage choke our computer with time? Becuase test files run in parallel, let's understand briefly how test runners operate
- Multi-process mode - Every modern test runner run tests in multi worker processes. Let's see a typical runner runtime, for a start a single setup process is running, doing tasks like reading all the test files, transpiling the code if needed, running the global hooks, then it instantiates multi worker processes that run the test themselves. Every test file might run at the same time on a different process so they share resources ports, database tables.
- Example of when might go wrong - If test A open port X, then test B which uses the same Express file then is invoked and tries to open the same port - it will fail. One other example, if test A doesn't clean-up after itself and leave the the web server & DB connection open, many other tests will run using these processes. Mostly
- Solution to port - Solving the port challenge is easy, just avoid specifying port and any modern web framework will be happy to randomize one for you. This is a best practice to keep - ✅ Allow test parallelization, randomize port, don't lock
- Better teardown - The second issue present a small challenge, we hope to clean-up in the afterAll event, but we don't have access to the server object that holds the connection. This can be solved by making the API code expose methods or object for this. I noted two styles at the wild, I let you choose your preferred one. The first option is by delegating the network list to the test, so the API file just defines all route, but we take this code and put it in the test. What about production code, the none-testing code, it should have some js file that opens the connection and this is a good pattern regardless of testing - separate the API logical definition from the network binding. Now that we control the connection, it's easy to store it globally and then on the afterAll hook close it. This is the message disappeared. One more style, is by making the API expose start and stop methods, see here. Now the API can call start and stop. Which is your preferred style? In any case, both are good but as a best practice a testable code should allow callers to dispose its resources. Note that in this lesson we didn't setup the DB, this is a big part of integration testing and we will cover this in backend lessons

## Clean-up

- Intro - Note that we didn't clean-up the DB records that were created, in the next part let's see when previous data might lead to failures, then when & how the clean-up the DB
- Duplication test - Let's create another test, this time let's delete a product, we're going to face some issue but like always, find the best solutions. Test is about when deleting an existing product, we get back a positive response. For a start, let's add a new product, the same name, then delete it, ensure the response is 204 which means positive response, let's run it and it fails (❗️How?), this product already exists, we have added it in a previous test. Let's see 2 inferior solutions to this and then the best practice solution
- Solution 1: Choose different names - We can just add only unique books, for example, this might work but it forces us to look at all the previous tests. It's simpler when each test is not depend at all at previous tests. It's not a bad solution, it can work but there is a better alternative
- Solution 2: Clean-up before each test - A popular approach is to clean-up the entire DB before or after each test. It sounds promising, every test starts with a clean DB, but it won't work in a modern test runner that utilizes multiple processes. To understand this, let's see how Jest and modern test runners work...
- BP - Add your own records ✅

## Spice

- Mini-contract 🚀


## Closing

- Merit - This was our first touch on backend testing, note that this technique is powerful as it covers all the layers, it encouraging approaching the backend and thinking like the user, it works the same for every technology whether it's serverless with Express or Fastify in Kubernetes and it's also quite fast - With the right setup, we can reach to run 100 tests with real world DB interaction in 2.5 seconds
- Reference - There is much more to it, it's a powerful technique, if you plan includes the backend course there are many lessons on this
- For example, we discussed how to basic tests, start and teardown API, randomize ports, what about: Spinning DB, cleaning records, preventing calls to other services, testing with Docker, migration, message queues  
- Test types - We've a learned a new test type and now we're familiar with unit and integration tests. which one is better? Where to use each? Let's answer this in the next lesson about test types
