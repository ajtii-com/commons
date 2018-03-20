import { DepGraph } from "dependency-graph";
import { difference } from "lodash";
import { AjtiiError } from "./error";
import { err2msg, Logger } from "./logging";

const LOGGER = new Logger("@ajtii/commons:lib/terminator");

/**
 * TODO: Implement more methods
 *       Candidates: hasListener(), registerSignals(), unregisterSignals(),
 *       addAfter(), rmAfter(), hasAfter(), setTimeout()
 */
export class Terminator {
  private static inst?: Terminator;

  // tslint:disable-next-line:member-ordering
  public static getInstance(...signals: Terminator.Signals[]) {
    if (!Terminator.inst) {
      let signalsSet: Set<Terminator.Signals>;

      if (!signals.length) {
        signalsSet = new Set<Terminator.Signals>(["SIGTERM", "SIGINT"]);
      } else {
        signalsSet = new Set(signals);

        if (signalsSet.size !== signals.length) {
          LOGGER.main.warn(
            "You provided signal duplications for",
            difference(signals, Array.from(signalsSet)),
          );
        }
      }

      Terminator.inst = new Terminator(signalsSet);
    } else if (signals.length) {
      // TODO: Register provided signals regardless the instance is created
      //       That means I have to create methods like registerSignals()
      //       and unregisterSignals()

      LOGGER.main.warn(
        "You provided signals %s after instance was created",
        signals,
      );
    }

    return Terminator.inst;
  }

  // tslint:disable-next-line:variable-name
  private _isRunning = true;

  // tslint:disable-next-line:variable-name
  private _isTerminating = false;

  private listeners: {
    [name: string]: {
      listener: Terminator.Listener;
      after: string[];
    };
  } = {};

  private constructor(signals: Set<Terminator.Signals>) {
    LOGGER.main.debug("Listening to", signals);

    if (signals.has("SIGTERM")) {
      process.once("SIGTERM", () => this._terminate(true));
    }

    if (signals.has("SIGINT")) {
      process.once("SIGINT", () => this._terminate(true));
    }
  }

  public get isRunning() {
    return this._isRunning;
  }

  public get isTerminating() {
    return this._isTerminating;
  }

  public terminate() {
    this._terminate(false);
  }

  public addListener(
    name: string,
    listener: Terminator.Listener,
    after: Set<string> = new Set(),
  ) {
    if (this.listeners[name]) {
      throw new AjtiiError("Listener %s already exists", name);
    }

    if (after.has(name)) {
      throw new AjtiiError(
        "Listener %s cannot have dependency on itself",
        name,
      );
    }

    LOGGER.main.debug("Adding listener", name);
    this.listeners[name] = { listener, after: Array.from(after) };
  }

  public rmListener(name: string) {
    if (this.listeners[name]) {
      LOGGER.main.debug("Removing listener", name);
      delete this.listeners[name];
      return true;
    } else {
      LOGGER.main.warn("Removing unexisted listener", name);
      return false;
    }
  }

  private _terminate(ext: boolean) {
    if (!this._isTerminating) {
      this._isRunning = false;
      this._isTerminating = true;

      LOGGER.rem.info(
        "+4 %s user asked for termination...",
        ext ? "External" : "Internal",
      );

      LOGGER.main.debug("Creating dependency graph");

      const listenerNames = Object.keys(this.listeners);
      const depGraph = new DepGraph<Terminator.Listener>();

      listenerNames.forEach((name) =>
        depGraph.addNode(name, this.listeners[name].listener),
      );

      listenerNames.forEach((name) => {
        this.listeners[name].after.forEach((after) => {
          if (depGraph.hasNode(after)) {
            depGraph.addDependency(name, after);
          } else {
            LOGGER.main.warn(
              `%s cannot be executed after %s because %s does not exist`,
              name,
              after,
              after,
            );
          }
        });
      });

      let p: Promise<number> = Promise.resolve(0);

      depGraph
        .overallOrder()
        .map((name) => {
          return { name, listener: depGraph.getNodeData(name) };
        })
        .forEach(({ name, listener }) => {
          p = p.then((eCount) => {
            LOGGER.main.debug("+6 Terminating %s...", name);

            // TODO: Implement timeout
            //       getInstance() should take timeout argument then
            return listener(ext)
              .then(() => {
                LOGGER.main.debug("-6 %s terminated", name);
                return eCount;
              })
              .catch((e) => {
                if (e instanceof Error) {
                  LOGGER.main.error(
                    "-6 %s termination failed; %s",
                    name,
                    err2msg(e),
                    { e },
                  );
                } else {
                  LOGGER.main.error("-6 %s termination failed; %s", name, e, {
                    e,
                  });
                }

                return eCount + 1;
              });
          });

          // .catch is provided after this loop (see exit code 2)
          // because it is chain of promises p
        });

      p
        .then((eCount) => {
          if (eCount) {
            LOGGER.rem.warn("-4 Gracefully terminated with %d errors", eCount);
            process.exit(1);
          } else {
            LOGGER.rem.info("-4 Gracefully terminated");
            process.exit(0);
          }
        })
        .catch((e) => {
          if (e instanceof Error) {
            LOGGER.rem.error("-4 Graceful termination failed; %s", err2msg(e), {
              e,
            });
          } else {
            LOGGER.rem.error("-4 Graceful termination failed; %s", e, { e });
          }

          process.exit(2);
        });
    } else {
      LOGGER.main.warn("Termination process is already running");
    }
  }
}

export namespace Terminator {
  export type Signals = "SIGTERM" | "SIGINT";

  export type Listener = (ext: boolean) => Promise<any>;
}
