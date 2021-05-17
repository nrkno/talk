import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { CoralContext } from "coral-framework/lib/bootstrap";
import {
  commitMutationPromiseNormalized,
  createMutation,
  MutationInput,
} from "coral-framework/lib/relay";

import { MarkFlagReviewedMutation as MutationTypes } from "coral-admin/__generated__/MarkFlagReviewedMutation.graphql";

export type MarkFlagReviewedInput = MutationInput<MutationTypes> & {
  id: string;
  reviewed: boolean;
};

const mutation = graphql`
  mutation MarkFlagReviewedMutation($input: ReviewCommentFlagInput!) {
    reviewCommentFlag(input: $input) {
      flag {
        id
        reviewed
      }
      clientMutationId
    }
  }
`;

let clientMutationId = 0;

export const MarkFlagReviewedMutation = createMutation(
  "markFlagReviewed",
  async (
    environment: Environment,
    input: MarkFlagReviewedInput,
    context: CoralContext
  ) => {
    const result = await commitMutationPromiseNormalized<MutationTypes>(
      environment,
      {
        mutation,
        variables: {
          input: {
            id: input.id,
            reviewed: input.reviewed,
            clientMutationId: clientMutationId.toString(),
          },
        },
        optimisticResponse: {
          reviewCommentFlag: {
            flag: {
              id: input.id,
              reviewed: input.reviewed,
            },
            clientMutationId: (clientMutationId++).toString(),
          },
        },
        optimisticUpdater: () => {
          // Let Relay handle this
        },
        updater: () => {
          // Let Relay handle this
        },
      }
    );

    return result;
  }
);
