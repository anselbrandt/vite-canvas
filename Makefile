all: githooks

githooks:
	cp pre-commit .git/hooks && chmod +x pre-commit