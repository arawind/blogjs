---
layout: post
title: NetEM
tags: archived-from-wp-backup, notes
createdAt: 2013-11-14 18:12:18
layout: post
---

NetEM
-----
NetEM - helpful to add latency (on the network that I am, I don't know why I needed to use this!)

Resources:

<a href="http://www.linuxfoundation.org/collaborate/workgroups/networking/netem">http://www.linuxfoundation.org/collaborate/workgroups/networking/netem</a>

<a href="http://mytestbed.net/projects/1/wiki/NetEM_examples_of_rules">http://mytestbed.net/projects/1/wiki/NetEM_examples_of_rules</a>

```
tc qdisc add dev eth0 root handle 1: tbf rate 20kbit buffer 1600 limit 30000
tc qdisc add dev eth0 parent 1:1 handle 10: netem delay 100ms loss 5%
```

&nbsp;