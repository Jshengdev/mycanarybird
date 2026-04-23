'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ── Bird glyph cells ──────────────────────────────────────── */

const CELLS: { col: number; row: number; char: string }[] = [
  {col:39,row:0,char:'%'},{col:40,row:0,char:'%'},{col:41,row:0,char:'%'},{col:42,row:0,char:'%'},
  {col:36,row:1,char:'%'},{col:37,row:1,char:'%'},{col:38,row:1,char:'%'},{col:39,row:1,char:'%'},{col:40,row:1,char:'%'},{col:41,row:1,char:'%'},{col:42,row:1,char:'%'},
  {col:33,row:2,char:'%'},{col:34,row:2,char:'%'},{col:35,row:2,char:'%'},{col:36,row:2,char:'%'},{col:37,row:2,char:'%'},{col:38,row:2,char:'%'},{col:39,row:2,char:'%'},{col:40,row:2,char:'='},{col:41,row:2,char:'~'},{col:42,row:2,char:':'},
  {col:29,row:3,char:'%'},{col:30,row:3,char:'%'},{col:31,row:3,char:'%'},{col:32,row:3,char:'%'},{col:33,row:3,char:'%'},{col:34,row:3,char:'%'},{col:35,row:3,char:'%'},{col:36,row:3,char:'%'},{col:37,row:3,char:'%'},{col:38,row:3,char:'%'},{col:39,row:3,char:':'},{col:40,row:3,char:'.'},{col:41,row:3,char:'.'},{col:42,row:3,char:'.'},
  {col:26,row:4,char:'%'},{col:27,row:4,char:'%'},{col:28,row:4,char:'%'},{col:29,row:4,char:'%'},{col:30,row:4,char:'%'},{col:31,row:4,char:'%'},{col:32,row:4,char:'%'},{col:33,row:4,char:'%'},{col:34,row:4,char:'%'},{col:35,row:4,char:'%'},{col:36,row:4,char:'='},{col:37,row:4,char:'-'},{col:38,row:4,char:'.'},{col:39,row:4,char:'.'},{col:40,row:4,char:"'"},{col:41,row:4,char:'~'},{col:42,row:4,char:'*'},
  {col:23,row:5,char:'%'},{col:24,row:5,char:'%'},{col:25,row:5,char:'%'},{col:26,row:5,char:'%'},{col:27,row:5,char:'%'},{col:28,row:5,char:'%'},{col:29,row:5,char:'%'},{col:30,row:5,char:'%'},{col:31,row:5,char:'%'},{col:32,row:5,char:'%'},{col:33,row:5,char:'%'},{col:34,row:5,char:'%'},{col:35,row:5,char:'.'},{col:36,row:5,char:'.'},{col:37,row:5,char:'.'},{col:38,row:5,char:'.'},{col:39,row:5,char:'+'},{col:40,row:5,char:'*'},{col:41,row:5,char:'*'},{col:42,row:5,char:'*'},
  {col:20,row:6,char:'%'},{col:21,row:6,char:'%'},{col:22,row:6,char:'%'},{col:23,row:6,char:'%'},{col:24,row:6,char:'%'},{col:25,row:6,char:'%'},{col:26,row:6,char:'%'},{col:27,row:6,char:'%'},{col:28,row:6,char:'%'},{col:29,row:6,char:'%'},{col:30,row:6,char:'%'},{col:31,row:6,char:'+'},{col:32,row:6,char:'~'},{col:33,row:6,char:':'},{col:34,row:6,char:'.'},{col:35,row:6,char:'.'},{col:36,row:6,char:"'"},{col:37,row:6,char:'~'},{col:38,row:6,char:'*'},{col:39,row:6,char:'*'},{col:40,row:6,char:'*'},{col:41,row:6,char:'~'},{col:42,row:6,char:':'},
  {col:17,row:7,char:'%'},{col:18,row:7,char:'%'},{col:19,row:7,char:'%'},{col:20,row:7,char:'%'},{col:21,row:7,char:'%'},{col:22,row:7,char:'%'},{col:23,row:7,char:'%'},{col:24,row:7,char:'%'},{col:25,row:7,char:'%'},{col:26,row:7,char:'%'},{col:27,row:7,char:'%'},{col:28,row:7,char:'%'},{col:29,row:7,char:'%'},{col:30,row:7,char:"'"},{col:31,row:7,char:'.'},{col:32,row:7,char:'.'},{col:33,row:7,char:'.'},{col:34,row:7,char:'-'},{col:35,row:7,char:'+'},{col:36,row:7,char:'*'},{col:37,row:7,char:'*'},{col:38,row:7,char:'*'},{col:39,row:7,char:'='},{col:40,row:7,char:'.'},{col:41,row:7,char:'.'},{col:42,row:7,char:'.'},
  {col:15,row:8,char:'%'},{col:16,row:8,char:'%'},{col:17,row:8,char:'%'},{col:18,row:8,char:'%'},{col:19,row:8,char:'%'},{col:20,row:8,char:'%'},{col:21,row:8,char:'%'},{col:22,row:8,char:'%'},{col:23,row:8,char:'%'},{col:24,row:8,char:'%'},{col:25,row:8,char:'%'},{col:26,row:8,char:'%'},{col:27,row:8,char:'~'},{col:28,row:8,char:'-'},{col:29,row:8,char:'.'},{col:30,row:8,char:'.'},{col:31,row:8,char:'.'},{col:32,row:8,char:'-'},{col:33,row:8,char:'*'},{col:34,row:8,char:'*'},{col:35,row:8,char:'*'},{col:36,row:8,char:'*'},{col:37,row:8,char:'+'},{col:38,row:8,char:'~'},{col:39,row:8,char:'.'},{col:40,row:8,char:':'},{col:41,row:8,char:'-'},{col:42,row:8,char:'='},
  {col:13,row:9,char:'%'},{col:14,row:9,char:'%'},{col:15,row:9,char:'%'},{col:16,row:9,char:'%'},{col:17,row:9,char:'%'},{col:18,row:9,char:'%'},{col:19,row:9,char:'%'},{col:20,row:9,char:'%'},{col:21,row:9,char:'%'},{col:22,row:9,char:'%'},{col:23,row:9,char:'%'},{col:24,row:9,char:'%'},{col:25,row:9,char:'='},{col:26,row:9,char:'.'},{col:27,row:9,char:'.'},{col:28,row:9,char:'.'},{col:29,row:9,char:'.'},{col:30,row:9,char:'='},{col:31,row:9,char:'*'},{col:32,row:9,char:'*'},{col:33,row:9,char:'*'},{col:34,row:9,char:'*'},{col:35,row:9,char:'*'},{col:36,row:9,char:"'"},{col:37,row:9,char:'.'},{col:38,row:9,char:'.'},{col:39,row:9,char:':'},{col:40,row:9,char:'='},{col:41,row:9,char:'='},{col:42,row:9,char:':'},
  {col:13,row:10,char:'='},{col:14,row:10,char:'%'},{col:15,row:10,char:'%'},{col:16,row:10,char:'%'},{col:17,row:10,char:'%'},{col:18,row:10,char:'%'},{col:19,row:10,char:'%'},{col:20,row:10,char:'%'},{col:21,row:10,char:'+'},{col:22,row:10,char:'~'},{col:23,row:10,char:'-'},{col:24,row:10,char:'.'},{col:25,row:10,char:'.'},{col:26,row:10,char:'.'},{col:27,row:10,char:'-'},{col:28,row:10,char:'+'},{col:29,row:10,char:'*'},{col:30,row:10,char:'*'},{col:31,row:10,char:'*'},{col:32,row:10,char:'*'},{col:33,row:10,char:'*'},{col:34,row:10,char:'='},{col:35,row:10,char:"'"},{col:36,row:10,char:'.'},{col:37,row:10,char:"'"},{col:38,row:10,char:'='},{col:39,row:10,char:'='},{col:40,row:10,char:'-'},{col:41,row:10,char:'.'},{col:42,row:10,char:"'"},
  {col:13,row:11,char:'.'},{col:14,row:11,char:'='},{col:15,row:11,char:'%'},{col:16,row:11,char:'%'},{col:17,row:11,char:'%'},{col:18,row:11,char:'%'},{col:19,row:11,char:'+'},{col:20,row:11,char:'.'},{col:21,row:11,char:'.'},{col:22,row:11,char:'.'},{col:23,row:11,char:'.'},{col:24,row:11,char:'.'},{col:25,row:11,char:'+'},{col:26,row:11,char:'*'},{col:27,row:11,char:'*'},{col:28,row:11,char:'*'},{col:29,row:11,char:'*'},{col:30,row:11,char:'*'},{col:31,row:11,char:'*'},{col:32,row:11,char:'*'},{col:33,row:11,char:'.'},{col:34,row:11,char:'.'},{col:35,row:11,char:'.'},{col:36,row:11,char:'~'},{col:37,row:11,char:'='},{col:38,row:11,char:'='},{col:39,row:11,char:'~'},{col:40,row:11,char:'.'},{col:41,row:11,char:"'"},
  {col:13,row:12,char:'-'},{col:14,row:12,char:'.'},{col:15,row:12,char:':'},{col:16,row:12,char:'~'},{col:17,row:12,char:':'},{col:18,row:12,char:'.'},{col:19,row:12,char:'.'},{col:20,row:12,char:'.'},{col:21,row:12,char:'.'},{col:22,row:12,char:'-'},{col:23,row:12,char:'~'},{col:24,row:12,char:'*'},{col:25,row:12,char:'*'},{col:26,row:12,char:'*'},{col:27,row:12,char:'*'},{col:28,row:12,char:'*'},{col:29,row:12,char:'*'},{col:30,row:12,char:'*'},{col:31,row:12,char:'-'},{col:32,row:12,char:'.'},{col:33,row:12,char:'.'},{col:34,row:12,char:"'"},{col:35,row:12,char:'='},{col:36,row:12,char:'='},{col:37,row:12,char:'='},{col:38,row:12,char:'.'},{col:39,row:12,char:'.'},{col:40,row:12,char:'*'},
  {col:14,row:13,char:"'"},{col:15,row:13,char:'.'},{col:16,row:13,char:'.'},{col:17,row:13,char:'.'},{col:18,row:13,char:'.'},{col:19,row:13,char:':'},{col:20,row:13,char:'*'},{col:21,row:13,char:'*'},{col:22,row:13,char:'*'},{col:23,row:13,char:'*'},{col:24,row:13,char:'*'},{col:25,row:13,char:'*'},{col:26,row:13,char:'*'},{col:27,row:13,char:'*'},{col:28,row:13,char:'*'},{col:29,row:13,char:'='},{col:30,row:13,char:'.'},{col:31,row:13,char:'.'},{col:32,row:13,char:'-'},{col:33,row:13,char:'='},{col:34,row:13,char:'='},{col:35,row:13,char:'='},{col:36,row:13,char:'='},{col:37,row:13,char:'.'},{col:38,row:13,char:'.'},
  {col:15,row:14,char:'*'},{col:16,row:14,char:'+'},{col:17,row:14,char:'*'},{col:18,row:14,char:'*'},{col:19,row:14,char:'*'},{col:20,row:14,char:'*'},{col:21,row:14,char:'*'},{col:22,row:14,char:'*'},{col:23,row:14,char:'*'},{col:24,row:14,char:'*'},{col:25,row:14,char:'*'},{col:26,row:14,char:'*'},{col:27,row:14,char:'~'},{col:28,row:14,char:'.'},{col:29,row:14,char:'.'},{col:30,row:14,char:"'"},{col:31,row:14,char:'-'},{col:32,row:14,char:'='},{col:33,row:14,char:'='},{col:34,row:14,char:'='},{col:35,row:14,char:"'"},{col:36,row:14,char:'.'},{col:37,row:14,char:'~'},
  {col:13,row:15,char:'*'},{col:14,row:15,char:'*'},{col:15,row:15,char:'*'},{col:16,row:15,char:'*'},{col:17,row:15,char:'*'},{col:18,row:15,char:'*'},{col:19,row:15,char:'*'},{col:20,row:15,char:'*'},{col:21,row:15,char:'*'},{col:22,row:15,char:'*'},{col:23,row:15,char:'*'},{col:24,row:15,char:'*'},{col:25,row:15,char:'*'},{col:26,row:15,char:':'},{col:27,row:15,char:'.'},{col:28,row:15,char:'.'},{col:29,row:15,char:'='},{col:30,row:15,char:'='},{col:31,row:15,char:'='},{col:32,row:15,char:'='},{col:33,row:15,char:'='},{col:34,row:15,char:':'},{col:35,row:15,char:'.'},{col:36,row:15,char:'+'},
  {col:12,row:16,char:'*'},{col:13,row:16,char:'*'},{col:14,row:16,char:'*'},{col:15,row:16,char:'*'},{col:16,row:16,char:'*'},{col:17,row:16,char:'*'},{col:18,row:16,char:'*'},{col:19,row:16,char:'*'},{col:20,row:16,char:'*'},{col:21,row:16,char:'*'},{col:22,row:16,char:'*'},{col:23,row:16,char:'+'},{col:24,row:16,char:'-'},{col:25,row:16,char:'.'},{col:26,row:16,char:'.'},{col:27,row:16,char:'-'},{col:28,row:16,char:'='},{col:29,row:16,char:'='},{col:30,row:16,char:'='},{col:31,row:16,char:'='},{col:32,row:16,char:'-'},{col:33,row:16,char:"'"},{col:34,row:16,char:'-'},{col:35,row:16,char:'='},
  {col:8,row:17,char:'*'},{col:9,row:17,char:'*'},{col:10,row:17,char:'*'},{col:11,row:17,char:'*'},{col:12,row:17,char:'*'},{col:13,row:17,char:'*'},{col:14,row:17,char:'*'},{col:15,row:17,char:'*'},{col:16,row:17,char:'*'},{col:17,row:17,char:'*'},{col:18,row:17,char:'*'},{col:19,row:17,char:'*'},{col:20,row:17,char:'*'},{col:21,row:17,char:'*'},{col:22,row:17,char:':'},{col:23,row:17,char:'.'},{col:24,row:17,char:'.'},{col:25,row:17,char:':'},{col:26,row:17,char:'='},{col:27,row:17,char:'='},{col:28,row:17,char:'='},{col:29,row:17,char:'='},{col:30,row:17,char:'='},{col:31,row:17,char:'~'},{col:32,row:17,char:'.'},{col:33,row:17,char:"'"},
  {col:6,row:18,char:'*'},{col:7,row:18,char:'*'},{col:8,row:18,char:'*'},{col:9,row:18,char:'*'},{col:10,row:18,char:'*'},{col:11,row:18,char:'*'},{col:12,row:18,char:'*'},{col:13,row:18,char:'*'},{col:14,row:18,char:'*'},{col:15,row:18,char:'*'},{col:16,row:18,char:'*'},{col:17,row:18,char:'*'},{col:18,row:18,char:'*'},{col:19,row:18,char:'+'},{col:20,row:18,char:'-'},{col:21,row:18,char:'.'},{col:22,row:18,char:'.'},{col:23,row:18,char:'-'},{col:24,row:18,char:'='},{col:25,row:18,char:'='},{col:26,row:18,char:'='},{col:27,row:18,char:'='},{col:28,row:18,char:'='},{col:29,row:18,char:'='},{col:30,row:18,char:"'"},{col:31,row:18,char:':'},{col:32,row:18,char:'~'},
  {col:4,row:19,char:'*'},{col:5,row:19,char:'*'},{col:6,row:19,char:'*'},{col:7,row:19,char:'*'},{col:8,row:19,char:'*'},{col:9,row:19,char:'*'},{col:10,row:19,char:'*'},{col:11,row:19,char:'*'},{col:12,row:19,char:'*'},{col:13,row:19,char:'*'},{col:14,row:19,char:'*'},{col:15,row:19,char:'*'},{col:16,row:19,char:'*'},{col:17,row:19,char:'*'},{col:18,row:19,char:"'"},{col:19,row:19,char:'.'},{col:20,row:19,char:'.'},{col:21,row:19,char:':'},{col:22,row:19,char:'='},{col:23,row:19,char:'='},{col:24,row:19,char:'='},{col:25,row:19,char:'='},{col:26,row:19,char:'='},{col:27,row:19,char:'='},{col:28,row:19,char:'='},{col:29,row:19,char:'.'},{col:30,row:19,char:'.'},
  {col:2,row:20,char:'*'},{col:3,row:20,char:'*'},{col:4,row:20,char:'*'},{col:5,row:20,char:'*'},{col:6,row:20,char:'*'},{col:7,row:20,char:'*'},{col:8,row:20,char:'*'},{col:9,row:20,char:'*'},{col:10,row:20,char:'*'},{col:11,row:20,char:'*'},{col:12,row:20,char:'*'},{col:13,row:20,char:'*'},{col:14,row:20,char:'*'},{col:15,row:20,char:'*'},{col:16,row:20,char:'~'},{col:17,row:20,char:'.'},{col:18,row:20,char:'.'},{col:19,row:20,char:':'},{col:20,row:20,char:'~'},{col:21,row:20,char:'='},{col:22,row:20,char:'='},{col:23,row:20,char:'='},{col:24,row:20,char:'='},{col:25,row:20,char:'='},{col:26,row:20,char:'='},{col:27,row:20,char:"'"},{col:28,row:20,char:'.'},{col:29,row:20,char:'~'},{col:30,row:20,char:'*'},
  {col:1,row:21,char:'*'},{col:2,row:21,char:'*'},{col:3,row:21,char:'*'},{col:4,row:21,char:'*'},{col:5,row:21,char:'*'},{col:6,row:21,char:'*'},{col:7,row:21,char:'*'},{col:8,row:21,char:'*'},{col:9,row:21,char:'*'},{col:10,row:21,char:'*'},{col:11,row:21,char:'*'},{col:12,row:21,char:'*'},{col:13,row:21,char:'*'},{col:14,row:21,char:'~'},{col:15,row:21,char:'.'},{col:16,row:21,char:'.'},{col:17,row:21,char:'.'},{col:18,row:21,char:'~'},{col:19,row:21,char:'='},{col:20,row:21,char:'='},{col:21,row:21,char:'='},{col:22,row:21,char:'='},{col:23,row:21,char:'='},{col:24,row:21,char:'='},{col:25,row:21,char:'='},{col:26,row:21,char:':'},{col:27,row:21,char:'.'},{col:28,row:21,char:'+'},
  {col:1,row:22,char:'*'},{col:2,row:22,char:'*'},{col:3,row:22,char:'*'},{col:4,row:22,char:'*'},{col:5,row:22,char:'*'},{col:6,row:22,char:'*'},{col:7,row:22,char:'*'},{col:8,row:22,char:'*'},{col:9,row:22,char:'*'},{col:10,row:22,char:'*'},{col:11,row:22,char:'+'},{col:12,row:22,char:'-'},{col:13,row:22,char:'.'},{col:14,row:22,char:'.'},{col:15,row:22,char:'.'},{col:16,row:22,char:'-'},{col:17,row:22,char:'='},{col:18,row:22,char:'='},{col:19,row:22,char:'='},{col:20,row:22,char:'='},{col:21,row:22,char:'='},{col:22,row:22,char:'='},{col:23,row:22,char:'='},{col:24,row:22,char:'-'},{col:25,row:22,char:':'},{col:26,row:22,char:'-'},{col:27,row:22,char:'='},
  {col:0,row:23,char:'+'},{col:1,row:23,char:':'},{col:2,row:23,char:'*'},{col:3,row:23,char:'*'},{col:4,row:23,char:'*'},{col:5,row:23,char:'*'},{col:6,row:23,char:'*'},{col:7,row:23,char:'*'},{col:8,row:23,char:'*'},{col:9,row:23,char:'*'},{col:10,row:23,char:':'},{col:11,row:23,char:'.'},{col:12,row:23,char:'.'},{col:13,row:23,char:'.'},{col:14,row:23,char:'~'},{col:15,row:23,char:'='},{col:16,row:23,char:'='},{col:17,row:23,char:'='},{col:18,row:23,char:'='},{col:19,row:23,char:'='},{col:20,row:23,char:'='},{col:21,row:23,char:'='},{col:22,row:23,char:'='},{col:23,row:23,char:'~'},{col:24,row:23,char:'.'},{col:25,row:23,char:"'"},
  {col:1,row:24,char:'.'},{col:2,row:24,char:"'"},{col:3,row:24,char:'~'},{col:4,row:24,char:'*'},{col:5,row:24,char:'*'},{col:6,row:24,char:'+'},{col:7,row:24,char:'-'},{col:8,row:24,char:"'"},{col:9,row:24,char:'.'},{col:10,row:24,char:'.'},{col:11,row:24,char:'-'},{col:12,row:24,char:'-'},{col:13,row:24,char:'='},{col:14,row:24,char:'='},{col:15,row:24,char:'='},{col:16,row:24,char:'='},{col:17,row:24,char:'='},{col:18,row:24,char:'='},{col:19,row:24,char:'='},{col:20,row:24,char:'='},{col:21,row:24,char:'~'},{col:22,row:24,char:':'},{col:23,row:24,char:'='},
  {col:1,row:25,char:'+'},{col:2,row:25,char:'.'},{col:3,row:25,char:'.'},{col:4,row:25,char:'.'},{col:5,row:25,char:'.'},{col:6,row:25,char:'.'},{col:7,row:25,char:'.'},{col:8,row:25,char:'.'},{col:9,row:25,char:':'},{col:10,row:25,char:'='},{col:11,row:25,char:'='},{col:12,row:25,char:'='},{col:13,row:25,char:'='},{col:14,row:25,char:'='},{col:15,row:25,char:'='},{col:16,row:25,char:'='},{col:17,row:25,char:'='},{col:18,row:25,char:'='},{col:19,row:25,char:'='},{col:20,row:25,char:'='},{col:21,row:25,char:'.'},{col:22,row:25,char:'.'},
  {col:3,row:26,char:'='},{col:4,row:26,char:'-'},{col:5,row:26,char:'-'},{col:6,row:26,char:'='},{col:7,row:26,char:'='},{col:8,row:26,char:'+'},{col:9,row:26,char:'='},{col:10,row:26,char:'='},{col:11,row:26,char:'='},{col:12,row:26,char:'='},{col:13,row:26,char:'='},{col:14,row:26,char:'='},{col:15,row:26,char:'='},{col:16,row:26,char:'='},{col:17,row:26,char:'='},{col:18,row:26,char:'='},{col:19,row:26,char:':'},{col:20,row:26,char:'.'},{col:21,row:26,char:'+'},
  {col:6,row:27,char:'+'},{col:7,row:27,char:'='},{col:8,row:27,char:'='},{col:9,row:27,char:'='},{col:10,row:27,char:'='},{col:11,row:27,char:'='},{col:12,row:27,char:'='},{col:13,row:27,char:'='},{col:14,row:27,char:'='},{col:15,row:27,char:'='},{col:16,row:27,char:'='},{col:17,row:27,char:'-'},{col:18,row:27,char:'.'},{col:19,row:27,char:':'},{col:20,row:27,char:'*'},
  {col:4,row:28,char:'*'},{col:5,row:28,char:'='},{col:6,row:28,char:'='},{col:7,row:28,char:'='},{col:8,row:28,char:'='},{col:9,row:28,char:'='},{col:10,row:28,char:'='},{col:11,row:28,char:'='},{col:12,row:28,char:'='},{col:13,row:28,char:'='},{col:14,row:28,char:'='},{col:15,row:28,char:'~'},{col:16,row:28,char:"'"},{col:17,row:28,char:'.'},{col:18,row:28,char:'~'},{col:19,row:28,char:'*'},
  {col:3,row:29,char:'='},{col:4,row:29,char:'='},{col:5,row:29,char:'='},{col:6,row:29,char:'='},{col:7,row:29,char:'='},{col:8,row:29,char:'='},{col:9,row:29,char:'='},{col:10,row:29,char:'='},{col:11,row:29,char:'='},{col:12,row:29,char:'='},{col:13,row:29,char:'='},{col:14,row:29,char:'='},{col:15,row:29,char:'.'},{col:16,row:29,char:'.'},{col:17,row:29,char:'*'},
  {col:2,row:30,char:'+'},{col:3,row:30,char:'='},{col:4,row:30,char:'='},{col:5,row:30,char:'='},{col:6,row:30,char:'='},{col:7,row:30,char:'='},{col:8,row:30,char:'='},{col:9,row:30,char:'='},{col:10,row:30,char:'='},{col:11,row:30,char:'='},{col:12,row:30,char:'='},{col:13,row:30,char:':'},{col:14,row:30,char:'.'},{col:15,row:30,char:'='},{col:16,row:30,char:'*'},
  {col:1,row:31,char:'*'},{col:2,row:31,char:'='},{col:3,row:31,char:'='},{col:4,row:31,char:'='},{col:5,row:31,char:'='},{col:6,row:31,char:'='},{col:7,row:31,char:'='},{col:8,row:31,char:'='},{col:9,row:31,char:'='},{col:10,row:31,char:'='},{col:11,row:31,char:'-'},{col:12,row:31,char:'.'},{col:13,row:31,char:':'},{col:14,row:31,char:'+'},
  {col:1,row:32,char:'+'},{col:2,row:32,char:"'"},{col:3,row:32,char:'='},{col:4,row:32,char:'='},{col:5,row:32,char:'='},{col:6,row:32,char:'='},{col:7,row:32,char:'='},{col:8,row:32,char:'='},{col:9,row:32,char:"'"},{col:10,row:32,char:'.'},{col:11,row:32,char:'.'},{col:12,row:32,char:'='},{col:13,row:32,char:'*'},
  {col:2,row:33,char:':'},{col:3,row:33,char:':'},{col:4,row:33,char:'~'},{col:5,row:33,char:'~'},{col:6,row:33,char:'~'},{col:7,row:33,char:'-'},{col:8,row:33,char:'.'},{col:9,row:33,char:'.'},{col:10,row:33,char:':'},{col:11,row:33,char:'*'},
  {col:2,row:34,char:'+'},{col:3,row:34,char:'~'},{col:4,row:34,char:'.'},{col:5,row:34,char:'.'},{col:6,row:34,char:'.'},{col:7,row:34,char:'.'},{col:8,row:34,char:'~'},{col:9,row:34,char:'+'},
  {col:3,row:35,char:'*'},{col:4,row:35,char:'*'},{col:5,row:35,char:'*'},{col:6,row:35,char:'*'},{col:7,row:35,char:'*'},
];

