'use client';

import styles from '../../public/css/loader.module.css';

import { usePersContext } from '../app/contexts/usePersContext';

import { Loader } from "../components/loader";

// default loader icon for between-page navigation loading
export default function Loading() {
  const {features} = usePersContext();
  return (
    <div className={styles.overlayContainer}>
      <div className={styles.loaderIcon}>
        <Loader fill={features.fontColor} />
      </div>
    </div>
  );
}