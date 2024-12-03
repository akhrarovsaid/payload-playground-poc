import { ReactElement } from "react";
import type { FileSystemTree, WebContainer } from "@webcontainer/api";
import { Terminal } from "@xterm/xterm";

export interface PlaygroundContextType {
  webContainer?: WebContainer
  terminal?: Terminal
  viewport?: ReactElement
  mountFiles: (files: FileSystemTree) => Promise<void>
  installDependencies: () => Promise<void>
  restartDevServer: () => Promise<void>
  reloadViewport: () => Promise<void>
}
