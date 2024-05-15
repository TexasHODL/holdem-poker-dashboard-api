export const servers = {
  development: {
    database: [
      {
        id: "database-server-1",
        host: "127.0.0.1",
        port: 6051,
        "auto-restart": true,
      },
    ],
    room: [
      {
        id: "room-server-1",
        host: "127.0.0.1",
        port: 4151,
        "auto-restart": true,
        "restart-force": true,
      },
    ],
    buddy: [
      {
        id: "buddy-server-1",
        host: "127.0.0.1",
        port: 5050,
        "auto-restart": true,
        "restart-force": true,
      },
    ],
    connector: [
      {
        id: "connector-server-1",
        host: "127.0.0.1",
        port: 4050,
        connectHost: "localhost",
        clientPort: 3050,
        frontend: true,
        "auto-restart": true,
      },
    ],
    gate: [
      {
        id: "gate-server-1",
        host: "127.0.0.1",
        port: 4014,
        connectHost: "localhost",
        clientPort: 3014,
        frontend: true,
        "auto-restart": true,
      },
    ],
  },
  production: {
    database: [
      {
        id: "database-server-1",
        host: "127.0.0.1",
        port: 6050,
        "auto-restart": true,
      },
      {
        id: "database-server-2",
        host: "127.0.0.1",
        port: 6051,
        "auto-restart": true,
      },
      {
        id: "database-server-3",
        host: "127.0.0.1",
        port: 6052,
        "auto-restart": true,
      },
    ],
    room: [
      {
        id: "room-server-1",
        host: "127.0.0.1",
        port: 4150,
        "auto-restart": true,
        "restart-force": true,
      },
      {
        id: "room-server-2",
        host: "127.0.0.1",
        port: 4151,
        "auto-restart": true,
        "restart-force": true,
      },
      {
        id: "room-server-3",
        host: "127.0.0.1",
        port: 4152,
        "auto-restart": true,
        "restart-force": true,
      },
    ],
    connector: [
      {
        id: "connector-server-1",
        host: "127.0.0.1",
        port: 4050,
        connectHost: "192.168.2.196",
        clientPort: 3050,
        frontend: true,
        "auto-restart": true,
      },
      {
        id: "connector-server-2",
        host: "127.0.0.1",
        port: 4051,
        connectHost: "192.168.2.196",
        clientPort: 3051,
        frontend: true,
        "auto-restart": true,
      },
      {
        id: "connector-server-3",
        host: "127.0.0.1",
        port: 4052,
        connectHost: "192.168.2.196",
        clientPort: 3052,
        frontend: true,
        "auto-restart": true,
      },
    ],
    gate: [
      {
        id: "gate-server-1",
        host: "127.0.0.1",
        clientPort: 3014,
        port: 4014,
        frontend: true,
        "auto-restart": true,
      },
    ],
  },
  comments: [
    "auth server removed - we were not using",
    "sequence of servers matters - a little",
    "gate after all servers - sequence",
    "in production, use production, change IP and ports only of production, optionally commit",
    ".. add your comments here, and commit",
    {
      id: "room-server-2",
      host: "127.0.0.1",
      port: 4151,
      "auto-restart": true,
      "restart-force": true,
    },
  ],
};
