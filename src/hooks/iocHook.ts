import { IoCServiceDecorator, TDecoratorMode } from "@force-dev/utils";
import { useRef } from "react";

export const iocHook =
  <T, M extends TDecoratorMode>(ioc: IoCServiceDecorator<T, M>) =>
  () =>
    useRef(ioc.getInstance()).current;