const CELL_W = 12;
const CELL_H = 14;
const OFFSET = 20;
const BASE_OPACITY = 0.75;
const MAX_ROW = 35;

/* ── ASCII Panel ───────────────────────────────────────────── */

function AsciiPanel() {
  const spansRef = useRef<Map<string, HTMLSpanElement>>(new Map());
  const panelRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const scanPosRef = useRef(0);
  const loadedRef = useRef(false);

  // Build cell lookup
  const cellMap = useRef(new Map<string, typeof CELLS[0]>());
  useEffect(() => {
    CELLS.forEach((c) => cellMap.current.set(`${c.col},${c.row}`, c));
  }, []);

  const getSpan = useCallback((col: number, row: number) => spansRef.current.get(`${col},${row}`), []);

  const setCell = useCallback((col: number, row: number, char: string, opacity: number) => {
    const el = getSpan(col, row);
    if (!el) return;
    el.textContent = char;
    el.style.color = `rgba(255,255,255,${Math.min(opacity, 1).toFixed(2)})`;
  }, [getSpan]);

  const restoreCell = useCallback((col: number, row: number) => {
    const cell = cellMap.current.get(`${col},${row}`);
    if (!cell) return;
    setCell(col, row, cell.char, BASE_OPACITY);
  }, [setCell]);

  // Animation 1: Row-by-row load-in
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let r = 0; r <= MAX_ROW; r++) {
      timers.push(setTimeout(() => {
        CELLS.filter((c) => c.row === r).forEach((c) => {
          const el = getSpan(c.col, c.row);
          if (el) el.style.opacity = '1';
        });
        if (r === MAX_ROW) loadedRef.current = true;
      }, r * 38));
    }
    return () => timers.forEach(clearTimeout);
  }, [getSpan]);

  // Animation 2: Scan line (starts after load-in)
  useEffect(() => {
    const id = setInterval(() => {
      if (!loadedRef.current) return;
      scanPosRef.current = (scanPosRef.current + 1) % 50;
      const pos = scanPosRef.current;

      // Restore previous columns
      CELLS.forEach((c) => {
        if (c.col === ((pos - 1 + 50) % 50) || c.col === ((pos - 2 + 50) % 50)) {
          restoreCell(c.col, c.row);
        }
      });

      // Set leading + trailing columns
      CELLS.forEach((c) => {
        if (c.col === pos) {
          setCell(c.col, c.row, '%', Math.min(BASE_OPACITY + 0.25, 1.0));
          setTimeout(() => restoreCell(c.col, c.row), 280);
        } else if (c.col === pos + 1) {
          setCell(c.col, c.row, '%', Math.min(BASE_OPACITY + 0.10, 0.92));
          setTimeout(() => restoreCell(c.col, c.row), 200);
        }
      });
    }, 90);
    return () => clearInterval(id);
  }, [setCell, restoreCell]);

  // Animation 3: Mouse hover
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    CELLS.forEach((c) => {
      const cx = c.col * CELL_W + OFFSET + CELL_W / 2;
      const cy = c.row * CELL_H + OFFSET + CELL_H / 2;
      const dx = mouseRef.current!.x - cx;
      const dy = mouseRef.current!.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 56) {
        const t = 1 - dist / 56;
        const ch = t > 0.65 ? '%' : t > 0.30 ? '*' : c.char;
        setCell(c.col, c.row, ch, Math.min(BASE_OPACITY + t * 0.28, 1.0));
      } else {
        restoreCell(c.col, c.row);
      }
    });
  }, [setCell, restoreCell]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = null;
    CELLS.forEach((c) => restoreCell(c.col, c.row));
  }, [restoreCell]);

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ flex: 1, background: '#0B0DC4', position: 'relative', overflow: 'hidden', cursor: 'crosshair', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
    >
      {/* Glyph container — centered vertically, aligned right */}
      <div style={{ position: 'relative', width: `${43 * CELL_W + OFFSET * 2}px`, height: `${36 * CELL_H + OFFSET * 2}px`, flexShrink: 0 }}>
      {CELLS.map((c) => (
        <span
          key={`${c.col},${c.row}`}
          ref={(el) => { if (el) spansRef.current.set(`${c.col},${c.row}`, el); }}
          style={{
            position: 'absolute',
            left: `${c.col * CELL_W + OFFSET}px`,
            top: `${c.row * CELL_H + OFFSET}px`,
            width: `${CELL_W}px`,
            height: `${CELL_H}px`,
            textAlign: 'center',
            color: `rgba(255,255,255,${BASE_OPACITY})`,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            lineHeight: `${CELL_H}px`,
            opacity: 0,
            transition: 'opacity 300ms ease',
          }}
        >
          {c.char}
        </span>
      ))}
      </div>
    </div>
  );
}

