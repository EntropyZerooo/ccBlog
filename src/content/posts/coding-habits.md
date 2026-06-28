---
title: 写代码时我常用的三个习惯
published: 2026-03-15
description: 小步提交、先写测试边界、代码审查前先自己读一遍 diff。
tags: [编程, 习惯, 工程实践]
category: 技术心得
image: /images/covers/coding-habits.jpg
draft: false
---

## 1. 小步提交

每次 commit 只做一件事，message 写清楚「为什么改」而不是「改了什么」。回滚和 code review 都会轻松很多。

## 2. 先界定测试边界

新功能动手前，先列出：**正常路径、空输入、异常、边界值**。不必一次写全测试，但脑子里有这张表，实现时少踩坑。

## 3. 提交 PR 前自己过一遍 diff

站在 reviewer 角度看自己的改动：有没有调试代码、命名是否一致、有没有可以拆出去的小函数。

---

这些都不复杂，坚持一段时间后，返工会明显减少。
