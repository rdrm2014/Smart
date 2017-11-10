#!/bin/bash
var=`ps -aef | grep $1 | grep -v sh | grep -v grep | awk '{print $2}'`
if [ -z "$var" ]
then
  echo $1 process is not running
else
  kill -9 $var
  echo $1 process killed forcefully, process id $var.
fi