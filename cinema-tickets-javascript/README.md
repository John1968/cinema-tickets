# About the service

## Testing approach

I have tried to follow a test driven development approach in writing this application.
This approach has helped in ensuring the requirements of the brief have been achieved.

I have used the Jest testing framework for both the unit tests and coverage.

## Running the tests

### Unit tests

To run the unit tests run the command below:

```npm run jest:test```

### Code coverage

I have achieved 100% coverage on any files I have added. Code coverage can be run with the following command:

```npm run quality:coverage```

The output can be viewed in the `coverage/lcov-report` directory.

### Other tests

I have also included eslint using the DWP config to try to keep my code clean.

```npm run quality:lint```

In a working environment, I would usually use husky to run these quality jobs as a pre-commit hook.


