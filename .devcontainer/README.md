# DevContainer Setup in VS Code

## Introduction

A DevContainer allows you to define a complete development environment, including its dependencies and configurations, within a Docker container. This guide will walk you through the steps to set up and use a DevContainer in Visual Studio Code (VS Code).

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Remote - Containers extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Setting Up DevContainer

1. **Install Necessary Extensions**:

   - Open VS Code.
   - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or pressing `Ctrl+Shift+X`.
   - Search for "Remote - Containers" and install it.

2. **Create a DevContainer Configuration**:

   - Open your project in VS Code.
   - Open the Command Palette (`Ctrl+Shift+P`).
   - Type `Remote-Containers: Add Development Container Configuration Files` and select it.
   - Choose a suitable predefined configuration from the list or create a custom one. This will add a `.devcontainer` folder to your project with a `devcontainer.json` file and optionally a `Dockerfile` or `docker-compose.yml`.

3. **Configure DevContainer**:

   - Open the `.devcontainer/devcontainer.json` file.
   - Customize the configuration as needed. For example, you can specify the Docker image, extensions to install, environment variables, and other settings. Here is an example configuration:

   ```json
   {
     "name": "Node.js DevContainer",
     "image": "mcr.microsoft.com/vscode/devcontainers/javascript-node:0-14",
     "settings": {
       "terminal.integrated.shell.linux": "/bin/bash"
     },
     "extensions": ["dbaeumer.vscode-eslint"],
     "postCreateCommand": "npm install",
     "remoteUser": "vscode"
   }
   ```

4. **Open the Project in the DevContainer**:

   - Open the Command Palette (`Ctrl+Shift+P`).
   - Type `Remote-Containers: Reopen in Container` and select it.
   - VS Code will rebuild the container (if necessary) and reopen the project inside the container.

5. **Develop Within the DevContainer**:
   - You are now inside the DevContainer, which means any code you write and run is within this isolated environment.
   - You can open a terminal within VS Code (`Ctrl+Shift+`) and run commands as if you were inside the container.
   - VS Code extensions specified in the `devcontainer.json` file will be installed automatically.
