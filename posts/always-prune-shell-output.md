---
layout: post
title: Trim Your Inputs
tags: new blog, node, mongo, github
---

Trim Your Inputs
-----------------

Using commandline I was trying to get the current branch's ref, and achieved this using `git symbolic-ref HEAD`. This I had to feed it into the node application (for reasons), and ended up using the `child_process.exec` function. I saved the output in the application environment and called it to compare with the GitHub's push event payload's ref parameter. This failed, for obvious reasons which I later realized - I didn't prune the output that came out. A base64 showed me a trailing `Cg==`. :|

I've read a similar issue someone faced with Ruby where the shell output of find (?) was taken as an input to the command. This was a formatted output, with all the jingbang colors and what not, causing ridiculous symbols to appear in the middle. Lesson: When in doubt, prune your input
