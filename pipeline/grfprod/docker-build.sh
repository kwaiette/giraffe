#!/bin/bash
cd /home/ec2-user/src/giraffe/pipeline/grfprod/
sudo /usr/local/bin/docker-compose down
sudo /usr/local/bin/docker-compose build
sudo /usr/local/bin/docker-compose up -d
