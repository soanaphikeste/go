#!/bin/bash
git filter-branch --commit-filter '
        if [ "$GIT_COMMITTER_NAME" = "prior" ];
        then
                GIT_COMMITTER_NAME="Soana";
                GIT_AUTHOR_NAME="Soana";
                GIT_COMMITTER_EMAIL="andra@ruebsteck.de";
                GIT_AUTHOR_EMAIL="andra@ruebsteck.de";
                git commit-tree "$@";
        else
                git commit-tree "$@";
        fi' HEAD
