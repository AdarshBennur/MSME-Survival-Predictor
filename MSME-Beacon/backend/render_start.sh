#!/bin/bash
set -euo pipefail
# This script runs when the service starts on Render

# Start the Node.js application with exec to properly handle UNIX signals
exec node server.js
