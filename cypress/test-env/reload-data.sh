#!/bin/bash

bundle exec rails db:restore
bundle exec rails db:migrate
