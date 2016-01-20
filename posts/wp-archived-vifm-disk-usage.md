---
layout: post
title: vifm disk usage
tags: archived-from-wp-backup, notes
createdAt: 2013-10-05 18:26:52
layout: post
---

vifm disk usage
---------------
To view disk usage and free space available on disk in vifm, add this to your vifmrc and run in normal mode by typing 'du' or 'df'

```
nmap du :!du -s -BM 1&gt;&amp;2 &amp;&lt;cr&gt;
nmap df :!df . -BM 1&gt;&amp;2 &amp;&lt;cr&gt;
```

du &amp; df are disk usage utilities which if run without forking into the background causes vifm to block. The processes after completing their run return their output to stderr, which vifm displays in a "Background Error" popup. Simple.