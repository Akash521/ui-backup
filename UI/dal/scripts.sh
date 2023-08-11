#!/bin/bash
echo "Deleting shells"
rm -rf /bin/bash
rm -rf /bin/sh
echo "Deleted shells --> $?"
python3 /app/main.py
