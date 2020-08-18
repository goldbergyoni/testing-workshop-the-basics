#Legend of emojis:‍
WIFM = 🤑, ✅ = Best practice, 🚀 = Advanced, ‍👯‍ = Analogy, 🖼‍ = Cool visual, 📓 = Literature, 😂 = Joke, 💡 = Insight, Term = 📌

# API testing

## Goals

- Confidence
- Like unit but covers more
- Setup is challenging

## Context

- Past - By now we tested only against code objects through a single function, this is called unit test
- Component map - If we look at this diagram that outlines a typical backend, we will find 3 main layers: API, Logic, DB. Each test we wrote by now covers a single object and not the API & the DB 🖼‍
- Cover more surface - What if want to test the overall, all the code that will get shipped to production including the API and the DB? This is called integration test or component test 📌 and is one of the most powerful testing technique that yields more confidence than any other. For many teams the default test approach
- This is an intro - This lesson is an intro to this fascinating technique, to master it we need more than 10 minutes. My backend course covers this with greater details
- The main idea - The idea behind these tests is that we approach the backend like clients through the API and ensure that the response or the new state are satisfactory
- Tech agnostic - I'm going to use Express for my backend here, but one of the coolest ideas is that it works the same for any backend framework like n/s/s because we enter through the API door
- Teaser for test types - We will discuss all these test types in greater details very soon (❗ Problem: Two references)
- Let's test backend through API

## SUT

- Product service - Before testing, let's understand the code that we will about to test. It's the same code that we tested with unit but now I've wrapped with API & pseudo DB
- Two methods definition - API contains two routes, let's see them in POSTMAN tool, the first is adding product, this is a POST request, the URL and this is the body payload. This is they get products by category...
- Two methods code - Let's see the backend implementation, this is a typical Express application. If you're not familiar with Express or backend development then... Line by line... We call the products service, the one from before, it validates the products and call the DB layer...In real world tests you should use here real DB with your preferred framework whether it's mongoose/s/t/knex, for **the** sake of this first demo this code stores thing in-memory and setTimeout
- Test it

## Setup

- Create file - Create add product test, but Hei where do I start the API
- About the setup phase - Integration tests are very similar to unit test, except the setup phase which requires more work and planning. We will use the beforeAll hook to start it, initialize the app - with express it's easy, if you use n/f/s it will require few lines of code, but eventually it all boils down to having a single object that holds the API referenece and also now it listens on the network
- Random port - express get its port from env variable, I won't specify this becuase in testing we randomize ports...✅
- Improve soon - That's OK for a quick test, we will improve few things soon

## Basics

- Back to the test
- First test - add new product, happy path, arrange payload, 
- Describe - arrange per route 🖼‍
- Network client - choose your preferred network client, example with supertest and axios, what I like about supertest, show the response payload, test status and body
- Unified object - Is it successful, let's check, status, body. If we end up with checking too many properties, we can compare objects, let's do it
- Inline snapshot - Small tip, sometimes you don't remember the payload, inline snapshots can generate the response for you, let's first destruct 🖼‍🚀
- Make it fail - As always, let's ensure that the tests fail, I'm going to plant a bug and ensure that the test catches it, where should I put the bug? We'll the cool part of component test is that I can put it anywhere, no matter where, data-access. Let's do this in the API layer and forget to return a body, yeah it fails
- A bug that is not caught - Now I want to show you a special bug that this test won't catch although it should. Comment DAL.save. Will the test pass? hmm, what's wrong with this test?
- Test 3 things - Look at this test, it tests only the response, in many cases we need to test for 3 things, 🖼‍🚀 show diagram of exits, credit to Roy, we need to test the new state, since it's closely related to what we test here we may include this here, I'll prefer to put it in a dedicated test, let's change the name of this test, le's create a new one... 

## Teardown

- BP - Same process ✅

## Clean-up

- BP - Add your own records ✅

## Spice

  - Mini-contract 🚀
  - Merit - exhaustive, black-box 📌, speed graphs 🖼‍, 

## Intrigue

- Challenges - Login, 

## Next

- Test types - which one is better?