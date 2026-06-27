FROM mcr.microsoft.com/devcontainers/base:bookworm

ENV JAVA_HOME=/usr/local/jdk-22
ENV PATH=$JAVA_HOME/bin:$PATH
ENV MAVEN_HOME=/usr/local/maven
ENV MAVEN_VERSION=3.9.16
ENV NVM_DIR=/home/vscode/.nvm
ENV NODE_VERSION=v24.16.0

RUN JDK_URL=$(case "$(uname -m)" in \
        aarch64) echo "https://github.com/adoptium/temurin22-binaries/releases/download/jdk-22.0.2%2B9/OpenJDK22U-jdk_aarch64_linux_hotspot_22.0.2_9.tar.gz" ;; \
        x86_64) echo "https://github.com/adoptium/temurin22-binaries/releases/download/jdk-22.0.2%2B9/OpenJDK22U-jdk_x64_linux_hotspot_22.0.2_9.tar.gz" ;; \
    esac) && \
    mkdir -p /usr/local/jdk-22 && \
    curl -fsSL "$JDK_URL" | tar -xz --strip-components=1 -C /usr/local/jdk-22

RUN curl -fsSL https://dlcdn.apache.org/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz \
    | tar -xz -C /usr/local/ && \
    ln -s /usr/local/apache-maven-$MAVEN_VERSION $MAVEN_HOME && \
    ln -s $MAVEN_HOME/bin/mvn /usr/local/bin/mvn

RUN mkdir -p $NVM_DIR && \
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

SHELL ["/bin/bash", "-c"]

RUN source $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default

ENV NODE_PATH=$NVM_DIR/$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

RUN corepack enable && \
    corepack prepare pnpm@latest --activate

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY backend/pom.xml /tmp/backend-pom.xml
RUN mvn dependency:resolve -f /tmp/backend-pom.xml -q && \
    rm /tmp/backend-pom.xml

CMD ["mvn", "spring-boot:run", "-f", "/workspace/backend/pom.xml"]
