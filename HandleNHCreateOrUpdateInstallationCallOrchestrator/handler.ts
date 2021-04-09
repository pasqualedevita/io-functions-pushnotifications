import { Task } from "durable-functions/lib/src/classes";
import * as t from "io-ts";
import * as o from "../utils/durable/orchestrators";

import { CreateOrUpdateInstallationMessage } from "../generated/notifications/CreateOrUpdateInstallationMessage";
import { ActivityInput as CreateOrUpdateActivityInput } from "../HandleNHCreateOrUpdateInstallationCallActivity";
import { NotificationHubConfig } from "../utils/notificationhubServicePartition";

export const OrchestratorName =
  "HandleNHCreateOrUpdateInstallationCallOrchestrator";

/**
 * Carries information about Notification Hub Message payload
 */
export const NhCreateOrUpdateInstallationOrchestratorCallInput = t.interface({
  message: CreateOrUpdateInstallationMessage
});

export type NhCreateOrUpdateInstallationOrchestratorCallInput = t.TypeOf<
  typeof NhCreateOrUpdateInstallationOrchestratorCallInput
>;

interface IHandlerParams {
  createOrUpdateActivity: o.CallableActivity<CreateOrUpdateActivityInput>;
  notificationHubConfig: NotificationHubConfig;
}

export const getHandler = ({
  createOrUpdateActivity,
  notificationHubConfig
}: IHandlerParams) => {
  return o.createOrchestrator(
    OrchestratorName,
    NhCreateOrUpdateInstallationOrchestratorCallInput,
    function*({
      context,
      input: {
        message: { installationId, platform, pushChannel, tags }
      }
    }): Generator<Task, void, Task> {
      yield* createOrUpdateActivity(context, {
        installationId,
        notificationHubConfig,
        platform,
        pushChannel,
        tags
      });
    }
  );
};