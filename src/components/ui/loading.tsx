// components/ui/loading.js

import React from 'react'
import { cn } from '@/lib/utils'
import styles from './loading.module.scss'
export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={`${styles.donut}`}></div>
    </div>
  )
}
