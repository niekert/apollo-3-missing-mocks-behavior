import * as React from "react";
import gql from "graphql-tag";
import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { useQuery } from "@apollo/react-hooks";

const SOME_GQL_QUERY = gql`
  query viewer {
    viewer {
      id
    }
  }
`;

const useViewerQuery = () => useQuery(SOME_GQL_QUERY);

const TestComponent = () => {
  const { error, data } = useViewerQuery();

  return error ? <>{`has error: ${error.message}`}</> : <>"No error."</>;
};

describe("ApolloMockProvider", () => {
  test("returns missing mock error as query hook error.", async () => {
    const { container } = render(
      <MockedProvider mocks={[]}>
        <TestComponent />
      </MockedProvider>
    );

    // ensure query is resolved (should use waitForElement etc)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(container.innerHTML).toMatchInlineSnapshot(`
      "has error: Network error: No more mocked responses for the query: query viewer {
        viewer {
          id
          __typename
        }
      }
      , variables: {}"
    `);
  });
});
