import { IoCDecorator } from "@force-dev/utils";
import { useRef } from "react";

export const iocHook =
  <T>(ioc: IoCDecorator<T>) =>
  () =>
    useRef(ioc.getInstance()).current;
