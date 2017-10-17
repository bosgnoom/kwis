#!/bin/bash

# Re-route traffic from port 80 to 3000
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

# Start meteor
meteor

