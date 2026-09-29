FROM debian:bookworm-slim AS builder

ARG TARGETARCH
ARG MDBOOK_VERSION=0.5.4

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN set -eu; \
    case "${TARGETARCH}" in \
      amd64) MDBOOK_ARCH=x86_64-unknown-linux-musl ;; \
      arm64) MDBOOK_ARCH=aarch64-unknown-linux-musl ;; \
      *) echo "unsupported arch: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl -sL "https://github.com/rust-lang/mdBook/releases/download/v${MDBOOK_VERSION}/mdbook-v${MDBOOK_VERSION}-${MDBOOK_ARCH}.tar.gz" \
    | tar -xz -C /usr/local/bin mdbook

WORKDIR /book
COPY book.toml .
COPY src ./src
COPY theme ./theme
RUN mdbook build

FROM nginx:alpine
COPY --from=builder /book/book /usr/share/nginx/html
EXPOSE 80
