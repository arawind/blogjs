---
layout: post
title: Wireless is disabled by hardware switch
tags: archived-from-wp-backup, notes
createdAt: 2013-07-31 08:44:50
layout: post
---

Wireless is disabled by hardware switch
---------------------------------------
Encountered on a Dell Vostro, <a href="http://askubuntu.com/a/147051">this solution in askubuntu.com</a> helped.

Reposting the same here:

```
sudo rmmod dell_laptop
```


```
echo 'blacklist dell_laptop' | sudo tee /etc/modprobe.d/blacklist-custom
```

Sometimes a simple

```
sudo rfkill unblock all
```

does it all