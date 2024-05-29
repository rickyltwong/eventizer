ARG VARIANT=1.1-22-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    ca-certificates fonts-liberation lsb-release xdg-utils wget \
    libfontconfig1-dev curl

RUN corepack enable pnpm
