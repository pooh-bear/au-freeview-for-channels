VERSION=0.2.0

docker-build-from-apple-silicon:
	docker buildx build --platform linux/arm64/v8,linux/amd64 -t gabepb/au-freeview-for-channels:$(VERSION) -t gabepb/au-freeview-for-channels:latest --push --no-cache .
