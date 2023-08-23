
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "increment": "";
"incrementAndComplete": "";
"initAndComplete": "";
"initAndCompleteAndRewatch": "";
"initAndWatching": "";
"initAndWatchingAndRewatch": "";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "canUpdate": "Episode Threshold Reached";
"isCompleted": "";
"isLastEpisode": "";
"isUserAuth": "";
"isWatching": "";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "Awaiting Episode Change State" | "Awaiting Episode Update Event" | "Check Episode Status" | "Check if is Last Episode 1" | "Check if is Last Episode 2" | "Check if is Last Episode 3" | "Do Nothing" | "Increment Episode" | "Increment Episode and Set as Completed" | "Initial state" | "Set Episode as 1 and Set as Completed" | "Set Episode as 1 and Set as Completed and Increment Rewatches" | "Set Episode as 1 and Set as Watching" | "Set Episode as 1 and Set as Watching and Increment Rewatches";
        tags: never;
      }
  