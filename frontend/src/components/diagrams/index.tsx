import type { DiagramId } from "@/content/types";
import { AsyncTimeline } from "./AsyncTimeline";
import { CallStack } from "./CallStack";
import { ClassInstances } from "./ClassInstances";
import { CompilePipeline } from "./CompilePipeline";
import { EventLoop } from "./EventLoop";
import { JsonRoundtrip } from "./JsonRoundtrip";
import { UrlTree } from "./UrlTree";
import { ClientServer } from "./ClientServer";
import { Decorators } from "./Decorators";
import { HealthBalancer } from "./HealthBalancer";
import { HttpAnatomy } from "./HttpAnatomy";
import { HttpJourney } from "./HttpJourney";
import { LogAnatomy } from "./LogAnatomy";
import { NestBootstrap } from "./NestBootstrap";
import { RequestLifecycle } from "./RequestLifecycle";
import { RestMatrix } from "./RestMatrix";

const registry: Record<DiagramId, () => React.ReactNode> = {
  "client-server": ClientServer,
  "http-journey": HttpJourney,
  "http-anatomy": HttpAnatomy,
  "rest-matrix": RestMatrix,
  "async-timeline": AsyncTimeline,
  decorators: Decorators,
  "nest-bootstrap": NestBootstrap,
  "request-lifecycle": RequestLifecycle,
  "log-anatomy": LogAnatomy,
  "health-balancer": HealthBalancer,
  "event-loop": EventLoop,
  "json-roundtrip": JsonRoundtrip,
  "class-instances": ClassInstances,
  "compile-pipeline": CompilePipeline,
  "call-stack": CallStack,
  "url-tree": UrlTree,
};

export function Diagram({ id }: { id: DiagramId }) {
  const Component = registry[id];
  return <Component />;
}
