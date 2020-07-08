import * as React from "react";
import { render } from "@testing-library/react";
import { gql, useQuery } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";

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

    // hacky way to wait for query to be resolved
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