/* ── Sign-in Page ──────────────────────────────────────────── */

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [googleHovered, setGoogleHovered] = useState(false);

  const handleSignIn = () => router.push('/');

  return (
    <div className="flex" style={{ height: '100vh' }}>
      {/* LEFT PANEL */}
      <div
        className="flex flex-col justify-center"
        style={{ width: '480px', flexShrink: 0, background: 'var(--card-bg)', padding: '0 56px' }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '40px' }}>
          <img src="/canarylogo.svg" alt="Canary" style={{ height: '24px' }} />
        </div>

        {/* Heading */}
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', fontWeight: 700, color: 'var(--text-black)' }}>
          Sign in to Canary
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--icon-grey)', marginTop: '6px', marginBottom: '36px' }}>
          Monitor your computer-use agents.
        </span>

        {/* Email */}
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: '4px' }}>
          Work email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          style={{
            width: '100%',
            height: '40px',
            border: emailFocused ? '1px solid var(--accent-color)' : '1px solid var(--grey-stroke)',
            boxShadow: emailFocused ? '0 0 0 3px rgba(11,13,196,0.08)' : 'none',
            background: 'white',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            padding: '0 12px',
            borderRadius: '0px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Password */}
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', color: 'var(--icon-grey)', display: 'block', marginBottom: '4px', marginTop: '16px' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          style={{
            width: '100%',
            height: '40px',
            border: passwordFocused ? '1px solid var(--accent-color)' : '1px solid var(--grey-stroke)',
            boxShadow: passwordFocused ? '0 0 0 3px rgba(11,13,196,0.08)' : 'none',
            background: 'white',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            padding: '0 12px',
            borderRadius: '0px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Sign in button */}
        <button
          onClick={handleSignIn}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: '100%',
            height: '40px',
            background: btnHovered ? '#0A0BB0' : 'var(--accent-color)',
            color: 'var(--text-white)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '0px',
            marginTop: '16px',
            transition: 'background 120ms ease',
          }}
        >
          Sign in →
        </button>

        {/* Divider */}
        <div className="flex items-center" style={{ margin: '24px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--grey-stroke)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--icon-grey)', whiteSpace: 'nowrap' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--grey-stroke)' }} />
        </div>

        {/* Google SSO */}
        <button
          onClick={handleSignIn}
          onMouseEnter={() => setGoogleHovered(true)}
          onMouseLeave={() => setGoogleHovered(false)}
          style={{
            width: '100%',
            height: '40px',
            border: googleHovered ? '1px solid var(--accent-color)' : '1px solid var(--grey-stroke)',
            background: 'white',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'var(--text-black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            borderRadius: '0px',
            transition: 'border-color 120ms ease',
            margin: 0,
          }}
        >
          {/* Google logo: 2×2 colored squares */}
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="0" y="0" width="7" height="7" fill="#4285F4" />
            <rect x="9" y="0" width="7" height="7" fill="#34A853" />
            <rect x="0" y="9" width="7" height="7" fill="#FBBC05" />
            <rect x="9" y="9" width="7" height="7" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <div style={{ marginTop: '28px' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--icon-grey)' }}>
            Don&apos;t have an account?{' '}
            <span style={{ color: 'var(--accent-color)', cursor: 'pointer' }}>Request access</span>
          </span>
        </div>
      </div>

      {/* RIGHT PANEL — ASCII Bird */}
      <AsciiPanel />
    </div>
  );
}
