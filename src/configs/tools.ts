import { servers } from "./servers";

const env = (process.env.NODE_ENV && process.env.NODE_ENV) || "development";

export const tools = {
  connectorHost: servers[env].connector[0].connectHost || "127.0.0.1",
  connectorPort: servers[env].connector[0].connectorPort || 3050,
  gateHost: servers[env].gate[0].connectorPort,
  gatePort: servers[env].gate[0].clientPort,
  event: {
    cashGameTableChange: "CASHGAMETABLECHANGE",
  },
  broadcast: {
    tableUpdate: "tableUpdate",
    addTable: "addTable",
    removeTable: "removeTable",
  },
};
